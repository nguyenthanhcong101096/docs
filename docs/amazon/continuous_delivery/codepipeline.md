---
sidebar_position: 3
---
# CodePipeline
CodePipeline là dịch vụ AWS cho phép chúng ta xây dựng qui trình khiển khai ứng dụng một cách liên tục và tự động. Với cách thức cấu hình đơn giản

![](https://res.cloudinary.com/ttlcong/image/upload/v1629863477/image-docs/E3_82_B9_E3_82_AF_E3_83_AA_E3_83_BC_E3_83_B3_E3_82_B7_E3_83_A7_E3_83_83_E3_83_88-2020-04-22-7.28.51.png)

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
- [Tạo ECS](/docs/amazon/ecs/ecs)
  - **cluster ecs**     `rails-cluster`
  - **task definition** `rails-compose`

- Update [CodeBuild](/docs/amazon/continuous_delivery/codebuild#tạo-buildspec-files)
```yml title="buildspec.yml"
version: 0.2

phases:
  install:
    runtime-versions:
      docker: 18
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin account_id.dkr.ecr.your-region.amazonaws.com
      - REPOSITORY_URI=account_id.dkr.ecr.your-region.amazonaws.com/rails_app
      - TIME_STAMP=$( date +%s )
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:v$TIME_STAMP
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:v$TIME_STAMP
      - echo Writing image definitions file...
      - printf '[{"name":"rails","imageUri":"%s"}]' $REPOSITORY_URI:v$TIME_STAMP > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```

### Tạo code pipeline
- Choose pipeline settings

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
