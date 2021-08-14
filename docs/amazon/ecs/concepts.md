---
sidebar_position: 1
---

# Concepts

## Concepts
![](https://cloudgeeks.net/wp-content/uploads/2020/04/Amazon-ECS-Architect.png)

### Task definition
Task definition là một text file (json format) nó giống `docker-compose`. Nó sẽ mô tả 1 hoặc nhiều container (tối đa là 10) để hình thành nên ứng dụng của bạn.

Example task bao gồm reids mysql rails

```
{
  "ipcMode": null,
  "executionRoleArn": "arn:aws:iam::570604655849:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "dnsSearchDomains": null,
      "environmentFiles": null,
      "logConfiguration": null,
      "entryPoint": [
        "./scripts/rails.sh"
      ],
      "portMappings": [
        {
          "hostPort": 80,
          "protocol": "tcp",
          "containerPort": 3000
        }
      ],
      "command": [],
      "linuxParameters": null,
      "cpu": 0,
      "environment": [
        {
          "name": "DATABASE_HOSTNAME",
          "value": "database"
        },
        {
          "name": "DATABASE_NAME",
          "value": "ecs_development"
        },
        {
          "name": "DATABASE_PASSWORD",
          "value": "password"
        },
        {
          "name": "DATABASE_USER",
          "value": "root"
        },
        {
          "name": "REDIS_HOST",
          "value": "redis://redis"
        },
        {
          "name": "REDIS_PORT",
          "value": "6379"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://redis:6379"
        }
      ],
      "resourceRequirements": null,
      "ulimits": null,
      "dnsServers": null,
      "mountPoints": [],
      "workingDirectory": "/rails-on-ecs",
      "secrets": null,
      "dockerSecurityOptions": null,
      "memory": 512,
      "memoryReservation": null,
      "volumesFrom": [],
      "stopTimeout": null,
      "image": "570604655849.dkr.ecr.ap-southeast-1.amazonaws.com/rails_app",
      "startTimeout": null,
      "firelensConfiguration": null,
      "dependsOn": null,
      "disableNetworking": null,
      "interactive": null,
      "healthCheck": null,
      "essential": true,
      "links": [
        "database",
        "redis"
      ],
      "hostname": null,
      "extraHosts": null,
      "pseudoTerminal": null,
      "user": null,
      "readonlyRootFilesystem": null,
      "dockerLabels": null,
      "systemControls": null,
      "privileged": null,
      "name": "rails"
    },
    {
      "dnsSearchDomains": null,
      "environmentFiles": null,
      "logConfiguration": null,
      "entryPoint": null,
      "portMappings": [
        {
          "hostPort": 3306,
          "protocol": "tcp",
          "containerPort": 3306
        }
      ],
      "command": null,
      "linuxParameters": null,
      "cpu": 0,
      "environment": [
        {
          "name": "MYSQL_ROOT_PASSWORD",
          "value": "password"
        }
      ],
      "resourceRequirements": null,
      "ulimits": null,
      "dnsServers": null,
      "mountPoints": [
        {
          "readOnly": null,
          "containerPath": "/var/lib/mysql",
          "sourceVolume": "db_data"
        }
      ],
      "workingDirectory": null,
      "secrets": null,
      "dockerSecurityOptions": null,
      "memory": 512,
      "memoryReservation": null,
      "volumesFrom": [],
      "stopTimeout": null,
      "image": "570604655849.dkr.ecr.ap-southeast-1.amazonaws.com/mysql_app",
      "startTimeout": null,
      "firelensConfiguration": null,
      "dependsOn": null,
      "disableNetworking": null,
      "interactive": null,
      "healthCheck": null,
      "essential": true,
      "links": null,
      "hostname": null,
      "extraHosts": null,
      "pseudoTerminal": null,
      "user": null,
      "readonlyRootFilesystem": null,
      "dockerLabels": null,
      "systemControls": null,
      "privileged": null,
      "name": "database"
    },
    {
      "dnsSearchDomains": null,
      "environmentFiles": null,
      "logConfiguration": null,
      "entryPoint": null,
      "portMappings": [
        {
          "hostPort": 6379,
          "protocol": "tcp",
          "containerPort": 6379
        }
      ],
      "command": null,
      "linuxParameters": null,
      "cpu": 0,
      "environment": [],
      "resourceRequirements": null,
      "ulimits": null,
      "dnsServers": null,
      "mountPoints": [],
      "workingDirectory": null,
      "secrets": null,
      "dockerSecurityOptions": null,
      "memory": 512,
      "memoryReservation": null,
      "volumesFrom": [],
      "stopTimeout": null,
      "image": "redis:latest",
      "startTimeout": null,
      "firelensConfiguration": null,
      "dependsOn": null,
      "disableNetworking": null,
      "interactive": null,
      "healthCheck": null,
      "essential": true,
      "links": null,
      "hostname": null,
      "extraHosts": null,
      "pseudoTerminal": null,
      "user": null,
      "readonlyRootFilesystem": null,
      "dockerLabels": null,
      "systemControls": null,
      "privileged": null,
      "name": "redis"
    }
  ],
  "placementConstraints": [],
  "memory": "512",
  "taskRoleArn": "arn:aws:iam::570604655849:role/ecsTaskExecutionRole",
  "compatibilities": [
    "EC2"
  ],
  "taskDefinitionArn": "arn:aws:ecs:ap-southeast-1:570604655849:task-definition/rails-compose:18",
  "family": "rails-compose",
  "requiresAttributes": [
    {
      "targetId": null,
      "targetType": null,
      "value": null,
      "name": "com.amazonaws.ecs.capability.ecr-auth"
    },
    {
      "targetId": null,
      "targetType": null,
      "value": null,
      "name": "com.amazonaws.ecs.capability.docker-remote-api.1.17"
    },
    {
      "targetId": null,
      "targetType": null,
      "value": null,
      "name": "com.amazonaws.ecs.capability.task-iam-role"
    },
    {
      "targetId": null,
      "targetType": null,
      "value": null,
      "name": "ecs.capability.execution-role-ecr-pull"
    }
  ],
  "pidMode": null,
  "requiresCompatibilities": [
    "EC2"
  ],
  "networkMode": null,
  "cpu": "512",
  "revision": 18,
  "status": "ACTIVE",
  "inferenceAccelerators": null,
  "proxyConfiguration": null,
  "volumes": [
    {
      "fsxWindowsFileServerVolumeConfiguration": null,
      "efsVolumeConfiguration": null,
      "name": "db_data",
      "host": {
        "sourcePath": "/home/ec2-user/db_data"
      },
      "dockerVolumeConfiguration": null
    }
  ]
}
```

### ECS Service

### ECS Cluster
Cluster là một nhóm các ECS Container Instance. Amazon ECS xử lý logic của việc lập lịch, duy trì và xử lý các yêu cầu mở rộng quy mô cho các instance này. Các task chạy trên ECS luôn nằm trong cluster.

![](https://vticloud.io/wp-content/uploads/2021/02/cluster-amazon-ecs.png)

## AWSCLI
[Tham khảo](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html)

### Config aws cli
```
[root@ip-172-31-25-132 ~]#    aws configure
AWS Access Key ID [None]:     AKIATUX6GD4T
AWS Secret Access Key [None]: 7LbVGuoQzSpsAJ84DSKSInjGs
Default region name [None]:   ap-southeast-1
Default output format [None]: json
```

### Create Docker Repository (ECR)
```
aws ecr create-repository --repository-name hello-world:latest --region ap-southeast-1

# Output
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

### Authenticate to registry
```
aws ecr get-login --no-include-email --region ap-southeast-1

# Hoặc

aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.ap-southeast-1.amazonaws.com
```

### Create docker tag version
```
# Build image trước
docker build -t hello-world:latest .


docker tag [image_name]:tag [repository ULR o ben tren]

docker tag yourname aws_account_id.dkr.ecr.ap-southeast-1.amazonaws.com/hello-world:latest
```

### Push to repository
```
docker push [Repository ULR]
docker push aws_account_id.dkr.ecr.ap-southeast-1.amazonaws.com/hello-world:latest
```

### Pull image
```
docker pull aws_account_id.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

### Delete image
```
aws ecr batch-delete-image --repository-name hello-world --image-ids imageTag=latest
```

### Delete a repository
```
aws ecr delete-repository --repository-name hello-world --force
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

### 4. Tạo Registry ECR(Amazon Elastic Container Registry)
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

### 5.Create Task in AWS/ECS
```
Dashboard -> ECS -> Task definitions -> Create new task definitions
```

**FARGATE**: Không EC2 Instance, giống như serverless

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


## Reference documents

[more-than-hello-world-in-docker-run-rails-sidekiq-web-apps-in-docker](https://dev.to/raphael_jambalos/more-than-hello-world-in-docker-run-rails-sidekiq-web-apps-in-docker-1b37)

[rails-sidekiq-docker-application-for-aws-ecs-ecr-rds-codepipeline](https://salzam.com/rails-sidekiq-docker-application-for-aws-ecs-ecr-rds-codepipeline-and-more-complete-series/)
