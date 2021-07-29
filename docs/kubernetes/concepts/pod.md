---
sidebar_position: 3
---
# Pod
## Khái niệm
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

## Template Pods
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

## Pods với labels
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

## Lệnh kubectl

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
