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

- Setting

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220825/017-1-1024x541.png)

- Source

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220853/019-1024x560.png)

> Click on Connect to Github and select the repository and the branch like CodeBuild step.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220905/020-1024x986.png)

- Build

> We will simply select the Codebuild project we have created earlier.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220916/021-1024x626.png)

- Deploy

> We will choose Amazon ECS and Deploy provider followed by cluster name and the rails service we have

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220928/022-1024x696.png)

Now Click on Release Change button to test the whole process.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/04025930/sweet-726x1024.png)
