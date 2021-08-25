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
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - $(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)
      - REPOSITORY_URI=729365137003.dkr.ecr.ap-southeast-2.amazonaws.com/remindersmgtservice
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - echo Building for repository $REPOSITORY_URI
      - docker build -t $REPOSITORY_URI:latest ./Services/RemindersManagement/RemindersManagement.API
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
```

Commit và Push `buildspec.yml` lên CodeCommit Repository FriendReminders.

### Tạo build project
