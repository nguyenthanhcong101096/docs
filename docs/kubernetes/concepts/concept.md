---
sidebar_position: 1
---
# Khái niệm
![](https://topdev.vn/blog/wp-content/uploads/2019/05/Kubernetes.png)

[API Kubernetes](https://v1-16.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#pod-v1-core)
## Khái niệm
Kubernetes là dự án mã nguồn dể quản lý các container, automating deployment, scaling and manegement các ứng dụng trên container. (Tạo xóa sửa xếp lịch, scale trên nhiều máy)

## Thành Phần
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
