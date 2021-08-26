---
sidebar_position: 2
---

# Elastic Kubernetes Service
## Kiến Trúc

![](https://res.cloudinary.com/ttlcong/image/upload/v1629952825/image-docs/bwsdh1un84ymfsan4igv.jpg)

- VPC sẽ có 8 subnet
  - 2 public subnet và 2 private subnet Amazon EKS.
  - 2 public subnet và 2 private subnet Amazon RDS.
- Internet Gateway gắn với VPC.
- NAT Gateway được gắn với public subnet EKS, nhưng không gắn trên public subnet RDS vì Amazon RDS không cần truy cập public internet.
- PostgreSQL RDS nhiều AZ.

## AWS VPC

![](https://res.cloudinary.com/ttlcong/image/upload/v1629957383/image-docs/haaklaqq5hkfxox1wtyj.jpg)

### Tạo VPC

![](https://res.cloudinary.com/ttlcong/image/upload/v1629957504/image-docs/Screen_Shot_2021-08-26_at_12.58.11.png)

### Tạo Subnets

- Two public subnets for high-availability. They will host our External Application Load Balancers created by Amazon EKS and all internet facing Kubernetes workloads.
- Two private subnets for high-availability. They will host our Internal Application Load Balancers created by Amazon EKS and all internal Kubernetes workloads.
- (Optional) Two other public subnets for high-availability. They will host our External Network Load Balancers to expose our private RDS PostgreSQL instance.
- Two other private subnets for high-availability. They will host our Amazon RDS PostgreSQL instance.

#### Private subnet

- Auto-assign IPv4: **false**
- IPv4 CIDR block
  - **private-eks-1**: 10.0.1.0/24 ap-southeast-1a
  - **private-eks-2**: 10.0.2.0/24 ap-southeast-1b
  - **private-rds-1**: 10.0.3.0/24 ap-southeast-1a
  - **private-rds-2**: 10.0.4.0/24 ap-southeast-1b

![](https://res.cloudinary.com/ttlcong/image/upload/v1629957791/image-docs/Screen_Shot_2021-08-26_at_13.03.00.png)

- 3 private subnet tương tự ở trên

#### Public subnet

- Auto-assign IPv4: **true**
- IPv4 CIDR block
  - **public-eks-1**: 10.0.5.0/24 ap-southeast-1a
  - **public-eks-2**: 10.0.6.0/24 ap-southeast-1b
  - **public-rds-1**: 10.0.7.0/24 ap-southeast-1a
  - **public-rds-2**: 10.0.8.0/24 ap-southeast-1b

![](https://res.cloudinary.com/ttlcong/image/upload/v1629957999/image-docs/Screen_Shot_2021-08-26_at_13.06.29.png)

- 3 public subnet tương tự ở trên

### Internet Gateway
Để cho phép các **public subnets** ta giao tiếp với internet, chúng ta cần tạo 1 **internet gateway** và liên kết nó với các **public subnets** bằng cách sử dụng **route table**

- Tạo Internet Gateway

![](https://res.cloudinary.com/ttlcong/image/upload/v1629959088/image-docs/Screen_Shot_2021-08-26_at_13.24.32.png)

- Attack tới [VPC](/docs/amazon/eks/eks#tạo-vpc)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629959146/image-docs/Screen_Shot_2021-08-26_at_13.25.36.png)

### Public Route Table (IGW)

- Tạo route table

![](https://res.cloudinary.com/ttlcong/image/upload/v1629959318/image-docs/Screen_Shot_2021-08-26_at_13.28.28.png)

- Add route
  - Destination: **0.0.0.0/0** 
  - Target: [**igw**](/docs/amazon/eks/eks#internet-gateway)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629959520/image-docs/Screen_Shot_2021-08-26_at_13.31.51.png)

- Add subnet associations
  - public-subnet-eks-1
  - public-subnet-eks-2
  - public-subnet-rds-1
  - public-subnet-rds-2

![](https://res.cloudinary.com/ttlcong/image/upload/v1629959621/image-docs/Screen_Shot_2021-08-26_at_13.33.31.png)

### NAT Gateway
Để cho phép private subnets được Amazon EKS sử dụng truy cập internet, chúng ta cần tạo NAT Gateway trên các public subnets được Amazon EKS sử dụng. Chúng tôi liên kết NAT Gateways với private subnets bằng cách sử dụng route table

- Public subnets eks
  - public-subnet-eks-1
  - public-subnet-eks-2

**Tạo NAT Gateway**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629960161/image-docs/Screen_Shot_2021-08-26_at_13.42.13.png)

### Private Route Table (NAT GW)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629960380/image-docs/Screen_Shot_2021-08-26_at_13.46.08.png)

- Add route
  - Destination: **0.0.0.0/0** 
  - Target: [**nat-gw**](/docs/amazon/eks/eks#nat-gateway)

![](https://res.cloudinary.com/ttlcong/image/upload/v1629960447/image-docs/Screen_Shot_2021-08-26_at_13.47.17.png)

- Add subnet associations
  - private-subnet-eks-1
  - private-subnet-eks-2

![](https://res.cloudinary.com/ttlcong/image/upload/v1629960740/image-docs/Screen_Shot_2021-08-26_at_13.52.11.png)

## Amazon EKS cluster

![](https://res.cloudinary.com/ttlcong/image/upload/v1629960977/image-docs/gsqa3fwwq1my7ijdzk0y.jpg)

### IAM role cluster
### IAM role node groups
