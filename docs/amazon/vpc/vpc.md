---
sidebar_position: 1
---

# Concepts VPC

![](https://d2908q01vomqb2.cloudfront.net/cb4e5208b4cd87268b208e49452ed6e89a68e0b8/2017/02/07/vpc-architecture.png)

## Lab1
### Mục tiêu
- **Task 1**: Tạo và hiểu được mục đích của 1 VPC là gì?
- **Task 2**: Tạo và hiểu được mục đích của 1 public subnet là gì?
- **Task 3**: Tạo và hiểu được mục đích của 1 Internet Geteway là gì?
- **Task 4**: Tạo và hiểu được mục đích của 1 Route Table là gì?

### Task 1: Tạo 1 VPC
- Sau khi log in vào console của aws, tìm tới service VPC
- Ở VPC dashboard, click Your VPCs

![](https://images.viblo.asia/retina/8d71dd1e-0f18-4db6-9de6-b92c496ce71c.png)

- Click vào VPC và cấu hình như sau rồi nhấn Create

`Name tag: ThanhCong VPC` => Cái này đơn giản chỉ là tên của VPC mình muốn đặt.

`IPv4 CIDR block: 10.0.0.0/16` => Cái này là dải IP version 4 mà mình chỉ định cho VPC của mình

![](https://images.viblo.asia/retina/29916b19-202d-4408-895e-e729aa7359f4.png)

>  VPC là một phần biệt lập của AWS Cloud, được cư ngụ bởi các objects, chẳng hạn như các instances Amazon EC2. Hay nói đơn giản, VPC như 1 căn nhà riêng, nơi mà người dùng có thể sắp xếp, điều khiển, phân bổ các services của aws, như là EC2 chẳng hạn.


**Như vậy là việc tạo 1 VPC cơ bản là hoàn thành.**

![](https://images.viblo.asia/retina/79b41808-374a-4dd0-a877-2c4f47aed1c2.png)
![](https://images.viblo.asia/retina/6c0357ac-e8d2-41fb-a4d9-ccbdb1465926.png)

### Task 2. Tạo 1 public subnet

- Ở VPC dashboard, chọn vào Subnets -> Click Create Subnet
![](https://images.viblo.asia/retina/713ef062-59ee-4282-9657-8e7cddbbd3c2.png)

- Cấu hình như sau

> Name tag: Public 1
> 
> VPC*: lựa chọn VPC đã create ở Task 1
> 
> Availability Zone: Chọn zone đầu tiên trong list
> 
> IPv4 CIDR block: 10.0.1.0/24 => Chỗ này là dải IP version 4 của subnet

![](https://images.viblo.asia/retina/c659ea04-06d2-4534-8316-0a9ca957acef.png)

- Tạo subnet thành công

![](https://images.viblo.asia/retina/d7d6e5af-da7b-45e1-933f-8fc6984a9825.png)

> Sau khi create subnet thì tiến hành "Enable auto-assign public IPv4 address" cho subnet đó. Việc này có ý nghĩa là sẽ cho phép subnet đó tự động cấp 1 địa chỉ IP cho toàn bộ instance mà khởi tạo trong subnet đó.

* Chọn vào button và click Modify auto-assign IP settings

![](https://images.viblo.asia/retina/ed646638-ba65-4677-befb-7cb7416b7ac1.png)

* Click button Auto-assign IPv4 và nhấn Save

![](https://images.viblo.asia/retina/2b41226f-75b3-44e7-af97-767f608085bc.png)

**Tạo 1 public subnet thứ 2 tương tự như các bước đã tạo public subnet đầu tiên**

![](https://images.viblo.asia/retina/7408360f-4eb2-4880-85a9-e789c4665778.png)

> **=> Có thể hiểu đơn giản, subnet là các căn phòng nhỏ trong ngôi nhà VPC, mỗi subnet sẽ có 1 mục đích sử dụng riêng khác nhau.**

### Task 3. Tạo 1 Internet Gateway
* Tại VPC dashboard, chọn vào Internet Gateways và click Create internet gateway
![](https://images.viblo.asia/retina/605409a2-76d3-4fc4-91f5-f4dc03d912d8.png)
* Đặt name tag cho Internet Gateway rồi click Create
![](https://images.viblo.asia/retina/d8c02d2f-8fc6-4fd6-a6f6-0ea27d2ada06.png)

> Có thể hiểu đơn giản internet gateway như 1 cái cửa để đi ra Internet của căn nhà VPC vậy. Muốn đi ra ngoài thì bắt buộc phải làm cửa thôi 😃

* Create Internet Gateway thành công
![](https://images.viblo.asia/retina/71925669-c534-49f0-bbc6-f900241c248a.png)

* Chọn vào IG đã tạo rồi click Attach to VPC
![](https://images.viblo.asia/retina/7cd04ead-f14c-4133-81b9-4b4c77751807.png)

* Select VPC đã tạo ở task 1 để attach rồi nhấn Attach
![](https://images.viblo.asia/retina/0faf39c9-658e-4c62-a298-3608abceb12b.png)

> Thao tác này giống như gắn cửa Internet Gateway vào căn nhà VPC vậy.


### Task 4. Tạo 1 Route Table

- Ở dashboard VPC, chọn vào Route Tables và click Create route table
![](https://images.viblo.asia/retina/1f7c7bad-beb4-4fb9-98d7-a3ad6a8ffcac.png)

- Đặt name tag và chọn VPC đã tạo ở task 1 rồi click Create
![](https://images.viblo.asia/retina/8b19ca9d-9ff3-486b-bdab-483c050dd4a9.png)

>  Có thể hiểu đơn giản, Route table như là các ống dẫn nước trong nhà, cho phép chủ nhà điều kiển được nước được phép chảy từ phòng (subnet) nào tới phòng nào, hay là chảy ra ngoài (internet).

- Create route table thành công
![](https://images.viblo.asia/retina/1444f470-ebe5-4109-a225-67a32cfa3eea.png)

- Sau khi tạo được Route table thì tiến hành thiết lập route theo ý muốn (giống như tiến hành lắp ráp các ống dẫn nước để điều hướng dòng chảy vậy). Chọn vào tab Routes bên dưới màn hình Route table rồi chọn Edit Route
![](https://images.viblo.asia/retina/7ff599aa-52c3-4bf3-a3f4-af7999d1327c.png)

- Chọn add route với cấu hình rồi click Save routes

> Destination: 0.0.0.0/0 Target: Là cổng IG đã tạo ở task 3

![](https://images.viblo.asia/retina/15b85c58-1dec-46b4-a64e-0ca079f6bde7.png)

- Create route thành công
![](https://images.viblo.asia/retina/ef4709d9-6819-4f6c-aff0-8d82a1815d2a.png)

- Sau khi tạo route thành công thì còn phải tạo Subnet Associations để chỉ định subnet nào apply route đã tạo đó. Chọn tab Subnet Associations rồi click Edit Subnet Associations
![](https://images.viblo.asia/retina/95b703fd-8eef-4316-a50e-1d61d14082d6.png)

- Click chọn 2 public Subnet đã tạo ở task 2 rồi nhấn Save
![](https://images.viblo.asia/retina/2299c7c2-8ec5-4f77-a7a7-23b2fd74a742.png)

> Như vậy, đến đây có thể xem như đã hoàn thành cơ bản 4 mục tiêu đã đề ra ban đầu. Trong phần sau mình sẽ tiếp tục tìm hiểu thêm về private subnet và thực hiện launch 1 web app trên VPC này.

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

### Task 5. Tạo Security Group sử dụng cho Web Server
- Trước hết, đọc qua xem thử cái Security Group (SG) là cái gì.

> Cơ bản thì SG được xem như một "tường lửa ảo" nhằm lọc các truy cập vào các Instance hoặc đi ra từ các Instance. SG sẽ hoạt động dựa vào các rule do admin cài đặt.

- Chọn Security Groups ở thanh điều hướng, click Create security group để bắt đầu tạo SG
![](https://images.viblo.asia/retina/d7534c16-6cbb-4385-b6b3-f777fe59b75a.png)

- Cấu hình thông tin SG như sau. Chú ý lựa chọn VPC là VPC đã tạo ở task 1
![](https://images.viblo.asia/retina/96ce34c9-b55b-42f4-99d4-9aaa6d99c1c8.png)

- Click Create sau đó Close.
![](https://images.viblo.asia/retina/009bd22d-d190-40ee-990a-bd7cff817afd.png)

- Sau đó tiến hành tạo Rule cho SG vừa tạo. Click vào Inbound Rules để tạo rule cho các traffic đi vào. Config như bên dưới nhằm cho phép các traffic từ bên ngoài có thể đi vào SG này qua type HTTP
![](https://images.viblo.asia/retina/254471bb-d22e-4128-930d-ca644fc93f51.png)

- Click Save rule -> Close để kết thúc việc Edit rule cho SG
![](https://images.viblo.asia/retina/12a0f4c8-37bb-42db-bb3e-f21337429a6a.png)

>  Đến đây, task tạo Security Group về cơ bản đã hoàn thành. Mình đã tạo được 1 SG control các traffic từ Internet đi vào các Instance nằm trong SG này. Và thông thường thì Instance nằm trong SG này sẽ là 1 con EC2 chạy WebServer để người dùng có thể truy cập vào từ internet.

### Task 6. Tạo 1 EC2 đóng vai trò là 1 Web Server đặt ở Public Subnet

- Ở task này sẽ thực hiện tạo 1 EC2 đảm nhiệm vai trò là 1 Web Server. Web Server cần được truy cập từ Internet nên sẽ đặt tại Public Subnet
- Chi tiết việc tạo 1 EC2 đã được mình thực hiện ở đây. Tuy nhiên ở task này, mình sẽ sử dụng 1 script có sẵn và được chạy khi EC2 được khởi tạo nhằm cài đặt 1 WebServer lên con EC2 này, đồng thời chạy 1 app có thể được config để trỏ tới mySQL RDS Instance.
- Ở Step 3 khi tạo EC2 thì cấu hình như bên dưới. Chú ý chọn Network là VPC Subnet đã tạo ở Task 1. Subnet là Subnet Public 1.
![](https://images.viblo.asia/retina/bbdd529b-15f5-4505-9582-873530e169cd.png)

- Config SG như bên dưới. Chú ý chọn SG là SG đã create ở task 5. Sau đó click Review and Launch
![](https://images.viblo.asia/retina/2ea69512-e39a-417a-bb41-cbd39bbedfac.png)

- Ở window Select an existing key pair or create a new key pair thực hiện config như bên dưới. Click Launch Instances
![](https://images.viblo.asia/retina/8ebfc18c-9581-4a33-b790-e56abbb93d6e.png)

- Đợi 1 khoảng thời gian sau đó trạng thái của EC2 vừa mới tạo sẽ chuyển sang "running". Lúc này script được past vào ở step trên sẽ thực hiện cài đặt 1 WebServer lên con EC2 này, đồng thời chạy 1 app có thể được config để trỏ tới mySQL RDS Instance.
![](https://images.viblo.asia/retina/fb5736c4-be62-4619-b842-b33bdafd1ba8.png)

- Thử access vào WebServer vừa tạo bằng cách copy và paste IP Pulic con EC2 này vào trình duyệt, kết quả sẽ như bên dưới
![](https://images.viblo.asia/retina/5a5a49ce-91a3-4faf-bf06-fe7fa161694e.png)

> => Đến đây Task 6 đã được hoàn thành. 1 EC2 chạy WebServer đã được đặt trong Public Subnet và nằm trong SG tạo ở task 5.

### Task 7.Tạo Private Subnet sử dụng cho việc thiết lập instance Database

> Để đảm bảo tính bảo mật cao, các ứng dụng thông thường sẽ đặt tầng cơ sở dữ liệu nằm riêng biệt cũng như hạn chế các luồng truy cập vào. Ở task này, mình sẽ thực hiện tạo 1 Private Subnet nằm đặt Instance Database cho ứng dụng. Subnet này sẽ không có quyền đi ra ngoài Internet, cũng như ngược lại, không cho phép các traffic từ ngoài Internet có thể access vào.

- Việc tạo Private Subnet thực tế không khác gì so với việc tạo Public Subnet. Với Private Subnet 1 sẽ được config như bên dưới
![](https://images.viblo.asia/retina/ec1619ac-25ca-4e8a-955b-4b16bda467cf.png)

- Sau đó tiếp tục tạo 1 Private Subnet 2. Chú ý cần phải tạo 1 Private Subnet 2 có Availability Zone để có thể đủ điều kiện tạo Database Subnet Group ở bước sau
![](https://images.viblo.asia/retina/a66801bb-9d40-4597-8684-e41f52a41ac7.png)

- Sau khi tạo xong 2 Private Subnet thì mình có tổng cộng 4 subnet như bên dưới
![](https://images.viblo.asia/retina/e822f66e-74b9-441d-ae63-fb918284fb07.png)

### Task 8.Tạo Security Group sử dụng cho Database Server
- Tương tự như task 5 tạo SG cho WebServer thì task 8 thực hiện tạo 1 SG nhằm sử dụng cho Database Server.

- SG này được config như bên dưới
![](https://images.viblo.asia/retina/2c7d5f29-ec10-4c39-bea9-de0c870c7ffe.png)

- Sau khi create xong Database Security Group thì thực hiện set Rule cho SG này. Click vào Add Rule vào config như bên dưới. Chú ý là SG này sẽ chỉ set Rule cho phép WebServer Security Group được đi vào Database Security Group. Để config được như vậy thì ở phần Source, cần chọn Custom và paste vào Group ID của WebServer Security Group
![](https://images.viblo.asia/retina/1222295c-c56b-4c21-929d-60da2ca0b657.png)

> => Save rules và Close để kết thúc Task 8.
![](https://images.viblo.asia/retina/0aebc668-beb3-4acb-b90d-7027e84be831.png)

### Task 9.Tạo Database Subnet Group
> Trước hết biết được là muốn tạo 1 Instance RDS thì bắt buộc phải có 1 database subnet group. Ngoài ra điều kiện cần để tạo database subnet group là phải có ít nhất 2 Availability Zones khác nhau. (Đã được chuẩn bị ở task 7)

- Click vào Services, click RDS để bắt đầu tạo DB subnet group
![](https://images.viblo.asia/retina/524041c3-7332-4113-b1b1-cd10e380d2e7.png)

- Click Create DB Subnet Group và config như bên dưới. Chú ý lựa chọn VPC là VPC đã create ở task 1
![](https://images.viblo.asia/retina/78d27c22-08f7-420a-b01b-90d30f70a40b.png)

- Thực hiện add 2 Subnet Private đã tạo ở task 7. Click Create
![](https://images.viblo.asia/retina/3965b76c-1336-4b93-9264-ffd7dbfd1a1a.png)

> => Task 9 đến đây đã hoàn thành.

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

> Task 10 đã hoàn thành. Mình đã deploy thành công MySQL database.

### Task 11.Kết nối application ở EC2 tới RDS

- Ở task này sẽ thực hiện connect app nằm ở WebServer (đặt ở Public Subnet) vào MySQL DB được đặt ở Private Subnet.
- Để thực hiện được, cần phải biết được "endpoint" của Instance RDS đã tạo ở Task 10. Để copy endpoint của RDS thì click vào tab Connect&Security. Enpoint sẽ có dạng

![](https://images.viblo.asia/retina/6953c2d8-fe24-4ab4-90e7-c81cb83af279.png)

## Tổng kết
![](https://images.viblo.asia/retina/3fbbfbb8-d2a3-4d78-9f9c-d8cd067167c5.png)


> Sơ đồ này cũng là 1 kiến trúc khá Basic khi tìm hiểu về AWS. Qua bài lab mình cũng đã học thêm được khá nhiều kiến thức mới thú vị vầ có thể áp dụng trong công việc hiện tại.
