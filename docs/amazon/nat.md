---
sidebar_position: 8
---

# NAT - Network Address Translation
- **Đặt vấn đề**: Khi bạn có một server trong private subnet không giao tiếp được với internet (ví dụ DB server) nhưng bạn muốn cập nhật phần mềm cho server đó, đây là lúc bạn sử dụng NAT.

> NAT viết tắt cho Network Address Translation là phương pháp thay đổi địa chỉ IP của các tài nguyên private. Khi các tài nguyên private request ra internet, NAT sẽ đổi IP các tài nguyên này thành IP của mình rồi đưa request ra internet, sau khi nhận response trở về từ ngoài internet, NAT sẽ lấy lại IP các tài nguyên nguồn và đưa response vào đó. 

![](https://i.imgur.com/jrFfOpX.png)

## Create VPC
Lúc tạo VPC, mình chọn IPv4 CIDR block là 10.0.0.0/16 để có thể lấy được nhiều địa chỉ IP,

- **10.0.0.0**: mình sẽ sử dụng mạng lớp B, tính từ địa chỉ 10.0.0.0 
- **/16**: tính từ địa chỉ đó, mình muốn lấy 16 bit làm địa chỉ mạng, còn 32 - 16 = 16 bit còn lại làm địa chỉ máy.

![](https://i.imgur.com/YUuqYuL.png)

> Chú ý một điều là khi tạo một VPC, mặc định các thành phần Route Table, Network ACL và Security Group sẽ được tạo theo

## 1. Create subnet trong VPC
Mình muốn có 2 subnet, mỗi subnet lấy 24 bit địa chỉ mạng và 8 bit địa chỉ máy:

- 1 public_subnet có địa chỉ tính từ `00001010.00000000.00000000.00000000` nên CIDR là `10.0.0.0/24`
- 1 private_subnet có địa chỉ tính từ `00001010.00000000.00000001.00000000` nên CIDR là `10.0.1.0/24`

**public_subnet**

![](https://i.imgur.com/wAcaJHx.png)

**private_subnet**

![](https://i.imgur.com/EP8IHS5.png)


![](https://i.imgur.com/DaWgMYz.png)

> Warning: Tự động đánh IP để internet (`Action` -> `Modify` -> `Auto-assign public IPv4 address`)


- Thông thường với 8 bit đánh địa chỉ máy, ta có `2^8 - 2 = 256 - 2` máy nhưng ngoài 2 IP địa chỉ subnet và địa chỉ broadcast ra, aws còn sử dụng thêm 3 IP nữa nên số IP địa chỉ máy chúng ta có thể có = `256 - 5 = 251` IP như hình trên. Ví dụ với `CIDR 10.0.1.0/24` thì 5 địa chỉ IP mà aws sử dụng là

  - `10.0.1.0`: Network address, là địa chỉ subnet.
  - `10.0.1.1`: Sử dụng cho VPC router.
  - `10.0.1.2`: Sử dụng cho DNS trong VPC.
  - `10.0.1.3`: AWS lưu trữ để phòng trường hợp sử dụng trong tương lai.
  - `10.0.1.255`: Địa chỉ broadcast.

## 2. Create internet gateway cho VPC
Khi tạo Internet Gateway (ký hiệu IGW), IGW này sẽ có trạng thái là Detached tức là chưa gắn vào VPC nào:

![](https://i.imgur.com/HblPxVS.png)

> Chú ý là một VPC chỉ có thể gắn một Internet Gateway

## 3. Create Route Table public subnet & private public
Ta có 2 `route table`: `private_route` và `public_route`

- Khi tạo VPC, default `Route Table` sẽ được tạo theo, ta muốn `default Route Table` này sẽ là gọi là `private_route`
- Ta cần tạo một public Route Table mới để có thể tuỳ chọn lúc cần `public` các tài nguyên ra internet sẽ gọi là `public_route`

Bạn để ý Main Route Table của chúng ta đang là private, điều này tránh cho những vấn đề bảo mật khi ai đó tạo resource trên aws và để subnet mặc định.

![](https://i.imgur.com/guzhcR1.png)

Ta tạo `Subnet Associations` cho public subnet tới route table `public_route`

![](https://i.imgur.com/eQ5VVjM.png)

Bạn cần thêm route record như sau để Route Table có thể điều hướng traffic từ mọi IP trên internet có thể đi tới Internet Gateway VPC của bạn

![](https://i.imgur.com/sKT5L0e.png)

## 4. Create nat gateway cho VPC
Bạn cũng phải tạo `NAT Gateway` trong public subnet(`step 1: public_subnet`)

![](https://i.imgur.com/0pEdERD.png)

- Click `Allocate Elesticc IP`

- Ta cũng phải thêm `record` vào `Route Table` của `private_route`(step 3)

![](https://i.imgur.com/cgAe0vu.png)

> Thử ssh vào public_instance và ssh vào private_instance: yum update

## 5. Create Network Access Control List for subnet
- [Link](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html#nacl-rules-scenario-2)

## 6. References
- [su-dung-nat-trong-aws](https://blog.daovanhung.com/post/su-dung-nat-trong-aws#2.2.-NAT-Gateway)
- [tao-vpc-va-subnetting-trong-aws](https://blog.daovanhung.com/post/tao-vpc-va-subnetting-trong-aws)
