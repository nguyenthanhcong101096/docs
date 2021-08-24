---
sidebar_position: 1
---
# CodeCommit
AWS CodeCommit là dịch vụ quản lý phiên bản source code cho các ứng dụng - version control service. Với dịch vụ này, chúng ta có thể lưu trữ và quản lý các tài nguyên phát triển ứng dụng bao gồm source code, tài liệu, binary files một cách an toàn.

## Cài đặt và cấu hình AWS CodeCommit
### Tạo AWS user
- Tạo một IAM Group với tên **DevOps** và IAM User với tên **Alex**.

![](https://res.cloudinary.com/ttlcong/image/upload/v1629817259/image-docs/Screen_Shot_2021-08-24_at_22.00.48.png)
- Bổ sung User **Alex** vào Group **DevOps**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629817049/image-docs/user.png)

### Tạo credential cho user mới
Để đồng bộ source code (push/pull) giữa môi trường Development và CodeCommit repository. Các yêu cầu gửi đi qua giao thức SSH và xác thực dựa trên public/private key.

- Để tạo ra publish/private key files, trên MacOS sử dụng lệnh:

```bash
# Khai báo tên file của ssh key: **codecommit_rsa**.
ssh-keygen
```

```
Folder: /Users/anh/.ssh/id_rsa có các files:

Private key: codecommit_rsa
Public key: codecommit_rsa.pub
```

### Cấu hình git sử dụng credential
- Để sủ dụng SSH keys cho **AWS CodeCommit** với user **Alex**, trong folder `.ssh` sử dụng lệnh:

```
aws iam upload-ssh-public-key --user-name Alex --ssh-public-key-body file://codecommit_rsa.pub
```

- Trên AWS Console, IAM -> Users -> Alex -> Security Credentials, chúng ta thấy key mới đã thêm vào (APKA2TUMMYZVRRTWVD62)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629817832/image-docs/ssh.png)

- Trong folder `.ssh` tạo file mới với tên gọi **config** cùng nội dung

```yaml title=".ssh/config"
# chmod 600 config

Host git-codecommit.*.amazonaws.com
User APKA2TUMMYZVRRTWVD62
IdentityFile ~/.ssh/codecommit_rsa
```

- Xác nhận kết quả cấu hình CodeCommit:
```
ssh git-codecommit.ap-southeast-1.amazonaws.com
```

- Create Repo

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

```
aws codecommit create-repository --repository-name FriendReminders --repository-description "A simple demo of microservice"
```

</TabItem>
<TabItem value="awsconsole">

