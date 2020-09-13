---
id: eks
title: Kubernetes on AWS EKS
sidebar_label: Kubernetes on AWS EKS
---
![](https://codefresh.io/wp-content/uploads/2018/06/Screen-Shot-2018-07-03-at-11.26.41-AM-1024x366.png)

## 1. EKS - Install AWS CLI, kubectl CLI and eksctl CLI
### 1.1 CLI Introduction
```
        ----AWS CLI : we can control multiple AWS services from command line
        -
        -
CLIs  - ----kubectl : we can control Kubernetes cluesters and object using kubectl
        -
        -
        ----eksctl : 1. used for creating & deleting cluseter on AWS EKS
                     2. we can even create, autoscale and delete node groups
                     3. wen can even create fargate profiles using eksctl
```

### 1.2 Install and configure AWS CLI (MAC)
```
# Download Binary
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"

# Install the binary
sudo installer -pkg ./AWSCLIV2.pkg -target /
```

**Configure AWS Command Line using Security Credentials**
```
1. Go to AWS Management Console --> Services --> IAM
2. Select the IAM User: abc_name or Create IAM
```

```
aws configure
AWS Access Key ID [None]:     ACCESS_KEY
AWS Secret Access Key [None]: SECRET_KEY
Default region name [None]:   REGION
Default output format [None]: json
```

### 1.3 Install kubectl CLI
```
# Download the Package
mkdir kubectlbinary
cd kubectlbinary
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.16.8/2020-04-16/bin/darwin/amd64/kubectl

# Provide execute permissions
chmod +x ./kubectl

# Set the Path by copying to user Home Directory
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$PATH:$HOME/bin
echo 'export PATH=$PATH:$HOME/bin' >> ~/.bash_profile

# Verify the kubectl version
kubectl version --short --client
Output: Client Version: v1.16.8-eks-e16311
```

### 1.4 Install eksctl CLI
```
# Install Homebrew on MacOs
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Install the Weaveworks Homebrew tap.
brew tap weaveworks/tap

# Install the Weaveworks Homebrew tap.
brew install weaveworks/tap/eksctl

# Verify eksctl version
eksctl version
```

## 2. EKS - Create Cluster using eksctl
### 2.1 EKS Cluster Introduction

```
            ----- EKS Control Plane
            -
            ----- Worker Nodes & Node Groups
            -
EKS-Cluster -
            -
            ----- Fargate Profiles (Serverless)
            -
            ----- VPC
```

### 2.2 Create EKS Cluster
It will take 15 to 20 minutes to create the Cluster Control Plane

```
# Create Cluster
eksctl create cluster --name=eksdemo1 \
                      --region=us-east-1 \
                      --zones=us-east-1a,us-east-1b \
                      --without-nodegroup

# Get List of clusters
eksctl get clusters
```