---
sidebar_position: 7
---
# Services
## Khái Niệm
- Service là khái niệm được thực hiện bởi : `domain name, và port`. Service sẽ tự động "tìm" các pod được đánh `label` phù hợp (trùng với label của service), rồi chuyển các connection tới đó.
- Nếu tìm được `5 pods` thoả mã `label, service` sẽ thực hiện `load-balancing`: chia connection tới từng pod theo chiến lược được chọn (VD: round-robin: lần lượt vòng tròn).
- Cũng có thể hiểu Service là một dịch vụ mạng, tạo cơ chế cân bằng tải `(load balancing)` truy cập đến các điểm cuối (thường là các Pod) mà Service đó phục vụ.

> Kubernetes Service là một tài nguyên cho phép tạo một điểm truy cập duy nhất đến các Pods cung cấp cùng một dịch vụ. Mỗi Service có địa chỉ IP và port không đổi. Client có thể mở các kết nối đến IP và port của service, sau đó chúng sẽ được điều hướng đến các Pods để xử lý.

![](https://images.viblo.asia/ca651b76-80dc-4cac-9bf5-204ff5769b5f.png)


## Template Service

```yml title="service.yml"
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

## Service Type
### ClusterIP
- Là địa chỉ IP cục bộ trong Cluster Kubernetes, với địa chỉ IP này thì các Pods hay Services có thể tương tác với nhau nhưng bên ngoài sẽ không thể tác tương tác với Service thông qua nó được.

```yml title="clusterip.yml"
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

- khi Pod truy cập địa chỉ IP này với cổng 80 thì nó truy cập đến các endpoint định nghĩa trong dịch vụ. Tuy nhiên thông tin service cho biết phần endpoints là không có gì, có nghĩa là truy cập thì không có phản hồi nào.

### NodePort
- Service có thể tương tác qua Port của các worker nodes trong cluster
- Kiểu NodePort này tạo ra có thể truy cập từ ngoài internet bằng IP của các Node
- Chúng ta hoàn toàn có thể config cho Service nhiều hơn 1 cổng
- NodePort `30000-32767`

``` title="node-port.yml"
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

### LoadBlancer
- Service có địa chỉ IP public, có thể tương tác ở bất cứ đâu.
![](https://images.viblo.asia/fe58cece-06bc-4ec1-b3f0-f835ac7a5c92.png)

``` title="loadbalance.yml"
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
service      NodePort    10.108.54.237   12.121.13.23  80:30243/TCP   40s
```

Truy cập

```
http://12.121.13.23
```

**CLUSTER_IP**: Là địa chỉ IP cục bộ trong Cluster Kubernetes, với địa chỉ IP này thì các Pods hay Services có thể tương tác với nhau nhưng bên ngoài sẽ không thể tác tương tác với Service thông qua nó được.

**EXTERNAL_IP**: IP public, có thể dùng để client bên ngoài (hoặc bất cứ đâu) tương tác với Service

### ExternalName
- Ánh xạ service với 1 DNS Name

``` title="endpoint.yml"
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
