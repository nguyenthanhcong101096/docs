---
id: rds
title: Amazon Relational Database Service
sidebar_label: Amazon Relational Database Service
---

![](https://hocmangmaytinh.com/wp-content/uploads/2018/01/MigrateMySQLToRDS_1.png)

Amazon RDS (Amazon Relational Database Service)là dịch vụ đám mây do Amazon Web Services phát triển với mục tiêu cung cấp giải pháp cài đặt, vận hành và mở rộng dành cho relational database (cơ sơ dữ liệu có quan hệ).

## Lợi ích khi sử dụng Amazon RDS
### Dễ quản lý
Amazon RDS giúp bạn dễ dàng chuyển từ project conception sang deployment. Sử dụng bảng điều khiển Quản lý AWS, giao diện dòng lệnh AWS RDS hoặc các API calls đơn giản để truy cập vào các tính năng năng của một cơ sở dữ liệu chỉ trong vài phút. Bạn sẽ Không cần cung cấp cơ sở hạ tầng, và không cần cài đặt và bảo trì phần mềm cơ sở dữ liệu.

### Khả năng mở rộng cao
Bạn có thể mở rộng tính toán về thông số và dung lượng lưu trữ nguồn tài nguyên các cơ sở dữ liệu của bạn chỉ với một vài cú click chuột hoặc API calls, hầu như không có vấn đề downtime. Nhiều loại engine của Amazon RDS cho phép bạn khởi chạy một hoặc nhiều Read Replicas để xóa tải lưu lượng truy cập từ cơ sở dữ liệu chính của bạn.

### Tính Có sẵn và Độ bền
Amazon RDS chạy trên cùng một cơ sở hạ tầng đáng tin cậy được sử dụng bởi các dịch vụ Web Amazon khác. Khi bạn cung cấp một Multi-AZ DB Instance, Amazon RDS sẽ đồng bộ sao chép dữ liệu đến một instance dự phòng trong một Availability Zone (AZ) khác. Amazon RDS có nhiều tính năng khác giúp tăng cường độ tin cậy cho các production databases quan trọng, bao gồm tự động sao lưu (automated backups), chụp nhanh cơ sở dữ liệu (database snapshots), và thay thế máy chủ tự động (automatic host replacement).

### Nhanh
Amazon RDS hỗ trợ các ứng dụng cơ sở dữ liệu đòi hỏi khắt khe nhất. Bạn có thể chọn giữa hai tùy chọn lưu trữ SSD:

 - Tối ưu hóa cho các ứng dụng OLTP hiệu năng cao,
 - Cho các mục đích sử dụng chung có hiệu quả về chi phí.
 
Ngoài ra, AWS còn có một dịch vụ khác đó là Amazon Aurora cung cấp hiệu suất ngang bằng các cơ sở dữ liệu thương mại (commercial databases) với chi phí 1/10.

### Bảo mật
Amazon RDS giúp bạn kiểm soát truy cập mạng vào cơ sở dữ liệu của bạn một cách dễ dàng. Amazon RDS cũng cho phép bạn chạy các cơ sở dữ liệu instance của bạn trong Amazon Virtual Private Cloud (Amazon VPC), cho phép bạn cô lập các cơ sở dữ liệu instance của bạn và để kết nối với cơ sở hạ tầng CNTT hiện tại của bạn thông qua một IPsec VPN mã hóa theo tiêu chuẩn ngành. Nhiều loại công cụ RDS của Amazon cung cấp khả năng mã hóa.

### Không tốn kém
Bạn phải trả mức giá rất thấp và chỉ trả các khối lượng dữ liệu mà bạn tiêu dùng trong mỗi tháng. Ngoài ra, bạn được hưởng lợi từ tùy chọn theo giá theo yêu cầu (On-Demand pricing) mà không có cam kết từ trước hoặc dài hạn, hoặc thậm chí giảm giá theo giờ thông qua Reserved Instance pricing.

## Cách tạo Amazon RDS.
Sign in to the AWS Management Console and open the Amazon RDS console at Đăng nhập vào AWS Management Console và đi đến: `https://console.aws.amazon.com/rds/`

Chọn `Get Started Now.`

![](https://images.viblo.asia/retina/15794d51-a41f-4cdb-9091-2ecf8254d69a.png)

Trên màn hình `Specify DB details`

![](https://images.viblo.asia/retina/a5c10041-9a35-4788-82fa-71445882ee7c.png)

- **DB engine version**: Phiên bản Mysql
- **DB instance class**: Cấu hình DB ( Càng nhiều Ram và CPU thì càng nhiều tiền nha )
- **Allocated storage**: Dung lượng lưu trữ DB.

Kéo xuống phần Setting.

- **DB instance identifier**: Đặt tên cho instance
- **Master username**: Username connect DB
- **Master password**: Password connect DB
- **Confirm password**: Nhập lại Password.

Sau khi nhập xong các trường các bạn bấm Next tới màn hình `Configure advanced settings.`

`Network & Security`, các bạn nhập theo hình dưới

![](https://images.viblo.asia/retina/c543af5b-1c7c-4856-8a42-deacbf1c0c15.png)

Các tab bên dưới các bạn cứ để Default và chọn Launch DB instance. Ok vậy xong. Chọn View DB instance để xem thông tin về DB instance mới vừa tạo.

```
Host: database_name.czxttlhvzfmq.us-west-2.rds.amazonaws.com

Port: 3306
```

Các bạn kéo xuống Tab Detail và chú ý vào phần Network & Security -> Security Group: Đây là nơi bạn setting cho những IP nào có thể connect tới DB instance.

## Tích hợp RDS vào ElasticBeantalk
Ở thư mục dự án bạn Edit file database.yml

```
production:
  <<: *default
  timeout: 5000
  hostname: YOUR_DB_NAME.czxttlhvzfmq.us-west-2.rds.amazonaws.com
  database: YOUR_DB_NAME
  username: YOUR_USER_NAME
  password: YOUR_PASSWORD
```

Đi đến: `https://console.aws.amazon.com/ec2/` . Chọn Running Instance -> chọn instance đang chạy cho ElasticBeantalk. Kéo xuông dưới bạn sẽ thấy IPv4 Public IP trong tab Description và copy nó. ví dụ: 34.212.82.34

![](https://images.viblo.asia/retina/591b1046-1813-4962-ad85-2cbbf7a4b08b.png)

Quay trở lại RDS. bạn bấm vào Security Groups ở phần Detail.

![](https://images.viblo.asia/retina/cbccbc30-52f0-48ec-816d-b7177c71ff0c.png)

Bạn chuyển sang `tab Inbound`

![](https://images.viblo.asia/retina/f519a1f8-2c91-4846-9890-785fc6a2b726.png)

chọn Edit và Add Rule:

![](https://images.viblo.asia/retina/5dab7698-d0ee-4956-b49c-95435c064b80.png)

[nguồn](https://viblo.asia/p/series-aws-productrds-rds-la-gi-va-tich-hop-rds-vao-elasticbeantalk-gAm5yRROKdb)