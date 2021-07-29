---
sidebar_position: 11
---

# Ingress
## Khái niệm
- Là thành phần được dùng để điều hướng các yêu cầu traffic giao thức HTTP và HTTPS từ bên ngoài (interneet) vào các dịch vụ bên trong Cluster.
- Chỉ để phục vụ các cổng, yêu cầu HTTP, HTTPS còn các loại cổng khác, giao thức khác để truy cập được từ bên ngoài thì dùng Service với kiểu NodePort và LoadBalancer

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes047.png)

- Các loại Ingress:
  - Nếu chọn Ngix Ingress Controller thì cài đặt theo: [NGINX Ingress Controller for Kubernetes.](https://github.com/nginxinc/kubernetes-ingress)
  - Phần này, chọn loại HAProxy Ingress Controller - [HAProxy Ingress Controller](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)

## HAProxy Ingress Controller
- Ở đậy sử dụng bản custome là [HAProxy Ingress](https://haproxy-ingress.github.io/)
- Để triển khai thực hiện các bước sau:
```
# Tạo namespace có tên ingress-controller
kubectl create ns ingress-controller

# Triển khai các thành phần
kubectl apply -f https://haproxy-ingress.github.io/resources/haproxy-ingress.yaml
```

- Thực hiện đánh nhãn các Node có thể chạy POD Ingress
```
# Gán thêm label cho các Node (ví dụ node worker2.xtl, worker1.xtl ...)
kubectl label node master.xtl role=ingress-controller
kubectl label node worker1.xtl role=ingress-controller
kubectl label node worker2.xtl role=ingress-controller

#Kiểm tra các thành phần
kubectl get all -n ingress-controller
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes048.png)

- Giờ các tên miên, trỏ tới các IP của Node trong Cluster đã được điều khiển bởi Haproxy, ví dụ cấu hình một tên miền ảo (chính file /etc/hosts (Linux, macoS) thêm vào tên miền ảo, giả sử congnt.test trỏ tới IP của một NODE nào đó

`172.16.10.102 congnt.test`

- Giờ truy cập địa chỉ http://congnt.test sẽ thấy

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes049.png)

create ssl

```
openssl req -x509 -newkey rsa:2048 -nodes -days 365 -keyout privkey.pem -out fullchain.pem -subj '/CN=xuanthulab.test'

Sau đó tạo một Secret (thuộc namespace chạy POD), đặt tên Secret này là xuanthulab-test

kubectl create secret tls xuanthulab-test --cert=fullchain.pem --key=privkey.pem -n ingress-controller
```

## Nginx Ingress Controller

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes057.png)

- **NGINX Kubernetes Ingress Controller** là một ingress hỗ trợ khả năng căn bằng tải, SSL, URI rewrite ...
- Ingress Controller được cung cấp bởi Nginx là một proxy nổi tiếng, mã nguồn của Nginx Ingress Controller trên github tại: [nginxinc/kubernetes-ingress](https://github.com/nginxinc/kubernetes-ingress)

> [Hướng dẫn cài đặt cơ bản nginx ingress](https://docs.nginx.com/nginx-ingress-controller/installation/installation-with-manifests/)

**Cài đặt NGINX Ingress Controller**
Từ tài liệu hướng dẫn, sẽ triển khai Nginx Ingress Controller bằng cách triển khai các manifest (yaml) từ mã nguồn tại [nginxinc/kubernetes-ingress](https://github.com/nginxinc/kubernetes-ingress), trước tiên tải về bộ mã nguồn này bằng Git (xem sử dụng git):

```
git clone git@github.com:nginxinc/kubernetes-ingress.git

cd kubernetes-ingress

# Các menifest (yaml) cần triển khai ở trong thư mục deployments, hãy vào thư mục này

kubectl apply -f common/ns-and-sa.yaml
kubectl apply -f common/default-server-secret.yaml
kubectl apply -f common/nginx-config.yaml
kubectl apply -f rbac/rbac.yaml
kubectl apply -f daemon-set/nginx-ingress.yaml

# Kiểm tra daemonset và các pod của Nginx Ingress Controller

kubectl get ds -n nginx-ingress
kubectl get po -n nginx-ingress
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes058.png)


![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes047.png)

- Các loại Ingress:
  - Nếu chọn Ngix Ingress Controller thì cài đặt theo: [NGINX Ingress Controller for Kubernetes.](https://github.com/nginxinc/kubernetes-ingress)
  - Phần này, chọn loại HAProxy Ingress Controller - [HAProxy Ingress Controller](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)

## Sử dụng
