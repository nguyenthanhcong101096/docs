---
sidebar_position: 2
---

# Network Address Translation (NAT)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628773215/image-docs/jrFfOpX.png)

**Khi bạn có một server trong private subnet không giao tiếp được với internet (ví dụ DB server) nhưng bạn muốn cập nhật phần mềm cho server đó, đây là lúc bạn sử dụng NAT.**

## Khái niệm
**Internet Gateway**: là một thành phần của VPC, cho phép giao tiếp giữa VPC và Internet. Nói một cách dễ hiểu hơn là một server trong VPC muốn giao tiếp được với Internet thì cần có Internet Gateway.

**Network Address Translation (NAT)**: có nghĩa là “dịch địa chỉ mạng”. Như chúng ta đều biết, để kết nối với Internet thì thiết bị cần có một Public IP, nhưng các thiết bị trong mạng private thì không. Vì vậy, NAT sẽ dịch địa chỉ Private IP sang Public IP để kết nối tới Internet nhưng vẫn đảm bảo tính bảo mật cho thiết bị ở mạng private.

**NAT Gateway**: là một thành phần cho phép server ảo trong mạng private có thể kết nối tới Internet hoặc dịch vụ khác của AWS nhưng lại ngăn không cho Internet kết nối đến server đó.

## Tạo VPC
- IPv4 CIDR block là 10.0.0.0/16 để có thể lấy được nhiều địa chỉ IP,
  - **10.0.0.0**: mình sẽ sử dụng mạng lớp B, tính từ địa chỉ 10.0.0.0 
  - **/16**: tính từ địa chỉ đó, mình muốn lấy 16 bit làm địa chỉ mạng, còn 32 - 16 = 16 bit còn lại làm địa chỉ máy.

- Các thành phần sẽ tạo theo khi tạo **VPC**, 
  - **Route Table**
  - **Network ACL**
  - **Security Group**

[**Create VPC**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateVpc:)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760197/image-docs/Screen_Shot_2021-08-12_at_16.23.00.png)

Như vậy là việc tạo 1 VPC cơ bản là hoàn thành

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760605/image-docs/Screen_Shot_2021-08-12_at_16.29.32.png)

## Subnet
- Mình muốn có 2 subnet, mỗi subnet lấy 24 bit địa chỉ mạng và 8 bit địa chỉ máy:
  - 1 public_subnet có địa chỉ tính từ `00001010.00000000.00000000.00000000` nên CIDR là `10.0.0.0/24`
  - 1 private_subnet có địa chỉ tính từ `00001010.00000000.00000001.00000000` nên CIDR là `10.0.1.0/24`

### Create Public Subnet

![](https://res.cloudinary.com/ttlcong/image/upload/v1628774195/image-docs/wAcaJHx.png)

### Create Private Subnet

![](https://res.cloudinary.com/ttlcong/image/upload/v1628774241/image-docs/EP8IHS5.png)

### Modify auto-assign IP
Đừng quên assign IP

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761373/image-docs/Screen_Shot_2021-08-12_at_16.42.35.png)

### Tổng kết
![](https://res.cloudinary.com/ttlcong/image/upload/v1628777143/image-docs/Screen_Shot_2021-08-12_at_21.05.13.png)


## Internet Gateway
### Create Internet Gateway
[**Create Internet Gateway**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateInternetGateway:)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761577/image-docs/Screen_Shot_2021-08-12_at_16.46.03.png)

### Attach to VPC
Chọn vào IG đã tạo rồi click **Attach to VPC**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761716/image-docs/Screen_Shot_2021-08-12_at_16.48.12.png)

Select **VPC** đã tạo ở task 1 để attach rồi nhấn Attach

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761800/image-docs/Screen_Shot_2021-08-12_at_16.49.46.png)

## NAT gateway
### Cấu hình
  - **Subnet**: chọn một **public subnet** đã tạo. NAT gateway sẽ kết nối tới Internet, vì vậy NAT gateway sẽ ở trong public subnet.
  - **Elastic IP allocation ID**: để NAT gateway có thể kết nối với Internet thì nó cần một Public IP. Do vậy ta cần assign EIP bằng cách chọn “Allocate Elastic IP”

![](https://res.cloudinary.com/ttlcong/image/upload/v1628775678/image-docs/Screen_Shot_2021-08-12_at_20.40.38.png)


## Route Table
Tạo 2 route table
- Public : cho **public subnet** và **internet gateway**
- Private: cho **private subnet** và **nat gateway**

### Public route table

Public route table cho phép các thành phần trong public subnet có thể giao tiếp được với internet

[**Create Route**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateRouteTable:)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628777434/image-docs/Screen_Shot_2021-08-12_at_21.10.05.png)

#### Add Route
```
Destination: 0.0.0.0/0 
Target: Là cổng Internet Gateway cho public subnet
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762632/image-docs/Screen_Shot_2021-08-12_at_17.03.39.png)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762755/image-docs/Screen_Shot_2021-08-12_at_17.05.42.png)

#### Add Subnet Associations 
- Để chỉ định **public subnet** nào apply route đã tạo đó

![](https://res.cloudinary.com/ttlcong/image/upload/v1628762903/image-docs/Screen_Shot_2021-08-12_at_17.08.02.png)

- Gắn **public Subnet** rồi nhấn **Save Associations**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628777679/image-docs/Screen_Shot_2021-08-12_at_21.14.11.png)

### Private route table
![](https://res.cloudinary.com/ttlcong/image/upload/v1628777828/image-docs/Screen_Shot_2021-08-12_at_21.16.17.png)
#### Add Route
```
Destination: 0.0.0.0/0 
Target: Là cổng NAT Gateway cho public subnet
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1628777940/image-docs/Screen_Shot_2021-08-12_at_21.18.12.png)

#### Add Subnet Associations
![](https://res.cloudinary.com/ttlcong/image/upload/v1628778270/image-docs/Screen_Shot_2021-08-12_at_21.23.59.png)

## Check
Thử ssh vào public_instance và ssh vào private_instance: yum update

## 5. Create Network Access Control List for subnet
- [Link](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html#nacl-rules-scenario-2)

## 6. References
- [su-dung-nat-trong-aws](https://blog.daovanhung.com/post/su-dung-nat-trong-aws#2.2.-NAT-Gateway)
- [tao-vpc-va-subnetting-trong-aws](https://blog.daovanhung.com/post/tao-vpc-va-subnetting-trong-aws)
- [internet-gate-way-nat-gateway](https://co-well.vn/nhat-ky-cong-nghe/thanh-phan-mang-co-ban-tren-aws-p2-internet-gate-way-nat-gateway-route-tables/)
