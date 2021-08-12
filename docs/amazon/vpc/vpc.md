---
sidebar_position: 1
---

# Concepts VPC

![](https://res.cloudinary.com/ttlcong/image/upload/v1628759698/image-docs/vpc-architecture.png)

## Lab1
- **Task 1**: Tạo và hiểu được mục đích của 1 VPC là gì?
- **Task 2**: Tạo và hiểu được mục đích của 1 public subnet là gì?
- **Task 3**: Tạo và hiểu được mục đích của 1 Internet Geteway là gì?
- **Task 4**: Tạo và hiểu được mục đích của 1 Route Table là gì?

### Task 1: Tạo 1 VPC
:::tip
VPC là một phần biệt lập của AWS Cloud, được cư ngụ bởi các objects, chẳng hạn như các instances Amazon EC2. Hay nói đơn giản, VPC như 1 căn nhà riêng, nơi mà người dùng có thể sắp xếp, điều khiển, phân bổ các services của aws, như là EC2 chẳng hạn.
:::

[**Create VPC**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateVpc:)

- **IPv4 CIDR block: 10.0.0.0/16** => Cái này là dải IP version 4 mà mình chỉ định cho VPC của mình

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760197/image-docs/Screen_Shot_2021-08-12_at_16.23.00.png)

Như vậy là việc tạo 1 VPC cơ bản là hoàn thành

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760605/image-docs/Screen_Shot_2021-08-12_at_16.29.32.png)

### Task 2. Tạo 1 public subnet
:::tip
Có thể hiểu đơn giản, subnet là các căn phòng nhỏ trong ngôi nhà VPC, mỗi subnet sẽ có 1 mục đích sử dụng riêng khác nhau
:::

[**Create Subnet**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateSubnet:)

- Cấu hình như sau

