---
id: eks
title: Amazon EKS
sidebar_label: Amazon EKS
---

## Before you start

> You will need to make sure you have the following components installed and set up before you start with Amazon EKS:

### Install AWS CLI
```
# on Unbuntu
curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip
unzip awscliv2.zip
sudo ./aws/install

# on Mac
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg" sudo installer -pkg AWSCLIV2.pkg -target /
```

**Configure your AWS CLI credentials**

```
aws configure
```

### Install kubectl
Kubernetes uses the kubectl command-line utility for communicating with the cluster API server

```
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.18.8/2020-09-18/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin
```

### Install eksctl
```
# on Ubuntu
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
mv /tmp/eksctl /usr/local/bin


# on Mac
brew install weaveworks/tap/eksctl
```

## Create EKS Cluster
EKS Price
> you may be charged by following this. The most you should be charged should only be a few dollars, but we're not responsible for any incurred charges.

Amazon Web Services provides three main options for deploying Kubernetes:

- Option 1: Fargate - Linux
- Option 2: Managed Node - Linux
- Option 3: Self-Managed Node - Windows

### Create SSH key
> We will first have to create an SSH key to be able to access the EC2 Node in the Cluster when needed (This is also the best practice that Google recommends)

```
aws ec2 create-key-pair --key-name k8s-demo --query 'KeyMaterial' --output text> k8s-demo.pem

chmod 400 k8s-demo.pem
```

### Create EKS Cluster
```
eksctl create cluster --name k8s-demo --region ap-northwest-1 --nodegroup-name k8s-demo --nodes 2 --node-type t2.micro --ssh-access --ssh-public-key k8s-demo --managed
```

> AWS CloudFormation để tạo các infrastructure cần thiết và setup Master Node (Control Plane). Khi Master Node đã đi vào hoạt động, thì eksctl sẽ tiếp tục tạo một Node Group để chạy các EC2 Instance. Sau đó các EC2 Instance này sẽ được config và tự động tham gia vào cluster.

> Mặc định: eksctl sẽ tạo 2 Worker Node m5.large để tạo EKS Cluster (m5.large khá rẻ và phổ biến)

### Deploy App to EKS Cluster
- [Document k8s](https://github.com/nguyenthanhcong101096/docs/blob/master/docs/kubernetes.md)
- [Prepare manifest](https://github.com/nguyenthanhcong101096/learn_kubernetes/tree/master/manifest)

### Auto deploy via gitlab-ci

create file `.gitlab-ci.yml`

```yml
variables:
  REPOSITORY_URL: aws_account_id.dkr.ecr.region.amazonaws.com/demo-app
  REGION: region
services:
- docker:dind
stages:
  - build
  - deploy
build:
  stage: build
  script:
    - apk add --no-cache curl jq python3 py3-pip
    - pip install awscli
    - aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 230470490156.dkr.ecr.ap-southeast-1.amazonaws.com
    - docker build -t demo-app -f ./Dockerfile .
    - docker tag demo-app $REPOSITORY_URL.${CI_BUILD_REF}
    - docker push $REPOSITORY_URL.${CI_BUILD_REF}
deploy:
  stage: deploy
  script:
    - kubectl set image deployment/server-demo demo-app=$REPOSITORY_URL --record
  only:
    - master
```

### Clear All Resources

```
# Please remember to delete all the AWS resources you used to avoid fees
eksctl delete cluster --region=ap-northeast-1 --name=k8s-demo

# delete EC2 KeyPair
aws ec2 delete-key-pair --key-name k8s-demo
```