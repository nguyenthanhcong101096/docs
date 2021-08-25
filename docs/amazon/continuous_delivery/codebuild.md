---
sidebar_position: 2
---
# CodeBuild
CodeBuild là dịch vụ AWS hỗ trợ quá trình tích hợp các thay đổi từ source code vào hệ thống một cách liên tục thông qua các hoạt động biên dịch, kiểm thử và đóng gói sản phẩm phần mềm để chuẩn bị cho giai đoạn triển khai kế tiếp.

![](https://res.cloudinary.com/ttlcong/image/upload/v1629857645/image-docs/codebuild.png)

Các bước thực hiện:

- Tạo một build project khai báo thông tin source code: cách thực hiện biên dịch / kiểm thử, vị trí lưu trữ của source code, vị trí lưu trữ kết quả biên dịch.

- CodeBuild sử dụng build project để taọ ra build environment dưới dạng Docker Container. Build environment kết hợp của hệ điều hành, trình biên dịch cùng các công cụ hỗ trợ khác.

- CodeBuild download source code từ một repository (CodeCommit, GitHub, S3) và đưa vào build environment. Tại đây, CodeBuild dựa trên các khai báo trong file buildspec.yaml để thực hiện quá trình build

- Khi hoạt động build thành công, kết quả đầu ra - artifacts có thể được lưu trữ trong nhiều hệ thống khác nhau: S3, Elastic Container Registry.

- Trong quá trình thực thi, build environment gửi các thông tin log ra CodeBuild console hoặc AWS CloudWatch.

- Sử dụng công cụ: AWS Console, AWS CLI, AWS SDK, AWS Pipeline điều khiển / giám sát quá trình build.

## Thực hành
- Sử dụng AWS Console / AWS CLI để tạo Build Project cho FriendReminders
- Tích hợp CodeBuild và CodeCommit thông qua AWS Lambda Subscriber
- Sử dụng CodeBuild thực thi Unit Tests

## CodeBuild
### Tạo buildspec files
- **pre_build**: commands ECR login và khai báo biến sử dụng
- **build**: docker build và docker tag commands
- **post_build**: docker push commands

```yml title="project/buildspec.yml"
version: 0.2

phases:
  install:
    runtime-versions:
      docker: 18
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 570604655849.dkr.ecr.your-region.amazonaws.com
      - REPOSITORY_URI=570604655849.dkr.ecr.ap-southeast-1.amazonaws.com/nginx
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
```

Commit và Push `buildspec.yml` lên CodeCommit Repository FriendReminders.

### Tạo build project
Trên AWS Console Developer Tools -> CodeBuild, click button Create build project tạo build project với thông tin cấu hình:

- Project Configuration

![](https://res.cloudinary.com/ttlcong/image/upload/v1629860229/image-docs/Screen_Shot_2021-08-25_at_9.56.56.png)

- Source
  - AWS CodeCommit: **AWS CodeCommit / Github**
  - Repository: **FriendReminders**
  - Reference Type: **Branch**
  - Branch: **master**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629860304/image-docs/Screen_Shot_2021-08-25_at_9.58.14.png)


- Environment:
  - Environment Image: **Managed image**
  - Operating System: **Amazon Linux 2**
  - Runtime(s): **Standard**
  - Image: **aws/codebuild/amazonlinux2-x86_64-standard:3.0**
  - Environment Type: **Linux**
  - Privileged: **Lựa chọn Select**
  - Service role: **New select role**
  - Role name: **codebuild-FriendRemindersBuild-service-role**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629860590/image-docs/Screen_Shot_2021-08-25_at_10.02.58.png)

- Buildspec:
  - Build specifications: Use a buildspec file
  - Buildspec name - optional: sử dụng buildspec.yml khai báo trong project

![](https://res.cloudinary.com/ttlcong/image/upload/v1629861029/image-docs/Screen_Shot_2021-08-25_at_10.10.18.png)

- Artifacts
  - Type: No artifacts

![](https://res.cloudinary.com/ttlcong/image/upload/v1629861146/image-docs/Screen_Shot_2021-08-25_at_10.12.17.png)

- Logs:
  - CloudWatch logs - optional: Lựa chọn Select
  - Group name: /aws/codebuild/FriendReminders
  - Stream name: Build

![](https://res.cloudinary.com/ttlcong/image/upload/v1629861286/image-docs/Screen_Shot_2021-08-25_at_10.14.34.png)

- Sau khi tạo thành công

![](https://res.cloudinary.com/ttlcong/image/upload/v1629861427/image-docs/Screen_Shot_2021-08-25_at_10.16.54.png)
