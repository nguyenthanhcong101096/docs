---
sidebar_position: 4
---
# CodePipeline
CodePipeline là dịch vụ AWS cho phép chúng ta xây dựng qui trình khiển khai ứng dụng một cách liên tục và tự động. Với cách thức cấu hình đơn giản

![](https://res.cloudinary.com/ttlcong/image/upload/v1629880958/image-docs/php-project-release-pipeline-1536x758.png)

## Khái niệm
### Pipeline
là một qui trình - workflow mô tả một chuỗi các bước thực hiện từ việc thay đổi source code đến khi tích hợp và triển khai những thay đổi này sang môi trường sản phẩm.

### Stage
mô tả mỗi bước thực hiện trong Pipeline. Stage thường hoạt động trong một môi trường độc lập, thực hiện những xử lý dựa trên input artifact.

### Transition
là mốc dịch chuyển giữa việc thực thi của các stages trong một pipeline. Việc kiểm soát transition (enable / disable) cho phép chúng ta thực hiện các xác nhận cần thiết trước khi quyết định tiếp tục việc triển khai.

### Artifact 
được phân chia thành hai loại:

- Input artifact: được sử dụng để thực thi các hoạt động trong một stage. Ví dụ: source code là input artifact - được biên dịch / kiểm thử bởi các câu lệnh build stage.
- Output artifact: là kết quả được tạo ra bởi các hoạt động trong một stage. Ví dụ: các lệnh trong build stage tạo ra Test Report, Log, hoặc Docker Image.


:::tip
Output Artifacts từ một stage có thể được sử dụng làm Input Artifact trong stage tiếp theo. Ví dụ, build stage tạo ra Docker Image, deploy stage sử dụng Docker Image để cài đặt / triển khai trong ECS Cluster.
:::

## CodePipeline
- [Tham khảo](https://salzam.com/create-codepipeline-for-rails-project/)

### Chuẩn bị môi trường
- [ECS Cluster](/docs/amazon/ecs/ecs) Hoặc [CodeBuild](/docs/amazon/continuous_delivery/codepdeploy)
- Ví dụ này dùng ECS
  - **cluster ecs**     `rails-cluster`
  - **task definition** `rails-compose`
  - Deploy: **Amazon ECS**


### Tạo code pipeline
- Choose pipeline settings
  - Note policy: **AWSCodeCommitPowerUser**
![](https://res.cloudinary.com/ttlcong/image/upload/v1629865029/image-docs/Screen_Shot_2021-08-25_at_11.16.54.png)

- Add source stage
  - Source provider: AWS CodeCommit
  - Repository name: FriendReminders
  - Branch name: master
  - Change detection options: Amazon CloudWatch Events

![](https://res.cloudinary.com/ttlcong/image/upload/v1629865201/image-docs/Screen_Shot_2021-08-25_at_11.19.52.png)

- Build
  - Build provider: AWS CodeBuild
  - Project name: FriendRemindersBuild
  - Build type: Single build

![](https://res.cloudinary.com/ttlcong/image/upload/v1629865309/image-docs/Screen_Shot_2021-08-25_at_11.21.37.png)

- Deploy provider: Amazon ECS
  - Cluster name: friendreminders
  - Service name: remindersmgt
  - Image definitions file - optional: imagedefinitions.json

![](https://res.cloudinary.com/ttlcong/image/upload/v1629865491/image-docs/Screen_Shot_2021-08-25_at_11.24.34.png)

- Deploy Thành Công

![](https://res.cloudinary.com/ttlcong/image/upload/v1629866004/image-docs/Screen_Shot_2021-08-25_at_11.32.31.png)
