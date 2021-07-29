---
sidebar_position: 4
---
# Replication Controllers
## Khái niệm
- Replication controller đảm bảo rằng số lượng các pod replicas đã định nghĩa luôn luôn chạy đủ số lượng tại bất kì thời điểm nào.
- Thông qua Replication controller, Kubernetes sẽ quản lý vòng đời của các pod, bao gồm scaling up and down, rolling deployments, and monitoring.

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes052.png)

## Template Replication
![](https://images.viblo.asia/f03449ef-0f91-40de-ab2b-8990ff478d0d.png) 

- **label selector**: Xác định pods mà Controller quản lý (theo labels)
- **replica count**: Số lượng pods cần duy trì 
- **pod template**: Được hiểu là khuôn mẫu của pods để Controller sử dụng để tạo Pods mới khi cần.

```yml
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


## Horizontal Pod AutoScaler
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