```
VPC ID: lựa chọn VPC đã create ở Task 1

Availability Zone: Chọn zone đầu tiên trong list

IPv4 CIDR block: 10.0.1.0/24 => Chỗ này là dải IP version 4 của subnet
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1628760935/image-docs/Screen_Shot_2021-08-12_at_16.35.21.png)

:::tip
Sau khi create subnet thì tiến hành "**Enable auto-assign public IPv4 address**" cho subnet đó. Việc này có ý nghĩa là sẽ cho phép subnet đó tự động cấp 1 địa chỉ IP cho toàn bộ instance mà khởi tạo trong subnet đó.
:::

Chọn vào button và click **Modify auto-assign IP settings**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761303/image-docs/Screen_Shot_2021-08-12_at_16.41.27.png)

Click button **Auto-assign IPv4** và nhấn Save

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761373/image-docs/Screen_Shot_2021-08-12_at_16.42.35.png)

**Tạo 1 public subnet thứ 2 tương tự như các bước đã tạo public subnet đầu tiên**

![](https://images.viblo.asia/retina/7408360f-4eb2-4880-85a9-e789c4665778.png)

### Task 3. Tạo 1 Internet Gateway
:::tip
Có thể hiểu đơn giản internet gateway như 1 cái cửa để đi ra Internet của căn nhà VPC vậy. Muốn đi ra ngoài thì bắt buộc phải làm cửa thôi
:::

[**Create Internet Gateway**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateInternetGateway:)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761577/image-docs/Screen_Shot_2021-08-12_at_16.46.03.png)

Chọn vào IG đã tạo rồi click **Attach to VPC**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761716/image-docs/Screen_Shot_2021-08-12_at_16.48.12.png)

Select **VPC** đã tạo ở task 1 để attach rồi nhấn Attach

> Thao tác này giống như gắn cửa Internet Gateway vào căn nhà VPC vậy.

![](https://res.cloudinary.com/ttlcong/image/upload/v1628761800/image-docs/Screen_Shot_2021-08-12_at_16.49.46.png)

### Task 4. Tạo 1 Route Table
:::tip
Có thể hiểu đơn giản, Route table như là các ống dẫn nước trong nhà, cho phép chủ nhà điều kiển được nước được phép chảy từ phòng (subnet) nào tới phòng nào, hay là chảy ra ngoài (internet).
:::

[**Create Route**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateRouteTable:)

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

### Kết luận
> Có thể suy nghĩ VPC như 1 ngôi nhà riêng mà ở đó chủ nhà có toàn quyền để phân chia, sắp xếp các tài nguyên của mình, cũng như cho phép vị khách nào có quyền ghé thăm và sử dụng các tài nguyên đó. Các subnet thì có thể xem như là các căn phòng, được chia ra để phục vụ các mục đích khác nhau. Để căn nhà có thể liên lạc được với thế giới bên ngoài thì cần có cánh cửa Internet Gateway. Route table như là các ống dẫn nước, cho phép chủ nhà điều khiển dòng chảy lưu thông trong nhà, giữa phòng này với phòng khác, hay giữa căn nhà với bên ngoài.


## Lab2 
> Tiếp theo của part 1, bài viết này sẽ tiếp tục thực hiện các phần còn lại của bài lab bên dưới

**Review lại Part 1**
![](https://images.viblo.asia/retina/bc5191a3-c0af-40f1-83be-ec075e817b8a.png)

Trong đó chỉ có 2 Public Subnet Group được route tới Internet Getway và thực tế thì chưa hề có instance nào cả.

### Mục tiêu

- **Task 5:** Tạo Security Group sử dụng cho Web Server
- **Task 6:** Tạo 1 EC2 đóng vai trò là 1 Web Server đặt ở Public Subnet
- **Task 7:** Tạo Private Subnet sử dụng cho việc thiết lập instance Database
- **Task 8:** Tạo Security Group sử dụng cho Database Server
- **Task 9:** Tạo Database Subnet Group
- **Task 10:** Tạo 1 instance AWS RDS
- **Task 11:** Kết nối application ở EC2 tới RDS

### Task 5. Tạo Public Security Group cho EC2
:::tip
Cơ bản thì SG được xem như một "tường lửa ảo" nhằm lọc các truy cập vào các Instance hoặc đi ra từ các Instance. SG sẽ hoạt động dựa vào các rule do admin cài đặt.
:::

[**Create Security Group**](https://ap-southeast-1.console.aws.amazon.com/vpc/home?region=ap-southeast-1#CreateSecurityGroup:)

- Chú ý lựa chọn **VPC** là VPC đã tạo ở task 1

![](https://res.cloudinary.com/ttlcong/image/upload/v1628763299/image-docs/Screen_Shot_2021-08-12_at_17.14.35.png)

- Sau đó tiến hành tạo Rule cho SG vừa tạo. Click vào Inbound Rules để tạo rule cho các traffic đi vào. Config như bên dưới nhằm cho phép các traffic từ bên ngoài có thể đi vào SG này qua type HTTP

![](https://res.cloudinary.com/ttlcong/image/upload/v1628763439/image-docs/254471bb-d22e-4128-930d-ca644fc93f51.png)

>  Đến đây, task tạo Security Group về cơ bản đã hoàn thành. Mình đã tạo được 1 SG control các traffic từ Internet đi vào các Instance nằm trong SG này. Và thông thường thì Instance nằm trong SG này sẽ là 1 con EC2 chạy WebServer để người dùng có thể truy cập vào từ internet.

### Task 6. Tạo EC2 đóng vai trò là Web Server đặt ở Public Subnet

- Web Server cần được truy cập từ Internet nên sẽ đặt tại Public Subnet

- Chú ý chọn Network là **VPC Subnet** đã tạo ở Task 1. Subnet là **public-subnet**

![](https://res.cloudinary.com/ttlcong/image/upload/v1628763591/image-docs/Screen_Shot_2021-08-12_at_17.19.36.png)

- Config SG như bên dưới. Chú ý chọn SG là SG đã create ở task 5. Sau đó click Review and Launch

![](https://res.cloudinary.com/ttlcong/image/upload/v1628764412/image-docs/2ea69512-e39a-417a-bb41-cbd39bbedfac.png)

### Task 7. Tạo Private Subnet sử dụng cho việc thiết lập instance Database

> Để đảm bảo tính bảo mật cao, các ứng dụng thông thường sẽ đặt tầng cơ sở dữ liệu nằm riêng biệt cũng như hạn chế các luồng truy cập vào. Ở task này, mình sẽ thực hiện tạo 1 Private Subnet nằm đặt Instance Database cho ứng dụng. Subnet này sẽ không có quyền đi ra ngoài Internet, cũng như ngược lại, không cho phép các traffic từ ngoài Internet có thể access vào.

- Việc tạo Private Subnet thực tế không khác gì so với việc tạo Public Subnet. Với Private Subnet 1 sẽ được config như bên dưới
![](https://res.cloudinary.com/ttlcong/image/upload/v1628764429/image-docs/ec1619ac-25ca-4e8a-955b-4b16bda467cf.png)

- Sau đó tiếp tục tạo 1 Private Subnet 2. Chú ý cần phải tạo 1 Private Subnet 2 có Availability Zone để có thể đủ điều kiện tạo Database Subnet Group ở bước sau
![](https://res.cloudinary.com/ttlcong/image/upload/v1628764452/image-docs/a66801bb-9d40-4597-8684-e41f52a41ac7.png)

- Sau khi tạo xong 2 Private Subnet thì mình có tổng cộng 4 subnet như bên dưới
![](https://res.cloudinary.com/ttlcong/image/upload/v1628764479/image-docs/e822f66e-74b9-441d-ae63-fb918284fb07.png)

### Task 8.Tạo Security Group sử dụng cho Database Server
- Tương tự như task 5 tạo SG cho WebServer thì task 8 thực hiện tạo 1 SG nhằm sử dụng cho Database Server.

- SG này được config như bên dưới

![](https://res.cloudinary.com/ttlcong/image/upload/v1628764515/image-docs/2c7d5f29-ec10-4c39-bea9-de0c870c7ffe.png)

- Sau khi create xong Database Security Group thì thực hiện set Rule cho SG này. Click vào Add Rule vào config như bên dưới. 

:::tip
Chú ý là **Private SG** này sẽ chỉ set Rule cho phép **Public Security Group (Task 5)** của EC2 được đi vào Database Security Group
:::

![](https://res.cloudinary.com/ttlcong/image/upload/v1628764538/image-docs/1222295c-c56b-4c21-929d-60da2ca0b657.png)

### Task 9. Tạo Database Subnet Group
:::tip
Trước hết biết được là muốn tạo 1 Instance RDS thì bắt buộc phải có 1 **database subnet group**. Ngoài ra điều kiện cần để tạo **database subnet group** là phải có ít nhất **2 Availability Zones** khác nhau. (Đã được chuẩn bị ở task 7)
:::

- Click vào Services, click RDS để bắt đầu tạo DB subnet group

![](https://res.cloudinary.com/ttlcong/image/upload/v1628764568/image-docs/524041c3-7332-4113-b1b1-cd10e380d2e7.png)

- Click Create DB Subnet Group và config như bên dưới. Chú ý lựa chọn VPC là VPC đã create ở task 1

![](https://res.cloudinary.com/ttlcong/image/upload/v1628764592/image-docs/78d27c22-08f7-420a-b01b-90d30f70a40b.png)

- Thực hiện add 2 Subnet Private đã tạo ở task 7. Click Create

![](https://res.cloudinary.com/ttlcong/image/upload/v1628764632/image-docs/3965b76c-1336-4b93-9264-ffd7dbfd1a1a.png)

### Task 10.Tạo 1 instance AWS RDS
- Click vào Databases ở thanh điều hướng, click vào Create databases để bắt đầu tạo RDS Instance

![](https://images.viblo.asia/retina/4abd8a79-3bbb-42ee-be5d-405529a8c4cd.png)

- Config như bên dưới

![](https://images.viblo.asia/retina/bc4747b7-c4ed-462e-bc14-bc40463fba27.png)
![](https://images.viblo.asia/retina/710b8b54-f580-4780-a1db-f086189c1ab2.png)
![](https://images.viblo.asia/retina/39a11dca-d804-4fb9-a173-21eee15bdf55.png)
![](https://images.viblo.asia/retina/2dc8aaf3-2756-40b5-9191-73b266bbef92.png)
![](https://images.viblo.asia/retina/3810187f-0eee-4436-9fa2-eb56cbcdce46.png)
![](https://images.viblo.asia/retina/25132973-db6d-4d15-bda1-04aa108df580.png)
![](https://images.viblo.asia/retina/ea503ec8-07c5-4abd-b798-58b1bf3fe306.png)
![](https://images.viblo.asia/retina/f244c794-b108-46b4-a54a-155142c0a156.png)

- Sau khi Create RDS, đợi 1 lúc status của RDS sẽ chuyển qua available

![](https://images.viblo.asia/retina/41a6d369-8c19-4b51-9d68-f04aedc1e6cb.png)

### Task 11.Kết nối application ở EC2 tới RDS

- Ở task này sẽ thực hiện connect app nằm ở WebServer (đặt ở Public Subnet) vào MySQL DB được đặt ở Private Subnet.
- Để thực hiện được, cần phải biết được "endpoint" của Instance RDS đã tạo ở Task 10. Để copy endpoint của RDS thì click vào tab Connect&Security. Enpoint sẽ có dạng

![](https://images.viblo.asia/retina/6953c2d8-fe24-4ab4-90e7-c81cb83af279.png)

## Tổng kết

![](https://images.viblo.asia/retina/3fbbfbb8-d2a3-4d78-9f9c-d8cd067167c5.png)


> Sơ đồ này cũng là 1 kiến trúc khá Basic khi tìm hiểu về AWS. Qua bài lab mình cũng đã học thêm được khá nhiều kiến thức mới thú vị vầ có thể áp dụng trong công việc hiện tại.
