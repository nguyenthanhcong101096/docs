---
id: kuber
title: Kubernetes
sidebar_label: Kubernetes
---

![](https://topdev.vn/blog/wp-content/uploads/2019/05/Kubernetes.png)

## 1. Khái niệm
Kubernetes là dự án mã nguồn dể quản lý các container, automating deployment, scaling and manegement các ứng dụng trên container. (Tạo xóa sửa xếp lịch, scale trên nhiều máy) 

### 1.1 Pod
- [Tham khảo](https://xuanthulab.net/tim-hieu-ve-pod-va-node-trong-kubernetes.html)

- Pod là 1 nhóm các container chứa ứng gdụn cùng chia sẽ acsc tài gnuyên lưu trữ, địa chỉ IP...
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

Danh sách các Node trong Cluster

`kubectl get nodes`

Thông tin chi tiết về Node có tên name-node

`kubectl describe node name-node`

Nhãn của Node

`kubectl label node myNode tennhan=giatrinhan`

Lấy các tài nguyên có nhãn nào đó

`kubectl get node -l "tennhan=giatrinhan"`

Xóa nhãn

`kubectl label node myNode tennhan-`

Liệt kê các POD trong namespace hiện tại
> Thêm tham số -o wide hiện thị chi tiết hơn, thêm -A hiện thị tất cả namespace, thêm -n namespacename hiện thị Pod của namespace namespacename

`kubectl get pods`

Xem cấu trúc mẫu định nghĩa POD trong file cấu hình yaml

`kubectl explain pod --recursive=true`

Triển khai tạo các tài nguyên định nghĩa trong file firstpod.yaml

`kubectl apply -f firstpod.yaml`

Xóa các tài nguyên tạo ra từ định nghĩa firstpod.yaml

`kubectl delete -f firstpod.yaml`

Lấy thông tin chi tiết POD có tên namepod, nếu POD trong namespace khác mặc định thêm vào tham số -n namespace-name

`kubectl describe pod/namepod`

Xem logs của POD có tên podname

`kubectl logs pod/podname`

Chạy lệnh từ container của POD có tên mypod, nếu POD có nhiều container thêm vào tham số -c và tên container

`kubectl exec mypod command`

Chạy lệnh bash của container trong POD mypod và gắn terminal
> Chú ý, nếu pod có nhiều container bên trong, thì cần chỉ rõ thi hành container nào bên trong nó bằng tham số -c containername

`kubectl exec -it mypod bash`

Tạo server proxy truy cập đến các tài nguyên của Cluster. `http://localhost/api/v1/namespaces/default/pods/mypod:8085/proxy/,` truy cập đến container có tên mypod trong namespace mặc định.

`kubectl proxy`

Xóa POD có tên mypod

`kubectl delete pod/mypod`

Truy cập Pod từ bên ngoài Cluster
> Trong thông tin của Pod ta thấy có IP của Pod và cổng lắng nghe, tuy nhiên Ip này là nội bộ, chỉ các Pod trong Cluster liên lạc với nhau. Nếu bên ngoài muốn truy cập cần tạo một Service để chuyển traffic bên ngoài vào Pod (tìm hiểu sau), tại đây để debug - truy cập kiểm tra bằng cách chạy proxy

```
kubectl proxy
kubectl proxy --address="0.0.0.0" --accept-hosts='^*$'

Truy cập đến địa chỉ http://localhost/api/v1/namespaces/default/pods/mypod:8085/proxy/
```

Khi kiểm tra chạy thử, cũng có thể chuyển cổng để truy cập. Ví dụ cổng host 8080 được chuyển hướng truy cập đến cổng 8085 của POD mypod

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

Ok, giờ chúng ta sẽ xóa 1 Pods với lệnh
```
kubectl delete pod [tên-pod]
```

Gần như ngay lập tức sẽ có 1 Pods mới được tạo thành thay thế Pods vừa bị xóa.
![](https://images.viblo.asia/1230c5f1-6ea9-4169-bf7d-e4ccb1ee2629.png)

### 1.3 Services
- [Tham khảo](https://xuanthulab.net/su-dung-service-va-secret-tls-trong-kubernetes.html)
- Vì pod có tuổi thọ ngắn nên không đảm bảo về địa chỉ IP mà chúng được cung cấp.
- Service là khái niệm được thực hiện bởi : domain name, và port. Service sẽ tự động "tìm" các pod được đánh label phù hợp (trùng với label của service), rồi chuyển các connection tới đó.
- Nếu tìm được 5 pods thoả mã label, service sẽ thực hiện load-balancing: chia connection tới từng pod theo chiến lược được chọn (VD: round-robin: lần lượt vòng tròn).
- Mỗi service sẽ được gán 1 domain do người dùng lựa chọn, khi ứng dụng cần kết nối đến service, ta chỉ cần dùng domain là xong. Domain được quản lý bởi hệ thống name server SkyDNS nội bộ của k8s - một thành phần sẽ được cài khi ta cài k8s.
- Đây là nơi bạn có thể định cấu hình cân bằng tải cho nhiều pod và expose các pod đó.

> Kubernetes Service là một tài nguyên cho phép tạo một điểm truy cập duy nhất đến các Pods cung cấp cùng một dịch vụ. Mỗi Service có địa chỉ IP và port không đổi. Client có thể mở các kết nối đến IP và port của service, sau đó chúng sẽ được điều hướng đến các Pods để xử lý.

![](https://images.viblo.asia/ca651b76-80dc-4cac-9bf5-204ff5769b5f.png)

Tạo Service bằng cách cấu hình file yml

File `kubia-svc.yaml`

```
apiVersion: v1
kind: Service
metadata:
 name: kubia
spec:
 ports:
 - port: 80
 targetPort: 8080
 selector:
 app: kubia 
```

- **kind**: Service thể hiển rằng thành phần cần tạo là Service
- **port**: 80 thể hiện rằng cổng tương tác với Service là cổng 80
- **targetPort**: 8080 là cổng của các container trong pods mà service sẽ điều hướng kết nối đến
- **app**: kubia (thuộc phần selector) thể hiển rằng service tương tác với các pods có labels là app=kubia

Tạo Service

`kubectl create -f kubia-svc.yaml`

Kiểm tra các service với lệnh

```
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

Chúng ta hoàn toàn có thể config cho Service nhiều hơn 1 cổng, ở file dưới chúng ta config cổng tương tác của service cho giao thức http và https ứng với 2 cổng 8080 và 8443 trong container.

```
apiVersion: v1
kind: Service
metadata:
 name: kubia 
spec:
 ports:
 - name: http
 port: 80
 targetPort: 8080
 - name: https
 port: 443
 targetPort: 8443
 selector:
 app: kubia 
```

#### Service NodePort
Như ở trên, sau khi tạo Service và dùng lệnh kubectl get svc để kiểm tra service vừa tạo thì chúng ta thấy rõ ràng có 2 thống số IP là **CLUSTER_IP** và **EXTERNAL_IP** có giá trị <none>.

- **CLUSTER_IP**: Là địa chỉ IP cục bộ trong Cluster Kubernetes, với địa chỉ IP này thì các Pods hay Services có thể tương tác với nhau nhưng bên ngoài sẽ không thể tác tương tác với Service thông qua nó được.
- **EXTERNAL_IP**: IP public, có thể dùng để client bên ngoài (hoặc bất cứ đâu) tương tác với Service.

Type NodePort giúp Service có thể tương tác được từ bên ngoài thông qua port của worker node.

Khởi tạo file config `kubia-svc-nodeport.yaml`
```
apiVersion: v1
kind: Service
metadata:
 name: kubia-nodeport
spec:
 type: NodePort
 ports:
 - port: 80
 targetPort: 8080
 nodePort: 30123
 selector:
 app: kubia
```

**nodePort**: số hiệu cổng của node worker được mở để bên ngoài tương tác với service

Kiểm tra thông tin service:
```
$ kubectl get svc kubia-nodeport
NAME           CLUSTER-IP      EXTERNAL-IP   PORT(S) AGE
kubia-nodeport 10.111.254.223   <nodes>      80:30123/TCP 2m
```

Khi tương tác với service, client sẽ truy cập qua <Địa chỉ Ip public của Node>:Port

![](https://images.viblo.asia/82c45b8f-9c1b-41d5-a8ab-e67b4725084a.png)

#### Service load balancer
Tạo một Service kiểu Loadblancer sẽ cung cấp thêm địa chỉ IP public để client bên ngoài có thể gửi request đến.

![](https://images.viblo.asia/fe58cece-06bc-4ec1-b3f0-f835ac7a5c92.png)

File `kubia-svc-loadbalancer.yaml`

```
apiVersion: v1
kind: Service
metadata:
 name: kubia-loadbalancer
spec:
 type: LoadBalancer
 ports:
 - port: 80
 targetPort: 8080
 selector:
 app: kubia
```

Tạo Service:

`kubectl create -f kubia-svc-loadbalancer.yaml`

Kết quả:

```
$ kubectl get svc kubia-loadbalancer
NAME               CLUSTER-IP      EXTERNAL-IP     PORT(S) AGE
kubia-loadbalancer 10.111.241.153  130.211.53.173  80:32143/TCP 1m
```
----------------------
#### Tạo Service Kubernetes

Tạo Service kiểu ClusterIP, không Selector

```
apiVersion: v1
kind: Service
metadata:
  name: svc1
spec:
  type: ClusterIP
  ports:
    - name: port1
      port: 80
      targetPort: 80
```

File trên khai báo một service đặt tên svc1, kiểu của service là ClusterIP, đây là kiểu mặc định `(ngoài ra còn có kiểu NodePort, LoadBalancer, ExternalName)`, phần khai báo cổng gồm có cổng của service (port) tương ứng ánh xạ vào cổng của endpoint (`targetPort - thường là cổng Pod`).

Triển khai file trên

```
kubectl apply -f 1.svc1.yaml

# lấy các service
kubectl get svc -o wide

# xem thông tin của service svc1
kubectl describe svc/svc1
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes054.png)

Hệ thống đã tạo ra service có tên là svc1 với địa chỉ IP là 10.97.217.42, khi Pod truy cập địa chỉ IP này với cổng 80 thì nó truy cập đến các endpoint định nghĩa trong dịch vụ. Tuy nhiên thông tin service cho biết phần endpoints là không có gì, có nghĩa là truy cập thì không có phản hồi nào.

----------------------

#### Tạo EndPoint cho Service (không selector)
Service trên có tên `svc1`, không có `selector` để xác định các Pod là endpoint của nó, nên có thể tự tạo ra một endpoint cùng tên `svc1`

```
apiVersion: v1
kind: Endpoints
metadata:
  name: svc1
subsets:
  - addresses:
      - ip: 216.58.220.195      # đây là IP google
    ports:
      - name: port1
        port: 80
```

Triển khai với lệnh

`kubectl apply -f 2.endpoint.yaml`

Xem lại thông tin
```
kubectl describe svc/svc1

Name:              svc1
Namespace:         default
Labels:            <none>
Annotations:       kubectl.kubernetes.io/last-applied-configuration: ...
Selector:          <none>
Type:              ClusterIP
IP:                10.97.217.42
Port:              port1  80/TCP
TargetPort:        80/TCP
Endpoints:         216.58.220.195:80
Session Affinity:  None
Events:            <none>
```

Như vậy svc1 đã có endpoints, khi truy cập `svc1:80` hoặc `svc1.default:80` hoặc `10.97.217.42:80` có nghĩa là truy cập `216.58.220.195:80`

----------------------
#### Thực hành tạo Service có Selector, chọn các Pod là Endpoint của Service
Trước tiên triển khai trên Cluster 2 POD chạy độc lập, các POD đó đều có nhãn app: app1

`3.pods.yaml`
```
apiVersion: v1
kind: Pod
metadata:
  name: myapp1
  labels:
    app: app1
spec:
  containers:
  - name: n1
    image: nginx
    resources:
      limits:
        memory: "128Mi"
        cpu: "100m"
    ports:
      - containerPort: 80
---
apiVersion: v1
kind: Pod
metadata:
  name: myapp2
  labels:
    app: app1
spec:
  containers:
  - name: n1
    image: httpd
    resources:
      limits:
        memory: "128Mi"
        cpu: "100m"
    ports:
```

Triển khai file trên

`kubectl apply -f 3.pods.yaml`

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes055.png)

Nó tạo ra 2 POD `myapp1 (192.168.41.147 chạy nginx)` và `myapp2 (192.168.182.11 chạy httpd)`, chúng đều có nhãn `app=app1`

Tiếp tục tạo ra service có tên `svc2` có thêm thiết lập `selector`chọn nhãn `app=app1`

`4.svc2.yaml`
```
apiVersion: v1
kind: Service
metadata:
  name: svc2
spec:
  selector:
     app: app1
  type: ClusterIP
  ports:
    - name: port1
      port: 80
      targetPort: 80
```

Triển khai và kiểm tra

```
$ 04-svc $ kubectl apply -f 4.svc2.yaml
service/svc2 created

$ 04-svc $ kubectl describe svc/svc2
Name:              svc2
Namespace:         default
Labels:            <none>
Annotations:       kubectl.kubernetes.io/last-applied-configuration: ...
Selector:          app=app1
Type:              ClusterIP
IP:                10.100.165.105
Port:              port1  80/TCP
TargetPort:        80/TCP
Endpoints:         192.168.182.11:80,192.168.41.147:80
Session Affinity:  None
Events:            <none>
```

Thông tin trên ta có, endpoint của svc2 là `192.168.182.11:80,192.168.41.147:80`, hai IP này tương ứng là của 2 POD trên. Khi truy cập địa chỉ svc2:80 hoặc `10.100.165.105:80` thì căn bằng tải hoạt động sẽ là truy cập đến `192.168.182.11:80` (myapp1) hoặc `192.168.41.147:80` (myapp2)

----------------------
#### Thực hành tạo Service kiểu NodePort
Kiểu NodePort này tạo ra có thể truy cập từ ngoài internet bằng IP của các Node, ví dụ sửa dịch vụ svc2 trên thành dịch vụ svc3 kiểu NodePort

`5.svc3.yaml`
```
apiVersion: v1
kind: Service
metadata:
  name: svc3
spec:
  selector:
     app: app1
  type: NodePort
  ports:
    - name: port1
      port: 80
      targetPort: 80
      nodePort: 31080
```

Trong file trên, thiết lập kiểu với `type: NodePort`, lúc này Service tạo ra có thể truy cập từ các IP của Node với một cổng nó ngẫu nhiên sinh ra trong khoảng `30000-32767`. Nếu muốn ấn định một cổng của Service mà không để ngẫu nhiên thì dùng tham số nodePort như trên.

Triển khai file trên

`kubectl appy -f 5.svc3.yaml`

Sau khi triển khai có thể truy cập với IP là địa chỉ IP của các Node và cổng là 31080, ví dụ 172.16.10.101:31080

----------------------
#### Ví dụ ứng dụng Service, Deployment, Secret
Trong ví dụ này, sẽ thực hành triển khai chạy máy chủ nginx với mức độ áp dụng phức tạp hơn đó là

- Xây dựng một image mới từ image cơ sở nginx rồi đưa lên `registry` - Hub Docker đặt tên là `ichte/swarmtest:nginx`
- Tạo Secret chứa xác thực SSL sử dụng bởi `ichte/swarmtest:nginx`
- Tạo deployment chạy/quản lý các POD có chạy `ichte/swarmtest:nginx`
- Tạo Service kiểu NodePort để truy cập đến các POD trên


**Xây dựng image ichte/swarmtest:nginx**

Image cơ sở là nginx (chọn tag bản 1.17.6), đây là một proxy nhận các yêu cầu gửi đến. Ta sẽ cấu hình để nó nhận các yêu cầu http (cổng 80) và https (cổng 443).

Tạo ra thư mục nginx để chứa các file dữ liệu, đầu tiên là tạo ra file cấu hình nginx.conf, file cấu hình này được copy vào image ở đường dẫn /etc/nginx/nginx.conf khi build image.

1 Chuẩn bị file cấu hình nginx.conf

```
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
  worker_connections  4096;  ## Default: 1024
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;
    #gzip  on;
    server {
        listen 80;
        server_name localhost;                    # my-site.com
        root  /usr/share/nginx/html;
    }
    server {
        listen  443 ssl;
        server_name  localhost;                   # my-site.com;
        ssl_certificate /certs/tls.crt;           # fullchain.pem
        ssl_certificate_key /certs/tls.key;       # privkey.pem
        root /usr/share/nginx/html;
    }
}

```

2. File html

```
<!DOCTYPE html>
<html>
<head><title>Nginx -  Test!</title></head>
<body>
    <h1>Chạy Nginx trên Kubernetes</h1>    
</body>
</html>
```

3. Xây dựng image mới

```
FROM nginx:1.17.6
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html
```

Build thành Image mới đặt tên là `ichte/swarmtest:nginx` (đặt tên theo tài khoản của bạn trên Hub Docker, hoặc theo cấu trúc Registry riêng nếu sử dụng) và push Image nên Docker Hub

```
# build image từ Dockerfile, đặt tên image mới là ichte/swarmtest:nginx
docker build -t ichte/swarmtest:nginx -f Dockerfile .

# đẩy image lên hub docker
docker push ichte/swarmtest:nginx
```

#### Tạo Deployment triển khai các Pod chạy ichte/swarmtest:nginx

`6.nginx.yaml`
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: ichte/swarmtest:nginx
        imagePullPolicy: "Always"
        resources:
          limits:
            memory: "128Mi"
            cpu: "100m"
        ports:
        - containerPort: 80
        - containerPort: 443
```

Khi triển khai file này, có lỗi tạo container vì trong cấu hình có thiết lập SSL (server lắng nghe cổng 443) với các file xác thực ở đường dẫn /certs/tls.crt, /certs/tls.key nhưng hiện tại file này không có, ta sẽ sinh hai file này và đưa vào qua Secret

#### Tự sinh xác thực với openssl
Xác thực SSL gồm có `server certificate và private key`, đối với nginx cấu hình qua hai thiết lập `ssl_certificate và ssl_certificate_key` tương ứng ta đã cấu hình là hai `file tls.crt, tls.key.` Ta để tên này vì theo cách đặt tên của letsencrypt.org, sau này bạn có thể thận tiện hơn nếu xin xác thực miễn phí từ đây.

Thực hiện lệnh sau để sinh file tự xác thực

```
openssl req -nodes -newkey rsa:2048 -keyout tls.key  -out ca.csr -subj "/CN=xuanthulab.net"
openssl x509 -req -sha256 -days 365 -in ca.csr -signkey tls.key -out tls.crt
```

Đến đây có 2 file `tls.key và tls.crt`

#### Tạo Secret tên secret-nginx-cert chứa các xác thực
Thi hành lệnh sau để tạo ra một Secret (loại ổ đĩa chứa các thông tin nhạy cảm, nhỏ), Secret này kiểu tls, tức chứa xác thức SSL

`kubectl create secret tls secret-nginx-cert --cert=certs/tls.crt  --key=certs/tls.key`

Secret này tạo ra thì mặc định nó đặt tên file là tls.crt và tls.key có thể xem với lệnh

`kubectl describe secret/secret-nginx-cert`

#### Sử dụng Secret cho Pod
Đã có Secret, để POD sử dụng được sẽ cấu hình nó như một ổ đĩa đê Pod đọc, sửa lại Deployment 6.nginx.yaml như sau:

`6.nginx.yaml`
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec: 
      volumes:
        - name: cert-volume
          secret:
             secretName: "secret-nginx-cert" 
      containers:
      - name: nginx
        image: ichte/swarmtest:nginx
        imagePullPolicy: "Always"
        resources:
          limits:
            memory: "128Mi"
            cpu: "100m"
        ports:
        - containerPort: 80
        - containerPort: 443 
        volumeMounts:
          - mountPath: "/certs"
            name: cert-volume 
```

#### Tạo Service truy cập kiểu NodePort

Thêm vào cuỗi file `6.nginx.yaml`
```
---
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
spec:
  type: NodePort
  ports:
  - port: 8080        # cổng dịch vụ ánh xạ vào cổng POD
    targetPort: 80    # cổng POD ánh xạ vào container
    protocol: TCP
    name: http
    nodePort: 31080   # cổng NODE ánh xạ vào cổng dịch vụ (chỉ chọn 30000-32767)

  - port: 443
    targetPort: 443
    protocol: TCP
    name: https
    nodePort: 31443
  # Chú ý đúng với Label của POD tại Deployment
  selector:
    app: nginx
```

Giờ có thể truy cập từ địa chỉ IP của Node với cổng tương ứng (Kubernetes Docker thì http://localhost:31080 và https://localhost:31443)

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes030.png)

----------------------
### 1.4 Volumes 
Như chúng ta đã biết, hệ thống Kubermetes sẽ tạo ra Pods mới thay thế khi một Pods bị lỗi, chết hay crash. Vậy còn dữ liệu được lưu trong Pods cũ sẽ đi đâu ? Pods mới có lấy lại được dữ liệu của Pods cũ đã mất để tiếp tục sử dụng không ? Khái niệm Voulumes sẽ giúp giải quyết các vấn đề trên.

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

### 1.5 Deployments
Từ trước đến nay, thành phần đầu tiên cần phải khởi tạo trong một hệ thống Kubernetes không gì khác là **Pods**. Và như chúng ta đã biết, để quản lý trạng thái của các **Pods** thì lại cần tạo thêm các **Replication Controller** để quản lý các **Pods** đó, thao tác khá là cồng kềnh. Và hãy tưởng tượng ở một hệ thống lớn đến rất lớn có hàng trăm, hàng ngàn hay hàng vạn **Pods** thì lại cứ mất công đi tạo thêm các **Replication Controller** để quản lý các **Pods** hay nhóm Pods theo labels đó hay sao ?

Kubernetes dã giới thiệu khái niệm **Deployments** giúp đơn giản hóa hơn quá trình bên trên. Với **Deployments** , chúng ta sẽ chỉ cần định nghĩa cấu hình và tạo 1 **Deployments** thì hệ thống sẽ tự động tạo ra 1 hay nhiều **Pods** tương ứng và **ReplicaSet** để quản lý trạng thái của các Pods đó. Ngoài ra, **Deployments** còn có cơ chế giúp người quản lý hệ thống dễ dàng cập nhật, rollback phiên bản của ứng dụng (phiên bản container chạy trong các Pods).


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

Ở file yaml trên, chúng ta định nghĩa 1 deployment tên là kubia. Cấu hình cho Replicas luôn duy trì số lượng 3 Pods, các Pods chạy sẽ có labels app=kubia và container chạy trong Pods sẽ được build từ image luksa/kubia:v1

--------------------------------
Thực hiện lệnh sau để triển khai

`kubectl apply -f 1.myapp-deploy.yaml`

Khi Deployment tạo ra, tên của nó là deployapp, có thể kiểm tra với lệnh:

`kubectl get deploy -o wide`

Deploy này quản sinh ra một ReplicasSet và quản lý nó, gõ lệnh sau để hiện thị các ReplicaSet

`kubectl get rs -o wide`

Đến lượt ReplicaSet do Deploy quản lý lại thực hiện quản lý (tạo, xóa) các Pod, để xem các Pod

```
kubeclt get po -o wide

# Hoặc lọc cả label
kubectl get po -l "app=deployapp" -o wide
```

Thông tin chi tiết về deploy

`kubectl describe deploy/deployapp`


#### Cập nhật Deployment
Bạn có thể cập một Deployment bằng cách sử đổi mẫu (template) của Pod, khi template cập nhật thì nó tự động triển khai ra các Pod. `(sửa file yaml rồi cập nhật với kubectl apply -f ... hoặc biên tập trực tiếp với lệnh kubectl edit deploy/namedeploy)`

Khi một Deployment được cập nhật, thì Deployment dừng lại các Pod, scale lại số lượng Pod về 0, sau đó sử dụng template mới của Pod để tạo lại Pod, Pod cũ không xóa hẳng cho đến khi Pod mới đang chạy, quá trình này diễn ra đến đâu có thể xem bằng lệnh `kubectl describe deploy/namedeploy`. Cập nhật như vậy nó đảm bảo luôn có Pod đang chạy khi đang cập nhật.

------------------------
Có thể thu hồi lại bản cập nhật bằng cách sử dụng lệnh

`kubectl rollout undo`

Cập nhật image mới trong POD - ví dụ thay image của container node bằng image mới httpd

`kubectl set image deploy/deployapp node=httpd --record`

Để xem quá trình cập nhật của deployment

`kubectl rollout status deploy/deployapp`


Khi cập nhật, ReplicaSet cũ sẽ hủy và ReplicaSet mới của Deployment được tạo, tuy nhiên ReplicaSet cũ chưa bị xóa để có thể khôi phục lại về trạng thái trước (rollback).

Bạn cũng có thể cập nhật tài nguyên POD theo cách tương tự, ví dụ giới hạn CPU, Memory cho container với tên app-node

`kubectl set resources deploy/deployapp -c=node --limits=cpu=200m,memory=200Mi`

#### Rollback Deployment

Kiểm tra các lần cập nhật (revision)

`kubectl rollout history deploy/deployapp`

Để xem thông tin bản cập nhật 1 thì gõ lệnh

`kubectl rollout history deploy/deployapp --revision=1`

Khi cần quay lại phiên bản cũ nào đó, ví dụ bản revision 1

`kubectl rollout undo deploy/deployapp --to-revision=1`

Nếu muốn quay lại bản cập nhật trước gần nhất

`kubectl rollout undo deploy/mydeploy`

#### Scale Deployment

Scale thay đổi chỉ số replica (số lượng POD) của Deployment, ý nghĩa tương tự như scale đối với ReplicaSet trong phần trước. Ví dụ để scale với 10 POD thực hiện lệnh:

`kubectl scale deploy/deployapp --replicas=10`

Muốn thiết lập scale tự động với số lượng POD trong khoảng min, max và thực hiện scale khi CPU của POD hoạt động ở mức 50% thì thực hiện

`kubectl autoscale deploy/deployapp --min=2 --max=5 --cpu-percent=50`

Bạn cũng có thể triển khai Scale từ khai báo trong một yaml. Hoặc có thể trích xuất scale ra để chỉnh sửa

`kubectl get hpa/deployapp -o yaml > 2.hpa.yaml`


[Concepts](https://kubernetes.io/docs/concepts/)

[Tham khảo](https://xuanthulab.net/deployment-trong-kubernetes-trien-khai-cap-nhat-va-scale.html)

### 1.6 Namespaces
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


## 3. File Config
### 3.1 Create File ods
```
---
apiVersion: v1
kind: Pod
metadata:
  name: rss-site
  labels:
    app: web
spec:
  containers:
  – name: rss-reader
    image: nginx:1.10
    ports:
      – containerPort: 80
    volumeMounts:
      - name: rss-volume
        mountPath: /var/www/html
  volumes:
  - name: rss-volume
    hostPath:
      path: /data
```

- **apiVersion**: v1: Chỉ ra phiên bản api đang sử dụng. Hiện tại k8s có pod ở phiên bản 1
- **kind**: Pod: : Chỉ loại file mà ta muốn tạo. Có thể là pod, Deployment, Job, Service,.... Tùy theo từng loại mà có các phiên bản api khác nhau. Xem thêm tại đây: https://kubernetes.io/docs/api-reference/v1.6/
- **metadata**: Là các siêu dữ liệu khi tạo pod.
  - `name`: rss-site: Khai báo tên của pod.
  - `app`: web: Ta bổ sung thêm nhãn label với key là app và value tương ứng là web.
- **spec**: Khai báo các đối tượng mà k8s sẽ xử lý như: containers, volume,...
  - `containers`: Khai báo đối tượng containers
    - `name`: rss-reader: Tên containers.
    - `image`: nginx:1.10: containers sẽ được build từ image nginx với tag là 1.10
    - `ports`: Liệt kê các port sẽ được containers expose ra. Ở đây là port 80.
    - `volumeMounts`: Chỉ định volume sẽ được mount vào containers.
      - `name`: rss-volume: Tên volume.
      - `mountPath`: /var/www/html: Volume sẽ được mount vào thư mục /var/www/html trên containers
  - `volumes`: Khai báo đối tượng volume.
      - `name`: rss-volume: Tên volume
      - `hostPath`: Volume sẽ sử dụng thư mục /data trên máy host.

-> [https://kubernetes.io/docs/api-reference/v1.6/](https://kubernetes.io/docs/api-reference/v1.6/)

### 3.2 Create File Deplopment
```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

- **apiVersion**: apps/v1beta1: Chỉ ra phiên bản api sử dụng.
- **kind**: Deployment: Loại file, ở đây là Deployment.
- **metadata**: Các thông tin bổ sung cho deployment này.
  - `name`: nginx-deployment: Tên deployment.
- **spec**: Khai báo các đối tượng mà k8s sẽ xử lý như: containers, volume,...
  - `replicas`: 3: 3Pods sẽ được tạo ra.
  - `template`: Template định nghĩ pod sẽ được tạo từ template này. Các thông tin trong mục template tương ứng với phần định nghĩa ở File pod ở trên. Tạo ra containers từ image nào, xuất ra port nào, có các labels nào,...

### 3.3 Create File Service
```
apiVersion: v1
kind: Service
metadata:
  name: dbfrontend
  labels:
    name: dbfrontend
  spec:
    # label keys and values that must match in order to receive traffic for this service
    selector:
      name: dbfrontend
    ports:
     # the port that this service should serve on
      - port: 5555
        targetPort: 3306
    type: NodePort
```

Ta chỉ tập trung vào các thông số:

- **selector**:
  - `name`: dbfrontend: Định tuyến traffic đến pod với cặp giá trị này (name->dbfrontend).
- **port**:
  - `port: 5555`: port sẽ được expose bởi service.
  - `targetPort: 3306`: Port mà truy cập vào pods. (Giá trị từ 1-65535). (port của service trên container).
- **type**: NodePort: type determines how the Service is exposed. Defaults to ClusterIP. NodePort sẽ expose port 5555 trên tất cả các node (cả cụm cluster).

```
Trong type có 3 dạng đó là:

ClusterIP: "ClusterIP" allocates a cluster-internal IP address for load-balancing to endpoints. Endpoints are determined by the selector or if that is not specified, by manual construction of an Endpoints object. If clusterIP is "None", no virtual IP is allocated and the endpoints are published as a set of endpoints rather than a stable IP.

NodePort: on top of having a cluster-internal IP, expose the service on a port on each node of the cluster (the same port on each node). You'll be able to contact the service on any NodeIP:NodePort address.

LoadBalancer: on top of having a cluster-internal IP and exposing service on a NodePort also, ask the cloud provider for a load balancer which forwards to the Service exposed as a NodeIP:NodePort for each Node.
```

## 4. Lab
### 4.1. Install webserver on K8S
- Tạo webserver chạy trên docker với k8s.
- Thử nghiệm các tính năng:
  - scale, load balacing.
  - Update images cho deployments.
  - roll back.
### 4.2. Deploy apache2.
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

### 4.3. Thử nghiệm tính năng scale, load balancing.
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

### 4.4. Thử nghiệm tính năng update images, roll back
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