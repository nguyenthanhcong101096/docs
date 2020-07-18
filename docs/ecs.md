---
id: ecs
title: Deploy docker image to AWS ECS
sidebar_label: Deploy docker image to AWS ECS
---

## What is ECS, ECR ?
Được gọi tắt là ECS là một service quản lý container có tính scale cao và nhanh. Dễ dàng run, stop, hay quản lý docker container ở trong một cluster. Bạn có thể host một serverless infrastructure bằng cách chạy service hay task sử dụng Fragate launch type.

### ECS features
Amazon ECS là một dịch vụ theo region, nó đơn giản hoá việc chạy ứng dụng containers trên nhiều AZ trong cùng một Region. Bạn có thể tạo một ECS cluster bên trong một VPC mới hoặc cũ. Sau khi một cluster được khởi tạo và chạy, bạn có thể định nghĩa cá task và services mà nó chỉ định Docker contatainer image sẽ chạy thông qua clusters.

![](https://images.viblo.asia/8ae392cf-3e6e-4bce-bf4a-fa1f5911a59a.png)

### Container và Images
Để deploy ứng dụng trên ECS, Các thành phần trong ứng dụng của bạn phải được kiến trúc để chạy containers. Một Docker container là một đơn vị chuẩn của phát triển phần mềm nó chứa tất cả các phần mềm cần thiết để chạy code, runtime, system tools, system libaries … Containers được tạo ra từ read-only template (image)

![](https://images.viblo.asia/5034bd80-4d9f-4c52-8b5d-6eb0b9b11524.png)

### Task definition
Task definition là một text file (json format). Nó sẽ mô tả 1 hoặc nhiều container (tối đa là 10) để hình thành nên ứng dụng của bạn. Task definition sẽ chỉ ra một vài parameter cho ứng dụng như container nào sẽ được sử dụng, launch type sẽ được dùng, những port nào sẽ được mở cho ứng dụng và data volume gì sẽ được với containers trong task.

### Task and schedule
Một task là việc khởi tạo một task definition bên trong cluster. Sau khi bạn tạo một task definition cho ứng dụng trong ECS, bạn có thể chỉ định một lượng task nhất định chạy trên cluster.

Với mỗi một task sử dụng Fargate launch type có một ranh giới riêng biệt và không share kernel, cpu resource, memory, hay elastic network interface với task khác

Amazon ECS task scheduler chịu trách nhiệm cho việc thay thế các task bên trong cluster. Có một vài cách khác nhau để lên schedule cho task

```
  Service schedule
  Manually running task
  Running task on a cron-like schedule
  Custom scheduler
```

![](https://images.viblo.asia/3489dede-6e8f-415d-90d0-1a501cea6c2f.png)

### Cluster
Khi các tasks được chạy trên ECS là khi đó chúng được đặt trong cluster, Khi sử dụng Fargate lauch type với các task bên trong cluster, ECS sẽ quản lý cluster resources. Khi sử dụng EC2 launch type thì các cluster là những group container instances.

Một ECS containter là một instance Amazon EC2 instance mà nó chạy ECS container agent. Amazon ECS download container images của bạn từ registry mà bạn đã setting trước đó sau đó sẽ run những images này trong cluster của bạn

```
Cluster là Region-specific
Cluster có thể chứa nhiều tasks sử dụng cả Fargate và EC2 launch type.
Cho các task sử dụng EC2 launch type , các clusters có thể chứa nhiều container instance type khác nhau, nhưng mỗi một container instance có thể chỉ là một phần của một cluster tại một thời điểm
Bạn có thể tạo một custom IAM policy cho cluster cho phép hoặc giới hạn user access tới clusters
```

## Lab

### 1. Create IAM uesr and Instance EC2
- User need create IAM uesrs with permissions:
  - AmazonEC2ContainerRegistryFullAccess
  - AmazonECS_FullAccess

```
create groupA(include 2 permission) -> create user IAM to groupA
```

- Download access_key

### 2. Config aws cli
In EC2 or Machine install awscli
```
sudo apt install awscli
```

```
[root@ip-172-31-25-132 ~]#    aws configure
AWS Access Key ID [None]:     AKIATUX6GD4T
AWS Secret Access Key [None]: 7LbVGuoQzSpsAJ84DSKSInjGs
Default region name [None]:   ap-southeast-1
Default output format [None]: json
```

### 3. Create docker image
![](https://miro.medium.com/max/700/0*2PMeWkEkscO5C-1l.png)

create file index.html
```
<html>
<head><title>HOW TO DEPLOY DOCKER</title></head>
<body><h1>CONG NT</h1></body>
</html>

```
create file Dockerfile
```
FROM nginx

COPY index.html /usr/share/nginx/html
```

build docker
```
docker build -t yourname:version .
```

### 4. Create repository in AWS/ECR(Amazon Elastic Container Registry)

in ecs2

```
aws ecr create-repository --repository-name your_name --region your_region
```

or in dashboard aws

```
dashboard -> ecs -> repository -> create repository
```

afer create reposity in ecr
```
[ec2-user@ip]$ aws ecr create-repository --repository-name congttl/ecs --region ap-southeast-1
{
    "repository": {
        "repositoryUri": "570604655849.dkr.ecr.ap-southeast-1.amazonaws.com/congttl/ecs", 
        "imageScanningConfiguration": {
            "scanOnPush": false
        }, 
        "registryId": "570604655849", 
        "imageTagMutability": "MUTABLE", 
        "repositoryArn": "arn:aws:ecr:ap-southeast-1:570604655849:repository/congttl/ecs", 
        "repositoryName": "congttl/ecs", 
        "createdAt": 1595079650.0
    }
}
```

#### Create docker tag version
```
docker tag [image_name]:tag [repository ULR o ben tren] 

docker tag congttl/ecs:v1 570604655849.dkr.ecr.ap-southeast-1.amazonaws.com/congttl/ecs
```

#### Push to AWS/ECR
```
docker push [Repository ULR]
docker push 570604655849.dkr.ecr.ap-southeast-1.amazonaws.com/congttl/ecs
```

#### AWS ECR Login
```
aws ecr get-login --no-include-email --region ap-southeast-1
```

```
[ec2-user@ip]$ aws ecr get-login --no-include-email --region ap-southeast-1
docker login -u AWS -p eyJwYXlsb2FkIjoibWpRYTBBSkZ0YzVu
VZTnRKS3VQQzdvVmhsYVRURCtpSXlqcGdwdVNNc05YRlV1emhDQzB6a
jNaMTVHSW1ZMEJHMWJNUFV3bk5GVHBRanBGd3NkRXI2MzM2RTViRlEy
mRtSXZ6b3krRDVrQk5KS3VoUTRFREFKSktVM2tKTEJHMGZIdTR0Y1lw
```

and then copy and paste to login

### 5.Create Task in AWS/ECS
```
Dashboard -> ECS -> Task definitions -> Create new task definitions
```
![](https://fortinetweb.s3.amazonaws.com/docs.fortinet.com/v2/resources/4a43cb9c-f2ee-11e8-b86b-00505692583a/images/721cd423f8f7e0504a92cd7b689b8100_image47.png)

Choose EC2

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2019/12/27125404/002-6.png)

### 6. Create cluster
![](https://www.cloudtp.com/wp-content/uploads/2016/05/2.2.png)

- choose EC2 Linux + Networking to Deploy

![](https://d1.awsstatic.com/PAC/ECS-Step1b.05c8b038ef29d98e52b1eeb60d66f45b8a26a62f.png)

- Input information and Create

![](https://hazelcast.com/wp-content/uploads/blog-archive/2018/12/configure-cluster-1.png)

#### 6.1 Create Service cluster

![](https://d2908q01vomqb2.cloudfront.net/0716d9708d321ffb6a00818614779e779925365c/2017/11/08/ECSCluster-Empty.png)
![](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2018/03/26/2018-03-26_06-28-34-1-1024x727.png)
