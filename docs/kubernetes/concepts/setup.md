---
sidebar_position: 2
---

# Tạo Cluster
[Tham Khảo](https://xuanthulab.net/gioi-thieu-va-cai-dat-kubernetes-cluster.html)

## Tạo Cluster
Phần này sẽ tạo ra một Cluster Kubernetes hoàn chỉnh từ 3 máy (3 VPS - hay 3 Server) chạy CentOS, bạn có thể dùng cách này khi triển khai môi trường product. Hệ thống này gồm:

Tên máy/Hostname|Thông tin hệ thống|Vai trò
:--|:--|:--
master.xtl|  	HĐH CentOS7, Docker CE, Kubernetes. Địa chỉ IP 172.16.10.100|	Khởi tạo là master
worker1.xtl|	HĐH CentOS7, Docker CE, Kubernetes. Địa chỉ IP 172.16.10.101|	Khởi tạo là worker
worker2.xtl|	HĐH CentOS7, Docker CE, Kubernetes. Địa chỉ IP 172.16.10.102|	Khởi tạo là worker

Để có hệ thống 3 máy trên khi chưa có điều kiện mua các VPS thực thụ thì sẽ dùng máy ảo VirtualBox

**Hãy tạo ra một thư mục đặt tên kubernetes-centos7 để chứa các file cấu hình Vagrant**

`Tạo máy Master Kubernetes`

Tạo thự mục con master, tạo trong nó file vagrantfile như sau:

`kubernetes-centos7/master/Vagrantfile`

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Tạo máy ảo từ box centos/7, gán địa chỉ IP, đặt hostname, gán 2GB bộ nhớ, 2 cpus
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.network "private_network", ip: "172.16.10.100"
  config.vm.hostname = "master.xtl"

  config.vm.provider "virtualbox" do |vb|
     vb.name = "master.xtl"
     vb.cpus = 2
     vb.memory = "2048"
  end

  # Chạy file install-docker-kube.sh sau khi nạp Box
  config.vm.provision "shell", path: "./../install-docker-kube.sh"

  # Chạy các lệnh shell
  config.vm.provision "shell", inline: <<-SHELL
    # Đặt pass 123 có tài khoản root và cho phép SSH
    echo "123" | passwd --stdin root
    sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
    systemctl reload sshd
# Ghi nội dung sau ra file /etc/hosts để truy cập được các máy theo HOSTNAME
cat >>/etc/hosts<<EOF
172.16.10.100 master.xtl
172.16.10.101 worker1.xtl
172.16.10.102 worker2.xtl
EOF

  SHELL
end
```

`kubernetes-centos7/install-docker-kube.sh`

```
#!/bin/bash

# Cập nhật 12/2019

# Cai dat Docker
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum update -y && yum install docker-ce-18.06.2.ce -y
usermod -aG docker $(whoami)

## Create /etc/docker directory.
mkdir /etc/docker

# Setup daemon.
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

mkdir -p /etc/systemd/system/docker.service.d


# Restart Docker
systemctl enable docker.service
systemctl daemon-reload
systemctl restart docker


# Tat SELinux
setenforce 0
sed -i --follow-symlinks 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux

# Tat Firewall
systemctl disable firewalld >/dev/null 2>&1
systemctl stop firewalld

# sysctl
cat >>/etc/sysctl.d/kubernetes.conf<<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system >/dev/null 2>&1

# Tat swap
sed -i '/swap/d' /etc/fstab
swapoff -a

# Add yum repo file for Kubernetes
cat >>/etc/yum.repos.d/kubernetes.repo<<EOF
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

yum install -y -q kubeadm kubelet kubectl

systemctl enable kubelet
systemctl start kubelet

# Configure NetworkManager before attempting to use Calico networking.
cat >>/etc/NetworkManager/conf.d/calico.conf<<EOF
[keyfile]
unmanaged-devices=interface-name:cali*;interface-name:tunl*
EOF
```

Thiết lập file chạy được

`chmode +x install-docker-kube.sh`

Tại thư mục kubernetes-centos7/master/ gõ lệnh vagrant để tạo máy master.xtl

`vagrant up`

Sau lệnh này, quá trình cài đặt diễn ra, kết thúc thì có máy ảo VirtualBox với tên master.xtl trong đó đã có Docker, kubelet đang chạy ở địa chỉ IP 172.16.10.100, hãy ssh vào máy này bằng lệnh ssh với tài khoản root có cấu hình pass là 123 ở trên.

## Khởi tạo Cluster
Trong lệnh khởi tạo cluster có tham số --pod-network-cidr để chọn cấu hình mạng của POD, do dự định dùng Addon calico nên chọn --pod-network-cidr=192.168.0.0/16

**Gõ lệnh sau để khở tạo là nút master của Cluster**

`kubeadm init --apiserver-advertise-address=172.16.10.100 --pod-network-cidr=192.168.0.0/16`

Sau khi lệnh chạy xong, chạy tiếp cụm lệnh nó yêu cầu chạy sau khi khởi tạo- để chép file cấu hình đảm bảo trình kubectl trên máy này kết nối Cluster

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Tiếp đó, nó yêu cầu cài đặt một Plugin mạng trong các Plugin tại [addon](https://kubernetes.io/docs/concepts/cluster-administration/addons/), ở đây đã chọn calico, nên chạy lệnh sau để cài nó

```
kubectl apply -f https://docs.projectcalico.org/v3.10/manifests/calico.yaml
```

Gõ vài lệnh sau để kiểm tra

```
# Thông tin cluster
kubectl cluster-info
# Các node trong cluster
kubectl get nodes
# Các pod đang chạy trong tất cả các namespace
kubectl get pods -A
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes005.png)

