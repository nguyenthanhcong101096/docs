---
sidebar_position: 1
---
# CodeCommit
AWS CodeCommit là dịch vụ quản lý phiên bản source code cho các ứng dụng - version control service. Với dịch vụ này, chúng ta có thể lưu trữ và quản lý các tài nguyên phát triển ứng dụng bao gồm source code, tài liệu, binary files một cách an toàn.

![](https://res.cloudinary.com/ttlcong/image/upload/v1629818834/image-docs/cicd1.png)

## AWS CodeCommit
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
<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

- Để sủ dụng SSH keys cho **AWS CodeCommit** với user **Alex**, trong folder `.ssh` sử dụng lệnh:


```
aws iam upload-ssh-public-key --user-name Alex --ssh-public-key-body file://codecommit_rsa.pub
```
</TabItem>
<TabItem value="awsconsole">

- Trên AWS Console, IAM -> Users -> Alex -> Security Credentials, chúng ta thấy key mới đã thêm vào (APKA2TUMMYZVRRTWVD62)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629817832/image-docs/ssh.png)

</TabItem>
</Tabs>

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

## Simple Notification Service SNS
Trong thiết kế trên SNS Topic có hai subcribers:
- **Email Notification**: gửi email thông báo source code trên main branch đã thay đổi
- **Lambda**: SNS kích hoạt việc thực thi của AWS Lambda, yêu cầu thực hiện CodeBuild

Dựa trên yêu cầu từ AWS Lambda, CodeBuild service thực hiện quá trình biên dịch, kiểm thử và tạo ra Docker Image chứa bản cập nhật mới của ứng dụng. Sau đó, Docker Image sẽ được đẩy lên Docker Register Repository, từ đó triển khai ra các môi trường khác nhau dựa trên CodeDeploy service.

Trong nội dung của phần thực hành này, chúng ta chỉ tập trung vào thiết lập liên kết giữa CodeCommit với SNS / Subcribers (Email Notification, Lambda). Logic của hàm Lambda đơn giản là ghi một dummy log xuống CloudWatch Log mỗi khi source code có sự thay đổi.

### Create SNS

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

### Create trigger code commit

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

### Subscriber Email
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

### Subscriber Lambda
Trong ví dụ này, chúng ta kết hợp trigger từ “sự kiện” source code trên main branch của CodeCommit Repository được cập nhật, từ đó thực thi Python Lambda function để in ra thông tin dummy log trên màn hình Terminal hoặc CloudWatch.

#### 1. Tạo Role Lambda

- Để function có quyền thực thi và ghi log ra CloudWatch, chúng ta cần định nghĩa một service role. Service role cho phép chúng ta khai báo principal (trong trường hợp này là Lamba function) và bổ sung các policy vào service role cho phép principal có quyền sử dụng các tài nguyên khác trên AWS.

<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

```json title="trust-policy.json"
// cho phép service principal lambda.amazonaws.com
// sử dụng dịch vụ AWS STS (Security Token Service) để có được - assume permission trong các policy attach vào service role
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```
# sử dụng lệnh create-role để tạo service role CodeBuildTriggerLambdaRole
aws iam create-role --role-name CodeBuildTriggerLambdaRole --assume-role-policy-document file://trust-policy.json
```

```json title="output"
{
  "Role": {
    "Path": "/",
    "RoleName": "CodeBuildTriggerLambdaRole",
    "RoleId": "AROA2TUMMYZVVW5UQX7S4",
    "Arn": "arn:aws:iam::729365137003:role/CodeBuildTriggerLambdaRole",
    "CreateDate": "2020-09-04T03:28:52+00:00",
    "AssumeRolePolicyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
              "Service": "lambda.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }
  }
}
```

- Bổ sung Policy **AWSLambdaBasicExecutionRole** vào service role **CodeBuildTriggerLambdaRole**
- Nội dung policy AWSLambdaBasicExecutionRole cho phép một lambda function ghi thông tin ra AWS CloudWatch, nội dung trong policy

```json title="policy"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

