---
sidebar_position: 3
---
# CodeDeploy
AWS CodeDeploy là dịch vụ triển khai được quản lý toàn phần có khả năng tự động hóa việc triển khai phần mềm trên các dịch vụ điện toán như Amazon EC2, AWS Fargate, AWS Lambda và các máy chủ chạy tại chỗ của bạn

![](https://res.cloudinary.com/ttlcong/image/upload/v1629880394/image-docs/CodePipeline_Diagram-06-e1617173281833-2048x1040.png)

## CodeCommit
[Tham Khao](/docs/amazon/continuous_delivery/codecommit)

- Tạo file và push lên code commit

```yaml title="project/appspec.yml"
version: 0.0
os: linux
files:
  - source: /index.html
    destination: /var/www/html/
hooks:
  BeforeInstall:
    - location: scripts/install_dependencies
      timeout: 300
      runas: root
    - location: scripts/start_server
      timeout: 300
      runas: root
  ApplicationStop:
    - location: scripts/stop_server
      timeout: 300
      runas: root
```

```bash title="project/scripts/install_dependencies"
#!/bin/bash
yum install -y httpd
```
```bash title="project/scripts/start_server"
#!/bin/bash
service httpd start
```
```bash title="project/scripts/stop_server"
#!/bin/bash
isExistApp = `pgrep httpd`
if [[ -n  $isExistApp ]]; then
    service httpd stop        
fi
```

## EC2 Instance
### Tạo Role EC2 instance
- policy: **AmazonEC2RoleforAWSCodeDeploy**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629883843/image-docs/Screen_Shot_2021-08-25_at_16.30.27.png)

### Tạo EC2 Instance

- User data

```
#!/bin/bash
yum -y update
yum install -y ruby
yum install -y aws-cli
cd /home/ec2-user
aws s3 cp s3://aws-codedeploy-us-east-2/latest/install . –region us-east-2
chmod +x ./install
./install auto
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1629884830/image-docs/Screen_Shot_2021-08-25_at_16.46.44.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629884884/image-docs/Screen_Shot_2021-08-25_at_16.47.24.png)

## CodeDeploy
### Tạo Role CodeDeploy

![](https://res.cloudinary.com/ttlcong/image/upload/v1629885037/image-docs/Screen_Shot_2021-08-25_at_16.50.23.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629885113/image-docs/Screen_Shot_2021-08-25_at_16.51.41.png)

### Tạo CodeDeploy
![](https://res.cloudinary.com/ttlcong/image/upload/v1629885445/image-docs/Screen_Shot_2021-08-25_at_16.57.03.png)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629885613/image-docs/Screen_Shot_2021-08-25_at_16.59.39.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629885665/image-docs/Screen_Shot_2021-08-25_at_17.00.55.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629885708/image-docs/Screen_Shot_2021-08-25_at_17.01.35.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629885754/image-docs/Screen_Shot_2021-08-25_at_17.02.20.png)

## CodePipeline
- Skip Build
- Deploy: CodeDeploy