Vậy là đã có Cluster với 1 node!

## Kết nối Node vào Cluster
Hãy vào máy node master (bằng SSH `ssh root@172.16.10.100`). Thực hiện lệnh sau với Cluster để lấy lệnh kết nối

`kubeadm token create --print-join-command`

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes008.png)

Nó cho nội dung lệnh kubeadm join ... thực hiện lệnh này trên các node worker thì node worker sẽ nối vào Cluster

SSH vào máy `worker1, worker2` và thực hiện kết nối

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes009.png)

Giờ kiểm tra các node có trong Cluster

`kubectl get nodes`

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes010.png)

> Đến đây bạn đã biết khởi tạo một Cluster từ Docker Destop hay một Cluster phức tạp 3 node thực thụ, tuy nhiên quá trình cài đặt vẫn chưa hoàn thành, các công cụ cần để dễ dàng làm việc với Kubernetes sẽ tiếp tục ở bài sau, nhưng hiện giờ bạn đã biết các lệnh:

```
# khởi tạo một Cluster
kubeadm init --apiserver-advertise-address=172.16.10.100 --pod-network-cidr=192.168.0.0/16

# Cài đặt giao diện mạng calico sử dụng bởi các Pod
kubectl apply -f https://docs.projectcalico.org/v3.10/manifests/calico.yaml

# Thông tin cluster
kubectl cluster-info

# Các node (máy) trong cluster
kubectl get nodes

# Các pod (chứa container) đang chạy trong tất cả các namespace
kubectl get pods -A

# Xem nội dung cấu hình hiện tại của kubectl
kubectl config view

# Thiết lập file cấu hình kubectl sử dụng cho 1 phiên làm việc hiện tại của termianl
export KUBECONFIG=/Users/xuanthulab/.kube/config-mycluster

# Gộp file cấu hình kubectl
export KUBECONFIG=~/.kube/config:~/.kube/config-mycluster
kubectl config view --flatten > ~/.kube/config_temp
mv ~/.kube/config_temp ~/.kube/config

# Các ngữ cảnh hiện có trong config
kubectl config get-contexts

# Đổi ngữ cảnh làm việc (kết nối đến cluster nào)
kubectl config use-context kubernetes-admin@kubernetes

# Lấy mã kết nối vào Cluster
kubeadm token create --print-join-command

# node worker kết nối vào Cluster
kubeadm join 172.16.10.100:6443 --token 5ajhhs.atikwelbpr0 ...
```

### Cấu hình kubectl máy trạm truy cập đến các Cluster
K8s đọc file cấu hình ở đường dẫn $HOME/.kube/config để biết các thông số để kết nối đến Cluster.
```
kubectl config view
```

Copy file `/root/.kube/config` cấu hình trên máy master về máy tính. Không ghi đè lên file hiện tại
```
scp root@172.16.10.100:/etc/kubernetes/admin.conf ~/.kube/config-mycluster
```

Vậy trên máy của tôi đang có 2 file cấu hình
```
/User/your_name/.kube/config-mycluster cấu hình kết nối đến Cluster mới tạo ở trên
/User/your_name/.kube/config cấu hình kết nối đến Cluster cục bộ của bản Kubernetes có sẵn của Docker
```

Muốn k8s sử dụng file cấu hình nào thì gán biến `KUBECONFIG` đến đường dẫn đó
```
export KUBECONFIG=/Users/your_name/.kube/config-mycluster
```

### Sử dụng các context trong cấu hình kubectl
`context` là ngữ cảnh sử dụng, mỗi ngữ cảnh có tên trong đó có thông tin `user và cluster`.

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes006.png)

Ở file trên bạn thấy mục `current-context` là `context` với tên `docker-desktop`, có nghĩa là kết nối đến cluster có tên `docker-desktop` với user là `docker-desktop`

Giờ bạn sẽ thực hiện kết hợp 2 file: `config` và `config-mycluster` thành 1 và lưu trở lại `config`.

```
export KUBECONFIG=~/.kube/config:~/.kube/config-mycluster
kubectl config view --flatten > ~/.kube/config_temp
mv ~/.kube/config_temp ~/.kube/config
```

Như vậy trong file cấu hình đã có các ngữ cảnh khác nhau để sử dụng, đóng terminal và mở lại rồi gõ lệnh, có các ngữ cảnh nào

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes007.png)

`kubectl config use-context kubernetes-admin@kubernetes`

> Như vậy sử dụng context, giúp bạn lưu và chuyển đổi dễ dàng các loại kết nối đến các cluster của bạn