```
aws iam attach-role-policy --role-name CodeBuildTriggerLambdaRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

</TabItem>
<TabItem value="awsconsole">

![](https://res.cloudinary.com/ttlcong/image/upload/v1629853506/image-docs/Screen_Shot_2021-08-25_at_8.04.46.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629853576/image-docs/Screen_Shot_2021-08-25_at_8.06.06.png)

</TabItem>
</Tabs>

#### 2. Tạo Lambda
<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

- Tạo một folder lambda-function chứa source code và cấu hình cho Lambda project.
- Tạo zip file chứa **lambda_function.py**: `zip function.zip lambda_function.py`

```py title="lambda-function/lambda_function.py"
import os

def entrypoint(event, context):
    print('Starting a new build ...')
    print('## ENVIRONMENT VARIABLES')
    print(os.environ)
    print('## EVENT')
    print(event)
```

- Để triển khai Lambda function lên AWS, trong folder Clambda-function

```
# create lambada
aws lambda create-function --function-name CodeBuildTriggerLambda \
--zip-file fileb://function.zip \
--runtime python3.8 \
--handler lambda_function.entrypoint \
--role arn:aws:iam::729365137003:role/CodeBuildTriggerLambdaRole
```

```
# update lambada
aws lambda update-function-code --function-name CodeBuildTriggerLambda --zip-file fileb://function.zip
```

</TabItem>
<TabItem value="awsconsole">

[link create](https://ap-southeast-1.console.aws.amazon.com/lambda/home?region=ap-southeast-1#/create/function)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629854223/image-docs/Screen_Shot_2021-08-25_at_8.16.51.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629854502/image-docs/Screen_Shot_2021-08-25_at_8.21.28.png)

</TabItem>
</Tabs>

#### 3. Thực thi Lambda

<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

```
# Thực thi project và hiển thị log trên màn hình Terminal:

aws lambda invoke --function-name CodeBuildTriggerLambda  out --log-type Tail \
--query 'LogResult' --output text |  base64 -d
```

</TabItem>
<TabItem value="awsconsole">

</TabItem>
</Tabs>

- Kết quả hiển thị tương tự trên AWS Console, CloudWatch -> CloudWatchLogs

![](https://res.cloudinary.com/ttlcong/image/upload/v1629855328/image-docs/cloudwatch.png)

#### 4. Tạo Subcribe Lambda với SNS Topic
<Tabs
  defaultValue="awscli"
  values={[
    { label: 'awscli', value: 'awscli' },
    { label: 'awsconsole', value: 'awsconsole' },
  ]
}>
<TabItem value="awscli">

```
aws sns subscribe --topic arn:aws:sns:ap-southeast-2:729365137003:PushMainBranchReminderFriendsTopic --protocol lambda --notification-endpoint arn:aws:lambda:ap-southeast-2:729365137003:function:CodeBuildTriggerLambda
```

- Bổ sung permission cho phép SNS service gọi đến Lamda function

```
aws lambda add-permission --function-name CodeBuildTriggerLambda --action "lambda:InvokeFunction" --statement-id sns --principal sns.amazonaws.com --region ap-southeast-2 --source-arn arn:aws:sns:ap-southeast-2:729365137003:PushMainBranchReminderFriendsTopic
```

</TabItem>
<TabItem value="awsconsole">

</TabItem>
</Tabs>

### Kiểm ra kết quả subscription
- Trong FriendReminders, thay đổi source code và push lên CodeCommit
- Xác nhận Email Notification trong địa chỉ Email Subscriber
- Xác nhận AWS Lambda function thực thi trong CloudWatch Logs


:::tip
Bằng cách thực thi Lambda function mỗi khi Source Code thay đổi thông qua CodeCommit Trigger và SNS Topic, chúng ta có thể mở rộng logic của Lambda function này, cho phép kích hoạt quá trình biên dịch và triển khai với các dịch vụ khác như AWS CodeBuild, hoặc CodeDeploy. Có thể tham khảo thêm cách thức sử dụng CodeBuildTriggerLambda trong bài thực hành CodeBuild
:::