[link create](https://ap-southeast-1.console.aws.amazon.com/codesuite/codecommit/repository/create?region=ap-southeast-1)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629818657/image-docs/Screen_Shot_2021-08-24_at_22.24.03.png)

</TabItem>
</Tabs>

- Git clone Project
```
git clone ssh://git-codecommit.ap-southeast-2.amazonaws.com/v1/repos/FriendReminders
```

## Tích hợp Repository và AWS SNS / Subscribers
Trong phần này, chúng ta sẽ kết hợp dịch vụ AWS Simple Notification Service (SNS) và CodeCommit Repository. Mỗi khi source code trên main branch trong Repository thay đổi, message tự động gửi đến một SNS Topic. Thành phần này đóng vai trò trung gian giữa publisher và subcribers. Trong trường hợp này, CodeCommit là một publisher gửi message đến SNS Topic thông báo source code thay đổi. Những subcribers trên SNS Topic sẽ nhận được message và thực hiện những xử lý tương ứng.

![](https://res.cloudinary.com/ttlcong/image/upload/v1629818834/image-docs/cicd1.png)

Trong thiết kế trên SNS Topic có hai subcribers:
- **Email Notification**: gửi email thông báo source code trên main branch đã thay đổi
- **Lambda**: SNS kích hoạt việc thực thi của AWS Lambda, yêu cầu thực hiện CodeBuild

Dựa trên yêu cầu từ AWS Lambda, CodeBuild service thực hiện quá trình biên dịch, kiểm thử và tạo ra Docker Image chứa bản cập nhật mới của ứng dụng. Sau đó, Docker Image sẽ được đẩy lên Docker Register Repository, từ đó triển khai ra các môi trường khác nhau dựa trên CodeDeploy service.

Trong nội dung của phần thực hành này, chúng ta chỉ tập trung vào thiết lập liên kết giữa CodeCommit với SNS / Subcribers (Email Notification, Lambda). Logic của hàm Lambda đơn giản là ghi một dummy log xuống CloudWatch Log mỗi khi source code có sự thay đổi.

### Simple Notification Service

<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

```
aws sns create-topic --name PushMainBranchReminderFriendsTopic
```

Output

```
{
  "TopicArn": "arn:aws:sns:ap-southeast-2:729365137003:PushMainBranchReminderFriendsTopic"
}
```

</TabItem>
<TabItem value="awsconsole">

[link create](https://ap-southeast-1.console.aws.amazon.com/sns/v3/home?region=ap-southeast-1#/create-topic)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629819341/image-docs/Screen_Shot_2021-08-24_at_22.35.26.png)

</TabItem>
</Tabs>

- Tạo file **trigger.json**, liên kết SNS Topic và CodeCommit Repository
  - repositoryName: Tên của CodeCommit Repository
  - destinationArn: Địa chỉ ARN của SNS Topic

```json title="trigger.json"
{
  "repositoryName": "FriendReminders",
  "triggers": [
    {
      "name": "PushMainBranchReminderFriendsTrigger",
      "destinationArn": "arn:aws:sns:ap-southeast-1:570604655849:PushMainBranchReminderFriendsTopic",
      "customData": "",
      "branches": [
          "master"
      ],
      "events": [
          "all"
      ]
    }
  ]
}
```

- Để kiểm tra cấu hình khai báo, sử dụng lệnh:

```
aws codecommit test-repository-triggers --cli-input-json file://trigger.json
```

```json title="output"
{
  "successfulExecutions": [
      "PushMainBranchReminderFriendsTrigger"
  ],
  "failedExecutions": []
}
```

- Cài đặt Trigger lên AWS CodeCommit Repository

```
aws codecommit put-repository-triggers --cli-input-json file://trigger.json
```

```json title="output"
{
  "configurationId": "553da9c5-3124-4112-b5c8-1f0dd520d7ae"
}
```

- Kiểm tra danh sách Triggers trong Repository FriendReminders:
```
aws codecommit get-repository-triggers --repository-name FriendReminders
```

```json title="output"
{
  "configurationId": "553da9c5-3124-4112-b5c8-1f0dd520d7ae",
  "triggers": [
    {
      "name": "PushMainBranchReminderFriendsTrigger",
      "destinationArn": "arn:aws:sns:ap-southeast-2:729365137003:PushMainBranchReminderFriendsTopic",
      "customData": "",
      "branches": [
          "master"
      ],
      "events": [
          "all"
      ]
    }
  ]
}
```

- Xác nhận Trigger trên AWS Console CodeCommit -> Source -> Repositories -> Settings

![](https://res.cloudinary.com/ttlcong/image/upload/v1629819901/image-docs/trigger.png)

### Tạo SNS Subscriber Email
<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

```
aws sns subscribe --topic arn:aws:sns:ap-southeast-2:729365137003:PushMainBranchReminderFriendsTopic --protocol email --notification-endpoint example@gmail.com
```

</TabItem>
<TabItem value="awsconsole">

[link create](https://ap-southeast-1.console.aws.amazon.com/sns/v3/home?region=ap-southeast-1#/create-subscription)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629820348/image-docs/Screen_Shot_2021-08-24_at_22.49.08.png)

</TabItem>
</Tabs>

- Kiểm tra Inbox email từ AWS và lựa chọn Confirm subscription trong nội dung email
- Kiểm tra kết quá quả trình đăng kí:
```
aws codecommit test-repository-triggers --cli-input-json file://trigger.json
```

```txt title="content"
Hello,
The following repository in AWS CodeCommit has changed: FriendReminders
The repository was changed by the IAM user: operator
More info: https://console.aws.amazon.com/codesuite/codecommit/repositories/FriendReminders/browse?region=ap-southeast-2
Branches: master
```

### Tạo SNS Subscriber Lambda
