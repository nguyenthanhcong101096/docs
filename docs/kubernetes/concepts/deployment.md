---
sidebar_position: 5
---
# Deployments
## Khái niệm
- **Deployment** quản lý một nhóm các Pod - các Pod được nhân bản, nó tự động thay thế các Pod bị lỗi, không phản hồi bằng pod mới nó tạo ra. Như vậy, deployment đảm bảo ứng dụng của bạn có một (hay nhiều) Pod để phục vụ các yêu cầu.

- **Deployment** sử dụng mẫu Pod (Pod template - chứa định nghĩa / thiết lập về Pod) để tạo các Pod (các nhân bản replica), khi template này thay đổi, các Pod mới sẽ được tạo để thay thế Pod cũ ngay lập tức.

![](https://images.viblo.asia/db1d0783-0c88-42a6-8d80-26acc5123712.png)

## Template Deployment

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

## Restart Deployment
```
kubectl rollout restart deploy/deployapp
```

------------------------

## Update Deployment
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

## Rollback Deployment
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

## Scale Deployment
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
