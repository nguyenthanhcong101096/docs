---
sidebar_position: 6
---
# Daemon set
## Khái niệm
- Deamon set hoạt động giống Replica set. Có khả nặng tạo và quản lý các POD. Nó tạo trên mỗi node chỉ có 1 pod
- Triển khai DaemonSet khi cần ở mỗi máy (Node) một POD, thường dùng cho các ứng dụng như thu thập log, tạo ổ đĩa trên mỗi Node

## Template DaemonSet
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
