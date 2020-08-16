---
id: kuber
title: Kubernetes
sidebar_label: Kubernetes
---

![](https://topdev.vn/blog/wp-content/uploads/2019/05/Kubernetes.png)

[API Kubernetes](https://v1-16.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#pod-v1-core)
## 1. Khái niệm
Kubernetes là dự án mã nguồn dể quản lý các container, automating deployment, scaling and manegement các ứng dụng trên container. (Tạo xóa sửa xếp lịch, scale trên nhiều máy) 

### Cài đặt Kubernetes Dashboard On mac

[Tham khảo](https://medium.com/backbase/kubernetes-in-local-the-easy-way-f8ef2b98be68)

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc3/aio/deploy/recommended.yaml

kubectl proxy
```

Now access you can access Dashboard at:

```
http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

You will see the following screen:

![](https://miro.medium.com/max/1400/1*Y-Y2_S25E2KieRB1sNVqWA.png)

To find a valid token here you have a useful one-liner

```
> kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | awk '/^deployment-controller-token-/{print $1}') | awk '$1=="token:"{print $2}'

eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZXBsb3ltZW50LWNvbnRyb2xsZXItdG9rZW4tZnp3NzgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGVwbG95bWVudC1jb250cm9sbGVyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiOWJmOGE4ZDAtZDg1Ny00YzBlLThmNzktZDk3MDEyZDBjMjU5Iiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmRlcGxveW1lbnQtY29udHJvbGxlciJ9.H_6nQYQ1ltSHUTddNgUjpRHKe82hC-ipL0S_08lK90rWE0hZir9fq1H9LhEyjSgt3QVIYCEiG8qiIqkQO0I2dvQN_CbQHnLl6dmhlrn7astFdu2F621plNQaC6MHfL5YTsTfJEER2sx5qDuEgtZXobWQ8-64w2d6RfHEIFZIxmno8Oj7XccjfBv12p74qyleJYIOBSuglaHyOx8RaDROCkW0OR-9DHa4zlcU28YqW83J3ynxjwqPvu_QzUc5xcycUk1nEfjWZORjH9A1D_Qdj5DNud7g1Pa_HHQZ50LBjIWKmwNLF7CSA-__goCPfWFfcC_gHANhFAfGYeU5sKWz9g
```

Copy & paste that token into the field and click Sign In to login, the dashboard will show as below:

![](https://miro.medium.com/max/1400/1*LWAiiOJMuMsLkN6S36llDg.png)


Now, let us go back to the Dashboard and get to the Pods via the Pods link in the Workloads as shown below:

![](https://miro.medium.com/max/1400/1*ce98Pun7cZMLU9tSXSncAw.png)

### Tạo Cluster Kubernetes

[Tham Khảo](https://xuanthulab.net/gioi-thieu-va-cai-dat-kubernetes-cluster.html)

Để có một Kubernetes cần có các máy chủ (ít nhất một máy), trên các máy cài đặt Docker và Kubernetes. Một máy khởi tạo là master và các máy khác là worker kết nối vào. Có nhiều cách để có Cluster Kubernetes, như cài đặt minikube để có kubernetes một nút (node) để thực hành (môi trường chạy thử), hay dùng ngay Kubernetes trong Docker Desktop, hay cài đặt một hệ thống đầy đủ (Cài Docker, Cài và khởi tạo Cluster Kubernetes), hay mua từ các nhà cung cấp dịch vụ như Google Cloud Platform, AWS, Azuze ...

#### Tạo Cluster Kubernetes hoàn chỉnh
Phần này sẽ tạo ra một Cluster Kubernetes hoàn chỉnh từ 3 máy (3 VPS - hay 3 Server) chạy CentOS, bạn có thể dùng cách này khi triển khai môi trường product. Hệ thống này gồm:

Tên máy/Hostname|Thông tin hệ thống|Vai trò
:--|:--|:--
master.xtl|	HĐH CentOS7, Docker CE, Kubernetes. Địa chỉ IP 172.16.10.100|	Khởi tạo là master
worker1.xtl|	HĐH CentOS7, Docker CE, Kubernetes. Địa chỉ IP 172.16.10.101|	Khởi tạo là worker
worker2.xtl|	HĐH CentOS7, Docker CE, Kubernetes. Địa chỉ IP 172.16.10.102|	Khởi tạo là worker

Để có hệ thống 3 máy trên khi chưa có điều kiện mua các VPS thực thụ thì sẽ dùng máy ảo VirtualBox. Bạn có thể tải về hệ điều hành CentOS 7, cài đặt từng bước rồi tiến hành cấu hình. Tuy nhiên ở đây, nhằm nhanh chóng sẽ sử dụng Vagrant giúp tự động hóa quá trình tạo 3 máy ảo trên VirtualBox (nếu bạn chưa biết Vagrant thì xem: Sử dụng Vagrant trước). Đây là quá trình cài đặt phức tạp, cố gắng thực hiện tuần tự từng bước!

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

#### Khởi tạo Cluster
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

#### Kết nối Node vào Cluster
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

#### Cấu hình kubectl máy trạm truy cập đến các Cluster
Khi thi hành kubectl, thì nó đọc file cấu hình ở đường dẫn $HOME/.kube/config để biết các thông số để kết nối đến Cluster.

Trở lại máy Host, để xem nội dung cấu hình kubectl gõ lệnh

`kubectl config view`

Tại máy master ở trên, có file cấu hình cho tại `/root/.kube/config`, ta copy file cấu hình này ra lưu thành file `config-mycluster (không ghi đè vào config hiện tại của máy HOST)`

`scp root@172.16.10.100:/etc/kubernetes/admin.conf ~/.kube/config-mycluster`

Vậy trên máy của tôi đang có 2 file cấu hình

```
/User/your_name/.kube/config-mycluster cấu hình kết nối đến Cluster mới tạo ở trên
/User/your_name/.kube/config cấu hình kết nối đến Cluster cục bộ của bản Kubernetes có sẵn của Docker
```

Nếu muốn yêu cầu kubectl sử dụng ngay file cấu hình nào đó, thì gán biến môi trường KUBECONFIG bằng đường dẫn file cấu hình, ví dụ sử dụng file cấu hình config-mycluster

`export KUBECONFIG=/Users/your_name/.kube/config-mycluster`

Sau lệnh đó thì kubectl sẽ dùng config-mycluster để có thông tin kết nối đến, nhưng trường hợp này chỉ có hiệu lực trong một phiên làm việc, ví dụ nếu bạn đóng terminal và mở lại thì lại phải thiết lập lại biến môi trường như trên.

#### Sử dụng các context trong cấu hình kubectl
Khi bạn xem nội dung config với lệnh `kubectl config view`, bạn thấy rằng nó khai báo có các mục cluster là thông tin của cluster với tên, user thông tin user được đăng nhập, `context` là ngữ cảnh sử dụng, mỗi ngữ cảnh có tên trong đó có thông tin `user và cluster`.

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

### 1.1 Pod
- [Tham khảo](https://xuanthulab.net/tim-hieu-ve-pod-va-node-trong-kubernetes.html)

- Pod là 1 nhóm các container chứa ứng gdụn cùng chia sẽ các tài gnuyên lưu trữ, địa chỉ IP...
- Pod có thể chạy theo 2 cách sau:
  - Pod that run a single container: 1 container tương ứng 1 Pod
  - Pods that run multiple containers that need to work together.: Một Pod có thể là một ứng dụng bao gồm nhiều container được kết nối chặt chẽ và cần phải chia sẻ tài nguyên với nhau giữa các container.
- Pods cung cấp hai loại tài nguyên chia sẻ cho các containers: networking và storage.
- Pods nằm trong các woker nodes là nơi chứa các container (một hay nhiều). Mỗi pods giống như một logic machine riêng biệt (có IP, hostname, tiếng trình riêng).

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes018.png)

> Kubernetes không chạy các container một cách trực tiếp, thay vào đó nó bọc một hoặc vài container vào với nhau trong một cấu trúc gọi là POD.


**Mạng / Volume với POD**

- **Networking**: Mỗi pod sẽ được cấp 1 địa chỉ ip. Các container trong cùng 1 Pod cùng chia sẽ network namespace (địa chỉ ip và port). Các container trong cùng pod có thể giao tiếp với nhau và có thể giao tiếp với các container ở pod khác (use the shared network resources).
- **Storage**: Pod có thể chỉ định một shared storage volumes. Các container trong pod có thể truy cập vào volume này.

> Thực ra Pods là một cấp độ cao hơn của container, nó có thể chứa nhiều container cùng xử lý một loại công việc. Các container sẽ có chung một địa chỉ IP, chia sẻ cùng 1 volume.

#### Cấu hình 1 Pods đơn giản
Hãy chắc chắn bạn đã có 1 cluster Kubernetes

kubia-manual.yaml
```
apiVersion: v1
kind: Pod
metadata:
 name: kubia-manual
spec:
 containers:
  - image: luksa/kubia
  name: kubia
  ports:
  - containerPort: 8080
  protocol: TCP
```

- **apiVersion**: version của Kubernetes API
- **kind**: Chỉ định thành phần cần tạo (ở đây là Pod)
- **metadata**: Tên của Pod
- **spec**: Mô tả về các thông số kỹ thuật của Pod
- **container**: chưa tên image của container cần chạy trong pod
- **name**: Tên container
- **containerPort**: Cổng đầu ra ứng dụng của container

Để tạo pods, chúng ta dùng lệnh `kubectl create`
```
kubectl create -f kubia-manual.yaml
```

Thông báo sẽ hiện ra ngay sau khi chạy lệnh
```
pod "kubia-manual" created
```

Kiểm tra pods:
```
kubectl get pods

NAME         READY  STATUS   RESTARTS AGE
kubia-manual 1/1    Running    0      32s
```

#### Tổ chức pods với labels
Nếu không có cơ chế, giải pháp tổ chức tốt các pods với số lượng lớn như thế, chúng sẽ thành mớ bòng bong, hỗn độn dẫn đến mất rất nhiều công sức để quản lý. Với Labels, chúng ta có thể các pods thành các nhóm nhỏ hơn, giúp phần này giải quyết vấn đề nêu trên

> Lưu ý: Labels có thể được đánh cho các node, chứ không chỉ dành riêng cho các pods

![](https://images.viblo.asia/88af72b9-bbff-4da0-b239-9305fa0033e0.png)

Với các pods ở hình trên, chúng ta có thể tổ chức với việc gán 2 nhãn (labels) cho mỗi pods:
- **app**: Để chỉ ra pods thuộc phần nào trong ứng dụng như UI hay Order Service, ...
- **rel**: Để chỉ ra pods được dùng cho phiên bản nào của ứng dụng (stable, beta hay là canary).

![](https://images.viblo.asia/f5f2c1ab-1098-410d-80ca-bcd2e29acd60.png)

Cấu hình pods với labels
```
apiVersion: v1
kind: Pod
metadata:
 name: kubia-manual-v2
 labels:
 app: ui
 rel: stable
spec:
 containers:
 - image: luksa/kubia
 name: kubia
 ports:
 - containerPort: 8080
 protocol: TCP
```

Khác với file yml cấu hình pods ở phần trên một chút. Ở phần metadata chúng ta đã thêm vào phần labels cho pods.

Sau khi create pods bằng lệnh kubectl create -f, chúng ta dùng lệnh:

`kubectl get po --show-labels`

-----------------------------------------

#### Lệnh kubectl tương tác với Cluster, cú pháp chính

`kubectl [command] [TYPE] [NAME] [flags]`

Trong đó:

```
[command] là lệnh, hành động như apply, get, delete, describe ...
[TYPE] kiểu tài nguyên như ns, no, po, svc ...
[NAME] tên đối tượng lệnh tác động
[flags] các thiết lập, tùy thuộc loại lệnh
```

```ruby

# Danh sách các Node trong Cluster
kubectl get nodes

# Thông tin chi tiết về Node có tên name-node
kubectl describe node name-node

# Nhãn của Node
kubectl label node myNode tennhan=giatrinhan

# Lấy các tài nguyên có nhãn nào đó
kubectl get node -l "tennhan=giatrinhan"

# Xóa nhãn
kubectl label node myNode tennhan-

# Liệt kê các POD trong namespace hiện tại
# Thêm tham số -o wide hiện thị chi tiết hơn, thêm -A hiện thị tất cả namespace, thêm -n namespacename hiện thị Pod của namespace namespacename
kubectl get pods

# Xem cấu trúc mẫu định nghĩa POD trong file cấu hình yaml
kubectl explain pod --recursive=true

# Triển khai tạo các tài nguyên định nghĩa trong file firstpod.yaml
kubectl apply -f firstpod.yaml

# Xóa các tài nguyên tạo ra từ định nghĩa firstpod.yaml
kubectl delete -f firstpod.yaml

# Lấy thông tin chi tiết POD có tên namepod, nếu POD trong namespace khác mặc định thêm vào tham số -n namespace-name
kubectl describe pod/namepod

# Xem logs của POD có tên podname
kubectl logs pod/podname

# Chạy lệnh từ container của POD có tên mypod, nếu POD có nhiều container thêm vào tham số -c và tên container**
kubectl exec mypod command

# Chạy lệnh bash của container trong POD mypod và gắn terminal
# Chú ý, nếu pod có nhiều container bên trong, thì cần chỉ rõ thi hành container nào bên trong nó bằng tham số -c containername
kubectl exec -it mypod bash

# Tạo server proxy truy cập đến các tài nguyên của Cluster. `http://localhost/api/v1/namespaces/default/pods/mypod:8085/proxy/,` truy cập đến container có tên mypod trong namespace mặc định.

kubectl proxy

# Xóa POD có tên mypod
kubectl delete pod/mypod

```

**Truy cập Pod từ bên ngoài Cluster**
> Trong thông tin của Pod ta thấy có IP của Pod và cổng lắng nghe, tuy nhiên Ip này là nội bộ, chỉ các Pod trong Cluster liên lạc với nhau. Nếu bên ngoài muốn truy cập cần tạo một Service để chuyển traffic bên ngoài vào Pod (tìm hiểu sau), tại đây để debug - truy cập kiểm tra bằng cách chạy proxy

```
kubectl proxy
kubectl proxy --address="0.0.0.0" --accept-hosts='^*$'

Truy cập đến địa chỉ http://localhost/api/v1/namespaces/default/pods/mypod:8085/proxy/
```

**Khi kiểm tra chạy thử,**
Cũng có thể chuyển cổng để truy cập. Ví dụ cổng host 8080 được chuyển hướng truy cập đến cổng 8085 của POD mypod

`kubectl port-forward mypod 8080:8085`

#### Cấu hình thăm dò Container còn sống
Bạn có thể cấu hình livenessProbe cho mỗi container, để Kubernetes kiểm tra xem container còn sống không. Ví dụ, đường dẫn kiểm tra là /healthycheck, nếu nó trả về mã header trong khoảng 200 đến 400 được coi là sống (tất nhiên bạn cần viết ứng dụng trả về mã này). Trong đó cứ 10s kiểm tra một lần

```
apiVersion: v1
kind: Pod
metadata:
  name: mypod
  labels:
    app: mypod
spec:
  containers:
  - name: mycontainer
    image: ichte/swarmtest:php
    ports:
    - containerPort: 8085
    resources: {}

    livenessProbe:
      httpGet:
        path: /healthycheck
        port: 8085
      initialDelaySeconds: 10
      periodSeconds: 10
```

### 1.2 Replication Controllers
- Replication controller đảm bảo rằng số lượng các pod replicas đã định nghĩa luôn luôn chạy đủ số lượng tại bất kì thời điểm nào.
- Thông qua Replication controller, Kubernetes sẽ quản lý vòng đời của các pod, bao gồm scaling up and down, rolling deployments, and monitoring.

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes052.png)

#### Cấu trúc của replication controllers
![](https://images.viblo.asia/f03449ef-0f91-40de-ab2b-8990ff478d0d.png) 

- **label selector**: Xác định pods mà Controller quản lý (theo labels)
- **replica count**: Số lượng pods cần duy trì 
- **pod template**: Được hiểu là khuôn mẫu của pods để Controller sử dụng để tạo Pods mới khi cần.

#### Tạo 1 Replication
```
apiVersion: v1
kind: ReplicationController
metadata:
 name: kubia
spec:
  replicas: 3
  selector:
  app: kubia 
 template:
   metadata:
     labels:
       app: kubia
      spec:
       containers:
          - name: kubia
             image: luksa/kubia
             ports:
         - containerPort: 8080 
```

- **kind**: là kiểu ReplicationController 
- **replicas**: 3 là số lượng pods cần duy trì
- **app**: kubia có nghĩa là áp dụng cho các Pods có labels app: kubia
- **template**: là phần pod template, mô tả tên images, port để có thể chạy container trong pods lên.

Cuối cùng tạo **ReplicationController** với lệnh
```
$ kubectl create -f kubia-rc.yaml
replicationcontroller "kubia" created
```

Để lấy các ReplicaSet thực hiện lệnh
```
kubectl get rs
```

Thông tin về ReplicaSet có tên rsapp
```
kubectl get rs/rsapp
```

Ok, giờ chúng ta sẽ xóa 1 Pods với lệnh
```
kubectl delete pod [tên-pod]
```

Gần như ngay lập tức sẽ có 1 Pods mới được tạo thành thay thế Pods vừa bị xóa.
![](https://images.viblo.asia/1230c5f1-6ea9-4169-bf7d-e4ccb1ee2629.png)


#### Horizontal Pod AutoScaler
Horizontal Pod Autoscaler là chế độ tự động scale (nhân bản POD) dựa vào mức độ hoạt động của CPU đối với POD, nếu một POD quá tải - nó có thể nhân bản thêm POD khác và ngược lại - số nhân bản dao động trong khoảng min, max cấu hình

Ví dụ, với ReplicaSet rsapp trên đang thực hiện nhân bản có định 3 POD (replicas), nếu muốn có thể tạo ra một HPA để tự động scale (tăng giảm POD) theo mức độ đang làm việc CPU, có thể dùng lệnh sau

```
kubectl autoscale rs rsapp --max=2 --min=1
```

Để liệt kê các hpa gõ lệnh
```
kubectl get hpa
```

Để linh loạt và quy chuẩn, nên tạo ra HPA (HorizontalPodAutoscaler) từ cấu hình file yaml (Tham khảo HPA API )
```
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: rsapp-scaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: ReplicaSet
    name: rsapp
  minReplicas: 5
  maxReplicas: 10
  # Thực hiện scale CPU hoạt động ở 50% so với CPU mà POD yêu cầu
  targetCPUUtilizationPercentage: 50
```

> Mặc dù có thể sử dụng ReplicaSet một cách độc lập, tuy nhiên trong triển khai hiện nay hay dùng Deployment, với Deployment nó sở hữu một ReplicaSet riêng. Bài tiếp theo sẽ nói về Deployment

### 1.3 Deployments
- **Deployment** quản lý một nhóm các Pod - các Pod được nhân bản, nó tự động thay thế các Pod bị lỗi, không phản hồi bằng pod mới nó tạo ra. Như vậy, deployment đảm bảo ứng dụng của bạn có một (hay nhiều) Pod để phục vụ các yêu cầu.

- **Deployment** sử dụng mẫu Pod (Pod template - chứa định nghĩa / thiết lập về Pod) để tạo các Pod (các nhân bản replica), khi template này thay đổi, các Pod mới sẽ được tạo để thay thế Pod cũ ngay lập tức.

![](https://images.viblo.asia/db1d0783-0c88-42a6-8d80-26acc5123712.png)

```
apiVersion: apps/v1
kind: Deployment
metadata:
  # tên của deployment
  name: deployapp
spec:
  # số POD tạo ra
  replicas: 3

  # thiết lập các POD do deploy quản lý, là POD có nhãn  "app=deployapp"
  selector:
    matchLabels:
      app: deployapp

  # Định nghĩa mẫu POD, khi cần Deploy sử dụng mẫu này để tạo Pod
  template:
    metadata:
      name: podapp
      labels:
        app: deployapp
    spec:
      containers:
      - name: node
        image: ichte/swarmtest:node
        resources:
          limits:
            memory: "128Mi"
            cpu: "100m"
        ports:
          - containerPort: 8085
```

Cấu hình cho Replicas luôn duy trì số lượng 3 Pods, các Pods chạy sẽ có labels app=kubia và container chạy trong Pods sẽ được build từ image luksa/kubia:v1

--------------------------------

```
# Thực hiện lệnh sau để triển khai
kubectl apply -f deploy.yaml

# Khi Deployment tạo ra, tên của nó là deployapp, có thể kiểm tra với lệnh:
kubectl get deploy -o wide

# Deploy này quản sinh ra một ReplicasSet và quản lý nó, gõ lệnh sau để hiện thị các ReplicaSet
kubectl get rs -o wide

# Hoặc lọc cả label
kubectl get po -l "app=deployapp" -o wide

# Thông tin chi tiết về deploy
kubectl describe deploy/deployapp
```

#### Cập nhật Deployment
- Bạn có thể cập một Deployment bằng cách sử đổi trực tiếp trong file yml
- Khi cập nhật, ReplicaSet cũ sẽ hủy và ReplicaSet mới của Deployment được tạo, tuy nhiên ReplicaSet cũ chưa bị xóa để có thể khôi phục lại về trạng thái trước (rollback).

- Quá trình Deployment cập nhật:
  - Khi cập nhật thì Deployment sẽ dừng hết POD,
  - Scale số lượng pod về 0
  - Sau đó sẽ dụng template mới của POD để tạo lại POD, POD cũ không xoá hẳng cho đến khi POD mới đang chạy.

------------------------
```
# Có thể thu hồi lại bản cập nhật bằng cách sử dụng lệnh
kubectl rollout undo

# Cập nhật image mới trong POD - ví dụ thay image của container node bằng image mới httpd
kubectl set image deploy/deployapp node=httpd --record

# Để xem quá trình cập nhật của deployment
kubectl rollout status deploy/deployapp

# Bạn cũng có thể cập nhật tài nguyên POD theo cách tương tự, ví dụ giới hạn CPU, Memory cho container với tên app-node
kubectl set resources deploy/deployapp -c=node --limits=cpu=200m,memory=200Mi
```

#### Rollback Deployment
```
# Kiểm tra các lần cập nhật (revision)
kubectl rollout history deploy/deployapp

# Để xem thông tin bản cập nhật 1 thì gõ lệnh
kubectl rollout history deploy/deployapp --revision=1

# Khi cần quay lại phiên bản cũ nào đó, ví dụ bản revision 1
kubectl rollout undo deploy/deployapp --to-revision=1

# Nếu muốn quay lại bản cập nhật trước gần nhất
kubectl rollout undo deploy/mydeploy
```

#### Scale Deployment
```
# Scale thay đổi chỉ số replica (số lượng POD) của Deployment, ý nghĩa tương tự như scale đối với ReplicaSet trong phần trước. 
# Ví dụ để scale với 10 POD thực hiện lệnh:
kubectl scale deploy/deployapp --replicas=10

# Muốn thiết lập scale tự động với số lượng POD trong khoảng min, max và thực hiện scale khi CPU của POD hoạt động ở mức 50% thì thực hiện
kubectl autoscale deploy/deployapp --min=2 --max=5 --cpu-percent=50

# Bạn cũng có thể triển khai Scale từ khai báo trong một yaml. Hoặc có thể trích xuất scale ra để chỉnh sửa
kubectl get hpa/deployapp -o yaml > 2.hpa.yaml
```

[Concepts](https://kubernetes.io/docs/concepts/)

[Tham khảo](https://xuanthulab.net/deployment-trong-kubernetes-trien-khai-cap-nhat-va-scale.html)

### 1.4 Services
- Service là khái niệm được thực hiện bởi : `domain name, và port`. Service sẽ tự động "tìm" các pod được đánh `label` phù hợp (trùng với label của service), rồi chuyển các connection tới đó.
- Nếu tìm được `5 pods` thoả mã `label, service` sẽ thực hiện `load-balancing`: chia connection tới từng pod theo chiến lược được chọn (VD: round-robin: lần lượt vòng tròn).
- Cũng có thể hiểu Service là một dịch vụ mạng, tạo cơ chế cân bằng tải `(load balancing)` truy cập đến các điểm cuối (thường là các Pod) mà Service đó phục vụ.

> Kubernetes Service là một tài nguyên cho phép tạo một điểm truy cập duy nhất đến các Pods cung cấp cùng một dịch vụ. Mỗi Service có địa chỉ IP và port không đổi. Client có thể mở các kết nối đến IP và port của service, sau đó chúng sẽ được điều hướng đến các Pods để xử lý.

![](https://images.viblo.asia/ca651b76-80dc-4cac-9bf5-204ff5769b5f.png)

***Tạo Service bằng cách cấu hình file yml***
```
apiVersion: v1
kind: Service
metadata:
  name: service
spec:
  selector:
    app: app
  ports:
  - port: 80
    targetPort: 3000
```

- **kind**: Service thể hiển rằng thành phần cần tạo là Service
- **port**: 80 thể hiện rằng cổng tương tác với Service là cổng 80
- **targetPort**: 8080 là cổng của các container trong pods mà service sẽ điều hướng kết nối đến
- **app**: kubia (thuộc phần selector) thể hiển rằng service tương tác với các pods có labels là app=kubia

```
# Tạo Service
kubectl create -f kubia-svc.yaml

# Kiểm tra các service với lệnh

$ kubectl get svc
NAME        CLUSTER-IP    EXTERNAL-IP  PORT(S) AGE
kubernetes  10.111.240.1    <none>      443/TCP 30d
kubia       10.111.249.153  <none>      80/TCP 6m
```

Ở phần spec chúng ta có thể thêm 1 trường nữa là type biểu thể kiểu service cần dùng (mặc định là ClusterIP). Các loại `Service` bao gồm. 

- **ClusterIP**: Service chỉ có địa chỉ IP cục bộ và chỉ có thể truy cập được từ các thành phần trong cluster Kubernetes.
- **NodePort**: Service có thể tương tác qua Port của các worker nodes trong cluster (sẽ giải thích kỹ hơn ở phần sau)
- **LoadBlancer**: Service có địa chỉ IP public, có thể tương tác ở bất cứ đâu.
- **ExternalName**: Ánh xạ service với 1 DNS Name

--------------------------------------------------------

**Tạo Service kiểu ClusterIP, không Selector**
```
apiVersion: v1
kind: Service
metadata:
  name: service
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes054.png)

khi Pod truy cập địa chỉ IP này với cổng 80 thì nó truy cập đến các endpoint định nghĩa trong dịch vụ. Tuy nhiên thông tin service cho biết phần endpoints là không có gì, có nghĩa là truy cập thì không có phản hồi nào.

***Tạo EndPoint cho Service (không selector)***

Service trên có tên `service`, không có selector để xác định các Pod là endpoint của nó, nên có thể tự tạo ra một endpoint cùng tên `service`

```
apiVersion: v1
kind: Endpoints
metadata:
  name: service
subsets:
  - addresses:
    - ip: 216.58.220.195 # đây là IP google
    ports:
    - port: 80
```

Triển khai với lệnh `kubectl apply -f endpoint.yml`
Như vậy svc1 đã có `endpoints`, khi truy cập `svc1:80` hoặc `svc1.default:80` hoặc `10.97.217.42:80` có nghĩa là truy cập `216.58.220.195:80`

-------------------------------------------------------------

**Thực hành tạo Service kiểu NodePort**
- Kiểu NodePort này tạo ra có thể truy cập từ ngoài internet bằng IP của các Node
- Chúng ta hoàn toàn có thể config cho Service nhiều hơn 1 cổng
- NodePort `30000-32767`

```
apiVersion: v1
kind: Service
metadata:
  name: service
spec:
  type: NodePort
  selector:
    app: app
  ports:
  - name: https
    port: 443
    targetPort: 8443
    nodePort: 30443
  - name: http
    port: 80
    targetPort: 80
    nodePort: 30080
```

- Sau khi triển khai có thể truy cập với IP là địa chỉ IP của các Node và cổng là `30080`, ví dụ `172.16.10.101:30080`

```
kubectl get svc/service

NAME      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service   NodePort   10.108.54.237   <none>        80:30080/TCP   9m26s
```

**CLUSTER_IP**: Là địa chỉ IP cục bộ trong Cluster Kubernetes, với địa chỉ IP này thì các Pods hay Services có thể tương tác với nhau nhưng bên ngoài sẽ không thể tác tương tác với Service thông qua nó được.
**EXTERNAL_IP**: IP public, có thể dùng để client bên ngoài (hoặc bất cứ đâu) tương tác với Service

-------------------------------------------------------------

**Thực hành tạo Service kiểu Loadblancer**
- Service có địa chỉ IP public, có thể tương tác ở bất cứ đâu.
- Tạo một Service kiểu Loadblancer sẽ cung cấp thêm địa chỉ IP public để client bên ngoài có thể gửi request đến.

![](https://images.viblo.asia/fe58cece-06bc-4ec1-b3f0-f835ac7a5c92.png)

File `service-loadbalancer.yaml`

```
apiVersion: v1
kind: Service
metadata:
  name: service
spec:
  type: LoadBalancer
  selector:
    app: app
  ports:
  - port: 80
    targetPort: 80
```

Tạo Service:

`kubectl create -f service-loadbalancer.yaml`

Kết quả:

```
$ kubectl get svc/service
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service      NodePort    10.108.54.237   <none>        80:30243/TCP   40s
```

Truy cập

```
http://localhost
```
----------------------

### 1.5 Daemon set
- Deamon set hoạt động giống Replica set. Có khả nặng tạo và quản lý các POD. Nó tạo trên mỗi node chỉ có 1 pod
- Triển khai DaemonSet khi cần ở mỗi máy (Node) một POD, thường dùng cho các ứng dụng như thu thập log, tạo ổ đĩa trên mỗi Node

```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: daemonset
  labels:
    daemon: daemon
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        resources:
          limits:
            memory: "128Mi"
            cpu: "100m"
        ports:
          - containerPort: 80
```

> Mặc định NODE master của kubernetes không cho triển khai chạy các POD trên nó để an toàn, nếu muốn cho phép tạo Pod trên node Master thì xóa đi taint có tên node-role.kubernetes.io/master

```
# xóa taint trên node master.xtl cho phép tạo Pod
kubectl taint node master.xtl node-role.kubernetes.io/master-

# thêm taint trên node master.xtl ngăn tạo Pod trên nó
kubectl taint nodes master.xtl node-role.kubernetes.io/master=false:NoSchedule
```
---------------------
### 1.6 Job
- Job (jobs) có chức năng tạo các POD đảm bảo nó chạy và kết thúc thành công
- Khi các POD do Job tạo ra chạy và kết thúc thành công thì Job đó hoàn thành.
- Khi bạn xóa Job thì các Pod nó tạo cũng xóa theo
- Một Job có thể tạo các Pod chạy tuần tự hoặc song song
- Sử dụng Job khi muốn thi hành một vài chức năng hoàn thành xong thì dừng lại `(ví dụ backup, kiểm tra ...)`

```
apiVersion: batch/v1
kind: Job
metadata:
  name: job
  labels:
    job: job
spec:
  completions: 3               # Số lần chạy POD thành công
  backoffLimit: 2              # Số lần tạo chạy lại POD bị lỗi, trước khi đánh dấu job thất bại
  parallelism: 2               # Số POD tạo song song
  activeDeadlineSeconds: 120   # Số giây tối đa của JOB, quá thời hạn trên hệ thống ngắt JOB
  template:
    spec:
      containers:
      - name: busybox
        image: busybox
        command:
          - bin/sh
          - -c
          - date; echo "Job Executed"
      restartPolicy: Never
```

Trong đó:
- ***completions***: Số lần chạy POD thành công
- ***backoffLimit***: Số lần tạo chạy lại POD bị lỗi, trước khi đánh dấu job thất bại
- ***parallelism***: Số POD chạy song song
- ***activeDeadlineSeconds***: Số giây tối đa của JOB, quá thời hạn trên hệ thống ngắt JOB

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes032.png)

----------------------
### 1.7 CronJob
- Chạy các Job theo một lịch định sẵn.
- Việc lên lịch cho CronJob khai báo giống Cron của Linux

```
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cronjob
  labels:
    cronjob: cronjob
spec:
  schedule: "*/1 * * * *"       # 1 Phút chạy 1 lần
  successfulJobsHistoryLimit: 3 # Số job lưu lại
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: busybox
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo "Job in CronJob"
          restartPolicy: Never
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes033.png)

----------------------
### 1.8 Volumes
- Như chúng ta đã biết, hệ thống Kubermetes sẽ tạo ra Pods mới thay thế khi một Pods bị lỗi, chết hay crash. Vậy còn dữ liệu được lưu trong Pods cũ sẽ đi đâu ? Pods mới có lấy lại được dữ liệu của Pods cũ đã mất để tiếp tục sử dụng không ? Khái niệm Voulumes sẽ giúp giải quyết các vấn đề trên.

**Volumes** là thành phần trực thuộc Pods. **Volumes** được định nghĩa trong cấu hình file yaml khi khởi tạo các Pods. Các container có thể thực hiện mount dữ liệu bên trong container đến đối tượng **volumes** thuộc cùng Pods.

![](https://images.viblo.asia/27422723-9966-42d5-878b-d204396ba905.png)
Các Container trong Pods mount đến 2 voumes để chia sẻ dữ liệu với nhau

- Volumes có thể là local `filesystem,local storage, Ceph, Gluster, Elastic Block Storage,..`

#### EmptyDir Volumes
là loại volumes đơn giản nhất. Ban đầu chỉ là một folder trống, các container có thể sử dụng emptyDir volumes để đọc, ghi dữ liệu và chia sẻ cho các container khác cùng Pods. Khi Pods bị crash hay bị xóa thì emptyDir volumes cũng mất luôn cùng với dữ liệu trong nó.

`fortune-pod.yaml`

```
apiVersion: v1
kind: Pod
metadata:
 name: fortune
spec:
 containers:
 - image: luksa/fortune
     name: html-generator
     volumeMounts:
         - name: html
             mountPath: /var/htdocs
 - image: nginx:alpine
     name: web-server
     volumeMounts:
         - name: html
             mountPath: /usr/share/nginx/html
             readOnly: true
     ports:
         - containerPort: 80
           protocol: TCP
     volumes:
     - name: html
         emptyDir: {} 
```

Nhìn vào file cấu hình trên, ta có:

- Pods gồm có 2 container là: html-generator, web-server.
- Thư mục của container html-generator được mount với volumes là /var/htdocs
- Thư mục của container web-server được mount với volumes là /usr/share/nginx/html ở cế độ readOnly (chỉ đọc dữ liệu từ volumes vào container).

Ở ví dụ này, container html-generator sẽ thay đổi file index.html trong folder /var/htdocs 10 giây 1 lần. Khi file html mới được hình thành, nó sẽ được cập nhật ở volumes và container web-server có thể đọc chúng. Khi người dùng gửi request chẳng hạn đến container web-server nginx, dữ liệu được trả về là file index.html mới nhất.

- 3 Dòng cuối chứa thông tin về tên volumes và kiểu volumes là emptyDir. Mặc định, emptyDir sẽ dùng tài nguyên ổ cứng của worker nodes để lưu trữ. Chúng ta có thể có một lựa chọn khác là sử dụng bộ nhớ RAM của worker nodes như sau

```
volumes:
  - name: html
  emptyDir:
      medium: Memory
```

#### hostPath volume
Như chúng ta đã biết, với `empty volume`, dữ liệu sẽ mất khi Pods bị lỗi, xóa hay crash vì `empty volume` là một thành phần thuộc Pods. Với `hosPath volume`, dữ liệu được lưu trong `volumes` sẽ không bị mất khi Pods bị lỗi vì nó vốn được nằm ngoài Pods (trong hệ thống file của worker node). Khi Pods mới được tạo thành để thay thế Pods cũ, nó sẽ mount đến `hostPath volume` để làm việc tiếp với các dữ liệu ở Pods cũ.

![](https://images.viblo.asia/26c81744-115e-4d1d-a7ae-a74c305ba83b.png)

#### ConfigMap và Secret
Thông thường khi lập trình các ứng dụng, chúng ta đều cho các biến quan trọng (như mật khẩu `url DB, secret key, tên DB v.v.`) vào file `.env` dưới dạng biến môi trường để bảo đảm tính bí mật. Trong hệ thống **Kubernetes, Config Map và Secret** là 2 loại volumes giúp lưu trữ biến môi trường để dùng cho các container thuộc các Pods khác nhau. **Config Map** sẽ dùng với các biến môi trường không chứa thông tin quá nhạy cảm, cần bí mật. Secret, như đúng với cái tên gọi của nó sẽ được dùng để lưu trữ các biến môi trường quan trọng, nhạy cảm. Khác với các loại volume khác, **Config Map** và Secret sẽ được định nghĩa riêng với file `yaml` thay vì cấu hình ở trong file `yaml` khởi tạo Pods.

```
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

```
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

![](https://images.viblo.asia/2880276d-517f-4a63-b9c2-eada5a54a469.png)

### 1.8 Namespaces
Đây là một công cụ dùng để nhóm hoặc tách các nhóm đối tượng. Namespaces được sử dụng để kiểm soát truy cập, kiểm soát truy cập network, quản lý resource và quoting.

![](https://viblo.asia/uploads/4c1b6382-dda2-43cc-9b0c-0fd91120c7ab.jpg)

- Namespace hoạt động như một cơ chế nhóm bên trong Kubernetes.
- Các Services, pods, replication controllers, và volumes có thể dễ dàng cộng tác trong cùng một namespace.
- Namespace cung cấp một mức độ cô lập với các phần khác của cluster.

## 2 Thành phần

![](https://camo.githubusercontent.com/7ff2160c4f3e5fbdceabdf2014aa2156ddd6f416/68747470733a2f2f73332d75732d776573742d322e616d617a6f6e6177732e636f6d2f782d7465616d2d67686f73742d696d616765732f323031362f30362f6f376c656f6b2e706e67)

### 2.1 Master node
- Chịu trách nhiệm quản lý Kubernetes cluster.
- Đây là nơi mà sẽ cấu hình các nhiệm vụ sẽ thực hiện.
- Quản lý, điều hành các work node.

#### 2.2.1 API Server
- API server là thành phần tiếp nhận yêu cầu của hệ thống K8S thông qua REST, tức là nó tiếp nhận các chỉ thị từ người dùng cho đến các services trong hệ thống Cluster thông qua API - có nghĩa là người dùng hoặc các service khác trong cụm cluster có thể tương tác tới K8S thông qua HTTP/HTTPS.
- API-server hoạt động trên port 6443 (HTTPS) và 8080 (HTTP).
- API-server nằm trên node master

#### 2.1.2 etcd storage
- Etcd là một thành phần database phân tán, sử dụng ghi dữ liệu theo cơ chế key/value trong K8S cluster. Etcd được cài trên node master và lưu tất cả các thông tin trong Cluser. Etcd sử dụng port 2380 để listening từng request và port 2379 để client gửi request tới.
- Ectd nằm trên node master.


#### 2.1.3 Scheduler
- Đảm nhiệm chức năng là triển khai các pods, services lên các nodes.
- Scheduler nắm các thông tin liên quan đến các tài nguyên có sẵn trên các thành viên của cluster, cũng như các yêu cầu cần thiết cho dịch vụ cấu hình để chạy và do đó có thể quyết định nơi triển khai một dịch vụ cụ thể.

#### 2.1.4 controller-manager
- Sử dụng api server để có thể xem trạng thái của cluster và từ đó thực hiện các thay đổi chính xác cho trạng thái hiện tại để trở thành một trạng thái mong muốn.
- Ví dụ Replication controller có chức năng đảm bảo rằng số lượng các pod replicas đã định nghĩa luôn luôn chạy đủ số lượng tại bất kì thời điểm nào.

### 2.2 Worker node
- Là nơi mà các pod sẽ chạy.
- Chứa tất cả các dịch vụ cần thiết để quản lý kết nối mạng giữa các container, giao tiếp với master node, và gán các tài nguyên cho các container theo kế hoạch.

#### 2.2.1 Docker
- Là môi trường để chạy các container.
#### 2.2.2 kubelet
- kubelet lấy cấu hình thông tin pod từ api server và đảm bảo các containers up và running.
- kubelet chịu trách nhiệm liên lạc với master node.
- Nó cũng liên lạc với etcd, để có được thông tin về dịch vụ và viết chi tiết về những cái mới được tạo ra.
#### 2.2.3 kube-proxy
- Kube-proxy hoạt động như một proxy mạng và cân bằng tải cho một dịch vụ trên một work node.
- Nó liên quan đến việc định tuyến mạng cho các gói TCP và UDP.
#### 2.2.4 kubectl
- Giao diện dòng lệnh để giao tiếp với API service.
- Gửi lệnh đến master node.

## 3. Lab
### 3.1. Install webserver on K8S
- Tạo webserver chạy trên docker với k8s.
- Thử nghiệm các tính năng:
  - scale, load balacing.
  - Update images cho deployments.
  - roll back.
### 3.2. Deploy apache2.
`root@master:/opt/demo# kubectl create -f apache2.yaml`

- Check deployments, pods, services
```
root@master:/opt/demo# kubectl get deployments
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
apache2   1         1         1            1           9m


root@master:/opt/demo# kubectl describe deployments apache2
Name:                   apache2
Namespace:              default
CreationTimestamp:      Thu, 27 Apr 2017 16:23:03 +0700
Labels:                 name=apache2
Annotations:            deployment.kubernetes.io/revision=1
Selector:               name=apache2
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:       name=apache2
  Containers:
   apache2:
    Image:              cosy294/swarm:1.0
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets: <none>
NewReplicaSet:  apache2-4181921630 (1/1 replicas created)
Events:
  FirstSeen     LastSeen        Count   From                    SubObjectPath   Type        Reason                   Message
  ---------     --------        -----   ----                    -------------   --------    ------                   -------
  9m            9m              1       deployment-controller                   Normal      ScalingReplicaSet        Scaled up replica set apache2-4181921630 to 1
```
```
root@master:/opt/demo# kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
apache2-4181921630-w25sw   1/1       Running   0          10m
```

```
root@master:/opt/demo# kubectl describe pods apache2-4181921630-w25sw 
Name:           apache2-4181921630-w25sw
Namespace:      default
Node:           minion2/172.16.69.216
Start Time:     Thu, 27 Apr 2017 16:23:03 +0700
Labels:         name=apache2
                pod-template-hash=4181921630
Annotations:    kubernetes.io/created-by={"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"apache2-4181921630","uid":"1d32f6e3-2b2b-11e7-b9b0-52540006d9c8"...
Status:         Running
IP:             10.39.0.2
Controllers:    ReplicaSet/apache2-4181921630
Containers:
  apache2:
    Container ID:       docker://2f0fb258f5f2e4339b50340370984a06d84886e0112ff8392f98ae26f05f8a12
    Image:              cosy294/swarm:1.0
    Image ID:           docker-pullable://cosy294/swarm@sha256:4b5c51401edc0af2ea93989aee304baf6d712b15f75e4fec465648c3e8111ff9
    Port:               80/TCP
    State:              Running
      Started:          Thu, 27 Apr 2017 16:23:05 +0700
    Ready:              True
    Restart Count:      0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-dhj1p (ro)
Conditions:
  Type          Status
  Initialized   True 
  Ready         True 
  PodScheduled  True 
Volumes:
  default-token-dhj1p:
    Type:       Secret (a volume populated by a Secret)
    SecretName: default-token-dhj1p
    Optional:   false
QoS Class:      BestEffort
Node-Selectors: <none>
Tolerations:    node.alpha.kubernetes.io/notReady=:Exists:NoExecute for 300s
                node.alpha.kubernetes.io/unreachable=:Exists:NoExecute for 300s
Events:
  FirstSeen     LastSeen        Count   From                    SubObjectPath               Type             Reason          Message
  ---------     --------        -----   ----                    -------------               -------- ------          -------
  10m           10m             1       default-scheduler                                   Normal           Scheduled       Successfully assigned apache2-4181921630-w25sw to minion2
  10m           10m             1       kubelet, minion2        spec.containers{apache2}    Normal           Pulled          Container image "cosy294/swarm:1.0" already present on machine
  10m           10m             1       kubelet, minion2        spec.containers{apache2}    Normal           Created         Created container with id 2f0fb258f5f2e4339b50340370984a06d84886e0112ff8392f98ae26f05f8a12
  10m           10m             1       kubelet, minion2        spec.containers{apache2}    Normal           Started         Started container with id 2f0fb258f5f2e4339b50340370984a06d84886e0112ff8392f98ae26f05f8a12
root@master:/opt/demo# 
```
```
root@master:/opt/demo# kubectl get svc
NAME         CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
apache2      10.97.115.115   <nodes>       5555:30815/TCP   11m
kubernetes   10.96.0.1       <none>        443/TCP          8d



root@master:/opt/demo# kubectl describe svc apache2
Name:                   apache2
Namespace:              default
Labels:                 <none>
Annotations:            <none>
Selector:               name=apache2
Type:                   NodePort
IP:                     10.97.115.115
Port:                   <unset> 5555/TCP
NodePort:               <unset> 30815/TCP
Endpoints:              10.39.0.2:80
Session Affinity:       None
Events:                 <none>
root@master:/opt/demo# 
```
- Các thông tin quan trọng cần lưu ý:
  - 10.39.0.2:80: Địa chỉ ip endpoint, tức là ip container sẽ chạy apache2 và cổng của service (apache2) chạy trên container này.
  - 10.97.115.115: Địa chỉ ip của cụm cluster apache2.
  - Port: 5555: Cổng truy cập vào services của cụm cluster.
  - NodePort: Cổng truy cập vào service trên bất cứ node nào của cụm cluster.

- Access webserver: Khi truy cập vào trang hostname.php thì sẽ in ra tên của container đang chạy webserver.

```
root@master:/opt/demo# curl http://10.97.115.115:5555/hostname.php
apache2-4181921630-w25sw
```

### 3.3. Thử nghiệm tính năng scale, load balancing.
Scale
```
root@master:/opt/demo# kubectl scale --replicas=5 deployments/apache2
deployment "apache2" scaled
```
Check deployment, pods, services

```
root@master:/opt/demo# kubectl get deployments
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
apache2   5         5         5            5           19m


root@master:/opt/demo# kubectl describe deployment apache2
Name:                   apache2
Namespace:              default
CreationTimestamp:      Thu, 27 Apr 2017 16:23:03 +0700
Labels:                 name=apache2
Annotations:            deployment.kubernetes.io/revision=1
Selector:               name=apache2
Replicas:               5 desired | 5 updated | 5 total | 5 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:       name=apache2
  Containers:
   apache2:
    Image:              cosy294/swarm:1.0
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Progressing   True    NewReplicaSetAvailable
  Available     True    MinimumReplicasAvailable
OldReplicaSets: <none>
NewReplicaSet:  apache2-4181921630 (5/5 replicas created)
Events:
  FirstSeen     LastSeen        Count   From                    SubObjectPath   Type        Reason                   Message
  ---------     --------        -----   ----                    -------------   --------    ------                   -------
  20m           20m             1       deployment-controller                   Normal      ScalingReplicaSet        Scaled up replica set apache2-4181921630 to 1
  46s           46s             1       deployment-controller                   Normal      ScalingReplicaSet        Scaled up replica set apache2-4181921630 to 5
root@master:/opt/demo# 
```

```
root@master:/opt/demo# kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
apache2-4181921630-58f7d   1/1       Running   0          1m
apache2-4181921630-5ssnk   1/1       Running   0          1m
apache2-4181921630-brblz   1/1       Running   0          1m
apache2-4181921630-nhq09   1/1       Running   0          1m
apache2-4181921630-w25sw   1/1       Running   0          21m
root@master:/opt/demo# 

root@master:/opt/demo# kubectl get svc
NAME         CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
apache2      10.97.115.115   <nodes>       5555:30815/TCP   21m
kubernetes   10.96.0.1       <none>        443/TCP          8d
root@master:/opt/demo# 
```

```
root@master:/opt/demo# kubectl describe svc apache2
Name:                   apache2
Namespace:              default
Labels:                 <none>
Annotations:            <none>
Selector:               name=apache2
Type:                   NodePort
IP:                     10.97.115.115
Port:                   <unset> 5555/TCP
NodePort:               <unset> 30815/TCP
Endpoints:              10.36.0.3:80,10.36.0.4:80,10.39.0.2:80 + 2 more...
Session Affinity:       None
Events:                 <none>
root@master:/opt/demo# 
```

> Chú ý, vào thông số endpoint, so với ban đầu, ta có thêm các endpoint khác vừa mới được tạo ra (các container vừa được tạo ra).

Access webserver

```
root@master:/opt/demo# while true; do curl 10.97.115.115:5555/hostname.php;echo -e "\n";sleep 10;done
apache2-4181921630-nhq09

apache2-4181921630-nhq09

apache2-4181921630-brblz
```

> Các request sẽ được tuần tự chuyển đến các container khác nhau xử lý. (Cân bằng tải)

#### Thử nghiệm tính năng autoscale.
Tính năng autoscale sẽ tự động tạo ra các endpoint (container khác) trên cụm cluster khi mà các endpoint hiện tại không đáp ứng được năng lực xử lý. Nhằm giải quyết bài toán đáp ứng yêu cầu của người dùng trong từng thời điểm khác nhau.

`root@master:~# kubectl autoscale deployments apache2 --max=10 --cpu-percent=80`

### 3.4. Thử nghiệm tính năng update images, roll back
#### Update với deployment
##### Update deployments với file cấu hình:

`root@master:/opt/demo# kubectl apply -f apache2_new.yaml --record`

Trong đó file apache2_new.yaml là file cấu hình mới.

##### Update deployments với image phiên bản mới hơn.

`root@master:/opt/demo# kubectl set image deployments/apache2 apache2=nginx`

Trong đó, apache2 là tên container và images mới là nginx

Sau khi update, toàn bộ container sẽ được update lên image mới. Ở đây tôi chuyển sang sử dựng webserver là nginx chứ ko phải là apache2 như ban đầu nữa.

```
root@master:~# curl 10.97.115.115:5555
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
root@master:~# 
```

#### Update với Replication Controller
##### Update Replication Controller với file cấu hình mới:

`$ kubectl rolling-update frontend-v1 -f frontend-v2.yaml`

##### Update Replication Controller với images mới.

`$ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2`

#### Rollback deployments apache2 quay về phiên bản trước đấy:

```
root@master:/opt/demo# kubectl rollout undo deployments apache2
deployment "apache2" rolled back
root@master:/opt/demo#
```

apache2.yml example
```
---
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: apache2
spec:
  template:
    metadata:
      labels:
        name: apache2
    spec:
      containers:
      - name: apache2
        image: cosy294/swarm:1.0
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: apache2
spec:
  selector:
    name: apache2
  ports:
    - port: 5555
      targetPort: 80
  type: NodePort
```