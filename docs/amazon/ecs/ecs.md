---
sidebar_position: 2
---

# ECS Cluster with ELB

![](https://res.cloudinary.com/ttlcong/image/upload/v1628950445/image-docs/nlbECS_1.png)

## 1. Virtual Private Cloud
### Create VPC
- **IPv4 CIDR block: 10.0.0.0/16** => Cái này là dải IP version 4 mà mình chỉ định cho VPC của mình

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760197/image-docs/Screen_Shot_2021-08-12_at_16.23.00.png)

---

### Create Subnet public

#### Public Subnet 1

```
VPC ID: lựa chọn VPC đã create ở Task 1

Availability Zone: ap-southeast-1a

IPv4 CIDR block: 10.0.1.0/24 => Chỗ này là dải IP version 4 của subnet
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760935/image-docs/Screen_Shot_2021-08-12_at_16.35.21.png)

Chọn vào button và click **Modify auto-assign IP settings**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761303/image-docs/Screen_Shot_2021-08-12_at_16.41.27.png)

Click button **Auto-assign IPv4** và nhấn Save

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761373/image-docs/Screen_Shot_2021-08-12_at_16.42.35.png)

---
#### Public Subnet 2

```
VPC ID: lựa chọn VPC đã create ở Task 1

Availability Zone: ap-southeast-1b

IPv4 CIDR block: 10.0.2.0/24 => Chỗ này là dải IP version 4 của subnet
```

Tương tự tạo public subnet 1

---

### Create Internet Gateway

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761577/image-docs/Screen_Shot_2021-08-12_at_16.46.03.png)

Chọn vào IG đã tạo rồi click **Attach to VPC**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761716/image-docs/Screen_Shot_2021-08-12_at_16.48.12.png)

Select **VPC** đã tạo ở task 1 để attach rồi nhấn Attach

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761800/image-docs/Screen_Shot_2021-08-12_at_16.49.46.png)

---

### Create Route Table
![](https://res.cloudinary.com/ttlcong/image/upload/v1628762412/image-docs/Screen_Shot_2021-08-12_at_16.59.57.png)

**Tab Route**

- Sau khi tạo được Route table thì tiến hành thiết lập route theo ý muốn (giống như tiến hành lắp ráp các ống dẫn nước để điều hướng dòng chảy vậy). 

- Chọn vào tab Routes bên dưới màn hình Route table rồi chọn **Edit Route**

- Chọn **add route** với cấu hình rồi click Save routes

```
Destination: 0.0.0.0/0 
Target: Là cổng IG đã tạo ở task 3
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762632/image-docs/Screen_Shot_2021-08-12_at_17.03.39.png)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762755/image-docs/Screen_Shot_2021-08-12_at_17.05.42.png)

**Tab Subnet Associations**
- Sau khi tạo route thành công thì còn phải tạo Subnet Associations để chỉ định subnet nào apply route đã tạo đó. Chọn tab Subnet Associations rồi click Edit Subnet Associations

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762903/image-docs/Screen_Shot_2021-08-12_at_17.08.02.png)

- Click chọn **public Subnet** đã tạo ở task 2 rồi nhấn **Save Associations**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762980/image-docs/Screen_Shot_2021-08-12_at_17.09.12.png)

---

## 2. IAM Role
### Role EC2 Instances
Tạo Role **ecsInstanceRole**

- Chọn **Role** -> **Create Role**
- Cấu hình
  - **AWS service**
  - **Elastic Container Service**
  - **EC2 Role for Elastic Container Service**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628955009/image-docs/Screen_Shot_2021-08-14_at_22.29.53.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1628954935/image-docs/Screen_Shot_2021-08-14_at_22.28.44.png)
### Role ECS Cluster
Tạo Role **ecsRole**

- Chọn **Role** -> **Create Role**
- Cấu hình
  - **AWS service**
  - **Elastic Container Service**
  - **Elastic Container Service**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628957044/image-docs/Screen_Shot_2021-08-14_at_23.03.56.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1628956980/image-docs/Screen_Shot_2021-08-14_at_23.02.50.png)

## 3. ECS Cluster
![](https://res.cloudinary.com/ttlcong/image/upload/v1628957205/image-docs/Screen_Shot_2021-08-14_at_23.06.30.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1628958671/image-docs/Screen_Shot_2021-08-14_at_23.30.57.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1628958735/image-docs/Screen_Shot_2021-08-14_at_23.32.00.png)

## 4. ECS Instance
- Tạo 2 instance_ami: **ami-01eadf33e58113fa2**
- Cấu hình
  - vpc: tạo ở bước 1
  - subnet: tạo ở bước 1
  - IAM Role: tao ở bước 2

![](https://res.cloudinary.com/ttlcong/image/upload/v1628956072/image-docs/Screen_Shot_2021-08-14_at_22.41.36.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1628956332/image-docs/Screen_Shot_2021-08-14_at_22.51.32.png)

- Sau khi tạo xong ssh vào instance check **docker ps**

## 5. LoadBalancer
