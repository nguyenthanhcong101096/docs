---
id: elb
title: Application Load Balancer
sidebar_label: [ELB] Application Load Balancer
---

![](https://camo.githubusercontent.com/37f3107da43842cccc58c480c6386ceb7f24052e/68747470733a2f2f73332d61702d736f757468656173742d312e616d617a6f6e6177732e636f6d2f6b6970616c6f672e636f6d2f6a71616e6e7872686e665f6c6f61642d62616c616e63696e672d747261666669632e676966)

Ưu điểm:
- Tránh bị sập server, khi 1 2 server trong hệ thống bị sập, Load Balancer sẽ check được server còn đang khỏe mạnh để điều hướng.
- Dễ dàng mở rộng hệ thống, chịu lượng request lớn.
- Giải quyết được vấn đề không thể nâng cấp phần cứng nữa.
- Lọc request trước khi đưa tơi các server xử lý.

Nhược điểm:
- Giảm performance response trả về cho user vì phải đi qua trung gian là Load Balancer (để giảm thiểu ảnh hưởng này, người thiết kế thường đặt Load Balancer rất gần với các server, kết nối mạng trực tiếp với nhau).
- Chia sẻ tài nguyên giữa các server sẽ có chút khó khăn (vd: file, cache, database, …) (người dùng cần tách các tài nguyện dùng chung thành các microservice riêng).
- Load Balancer mà chết (hoặc nghẽn mạng) thì hệ thống cũng sẽ sập.

## Mô hình Lab – AWS ALB web public
> AWS Application Load Balancer chỉ hoạt động ở lớp 7 tầng ứng dụng nhé, cụ thể là chỉ hỗ trợ giao thức HTTP/HTTPS .

- Bạn sẽ cần chuẩn bị sẵn một số thông tin dịch vụ như sau :

	1. 2 EC2 Instance cài sẵn dịch vụ web server cơ bản.
	2. 1 VPC / 2 Subnet / Internet Gateway + Route Table để EC2 Instance đi public được. Hoặc bạn để máy chủ EC2 Instance trong private subnet cũng được, mình để public để sẵn nhảy vào cấu hình 2 con EC2 Instance web server cho tiện. Thực tế thì kiến trúc chạy sẽ để backend trong private subnet.

> Bài lab này sẽ không đi chi tiết cách tạo dịch vụ EC2 Instance hay các thành phần VPC Networking. Với bài lab này bạn sẽ public Load Balancer ra ngoài Internet Public, để client kết nối từ Internet Public và website của bạn.

![](https://cuongquach.com/resources/images/2019/04/lab-public-aws-alb.png)

## Một số thuật ngữ bạn cần nắm
- **AWS Application Load Balancer = AWS ALB:** dịch vụ Cân bằng tải ứng dụng của AWS.
- **Load Balancer:** là một thiết bị hoặc dịch vụ có nhiệm vụ phân phối cân bằng tải lưu lượng xuống các máy chủ backend.
- **Listener:** port dịch vụ được khai báo cho Load Balancer lắng nghe.
- **Target Group:** một logical group nhằm quản lý thông tin các máy chủ backend sẽ nhận xử lý request từ Load Balancer gửi xuống.

### EC2 Instance
Hai máy chủ web EC2 Instance được khởi động cho bài lab.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-5.png)

### Security Group
2 máy chủ Instance này có rule truy cập port 80 HTTP vào 2 EC2 Instance web.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-5-5.png)

Trên **2 EC2 Instance** Web này , mình cài dịch vụ **Nginx Web Server** đơn giản và tạo nội dung html tĩnh để kiểm tra đơn giản luôn.

### Thông tin VPC
- Hai subnet public ở hai AZ khác nhau.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-1.png)

### Thông tin Internet Gateway đã attach vào VPC.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-2.png)

### Route Table đã được cấu hình default route về Internet Gateway để các EC2 Instance có thể đi Internet Public.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-3.png)

### Route Table này được liên kết với 2 subnet public
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-6.png)

> Ok vậy là thông tin cơ bản cần thiết cho bài lab đã chuẩn bị như trên. Giờ chúng ta bắt đầu với các bước cấu hình AWS Application Load Balancer public cơ bản cho 2 máy chủ EC2 instance web1 và web2 nhé.

## Tạo Security Group cho AWS ALB
- Bạn cần tạo một Security Group để đảm bảo Load Balancer thảo mãn 2 điều kiện cơ bản :
- Nếu là ALB Public hứng chịu các connection kết nối từ Internet Public từ chiều incomming thì phải allow port 80 từ source địa chỉ ip bất kì, đến port listener của bạn.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-6-5.png)

### Tạo AWS Application Load Balancer
#### Bước 1: bắt đầu tạo AWS Application Load Balancer
Bạn chọn phần “Load Balancing” ở pannel trái và chọn “Create Load Balancer” để bắt đầu quá trình lựa chọn khởi tạo dịch vụ Cân Bằng Tải của AWS.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-7-1.png)

Lựa chọn “Application Load Balancer” – Cân Bằng Tải Ứng Dụng, hỗ trợ mỗi giao thức HTTP/HTTPS theo như nội dung bài viết của chúng ta.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-8.png)

**Ở phần này bạn sẽ cần lưu ý một số thông tin cấu hình như sau :**

- **Name:** tên của dịch vụ AWS ALB mới của bạn. Ví dụ: ALB này mình dùng cho 2 con web app EC2 Instance, mình đặt tên là ‘cuongqc-alb-web‘.
- **Scheme:** chọn **“Internet-facing”** , là dạng endpoint tên miền DNS Domain Name public phân giải được theo cấu trúc AWS quy định, từ DNS Domain Nam này sẽ phân giải ra danh sách IP Public ALB. Tức chúng ta sẽ phải truy cập dịch vụ Application Load Balancer thông qua tên miền do AWS ALB cung cấp. Lát nữa ta sẽ đề cập lại vấn đề này ở phần cuối kĩ hơn.
- **IP address type :** ipv4
- **Listener :** nếu bạn muốn AWS ALB lắng nghe kết nối trên port 80 HTTP hay 443 HTTPS thì cấu hình ở phần này. Có thể chỉ định port khác nếu bạn dùng cho dịch vụ khác.
- **VPC :** chọn VPC mà các ứng dụng backend của bạn nằm trong mạng VPC đó.
Availability Zone: chọn các vùng AZ mà EC2 Instance hay dịch vụ của bạn nằm trên đó. AWS ALB sẽ được chỉ định khu vực cân bằng tải xuống các Subnet AZ này.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-9.png)

#### Bước 2: cấu hình tinh chỉnh bảo mật
Phần này liên quan đến port listener là 443 HTTPS. Kết hợp với chứng chỉ số Certificate SSL cấu hình cho HTTPS. Nếu bạn sử dụng HTTPS thì ở đây sẽ hướng dẫn bạn cụ thể, còn nếu chỉ xài mỗi port 80 HTTP như mình đang làm lab demo thì có thể bypass bước này.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-10.png)

#### Bước 3: Chọn Security Group mà bạn đã tạo cho AWS ALB
Security Group ở phần đầu mình đặt tên là ‘aws-alb-cuongquach-web-public‘. Như vậy trước khi các lưu lượng traffic vào tới AWS ALB sẽ phải qua lớp firewall Security Group trước.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-11.png)

#### Bước 4: cấu hình định tuyến cho request từ Load Balancer
![](https://cuongquach.com/resources/images/2019/04/aws-alb-target-group.png)

> Ở phần này bạn sẽ phải cấu hình cách thức định tuyến cho các request đến Load Balancer biết đường đi đến các dịch vụ backend của bạn như thế nào. Đầu tiên chúng ta sẽ phải khai báo một ‘Target group‘ như một logical group chứa thông tin các máy chủ backend sẽ tiếp nhận xử lý request. Các thông tin cấu hình cần lưu ý như sau :

- **Target Group:** New target group , tạo mới một target group.
- **Name:** đặt tên Target Group của bạn. Ví dụ : web-app-tg
- **Target type:** lựa chọn hình thức quản lý thông tin backend xử lý request qua thông tin EC2 Instance (instance) hay qua thông tin địa chỉ IP trong Subnet/VPC , còn lại thì qua Lambda nâng cao.
- **Protocol:** HTTP
- **Port:** đây là port đích trên các máy chủ backend sẽ nhận xử lý request từ ALB gửi xuống.
- **Health checks:** nếu bạn có quy định đặc biết về phương thử kiểm tra dịch vụ web sống chết thì cấu hình ở đây. Mặc định AWS ALB sẽ gửi request “/” đến dịch vụ web của bạn, nếu response là 200 status code thì xác định là backend sống.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-12.png)

#### Bước 5: bạn cần khai báo đăng ký các máy chủ backend sẽ xử lý request web vào trong Target Group vừa tạo/khai báo ở bước 4.

Như trong hình dưới, thì mình sẽ chọn 2 web EC2 Instance nằm trong VPC mà ALB tham gia để đăng ký cho Target Group ‘web-app-tg‘.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-13.png)


#### Bước 6: bạn sẽ xem lại thông tin tổng kết về máy chủ AWS Cân Bằng Tải Ứng Dụng (Application Load Balancer) chuẩn bị tạo.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-14.png)

Bạn đợi AWS tiến hành khởi tạo Application Load Balancer , hoàn tất thì sẽ như dưới.
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-15.png)

### Kiểm tra AWS Application Load Balancer
Sau khi đã tạo ra thành công AWS ALB thì chúng ta mong muốn kiểm tra hoạt động cân bằng tải xuống 2 web EC2 Instance ok hay chưa đúng không nào ?! Giờ chúng ta sẽ cần thông tin endpoint của AWS ALB.

Do chúng ta lựa chọn hình thức ‘public-facing‘, AWS ALB chỉ cung cấp thông tin endpoint ‘public-facing‘ ALB dưới dạng tên miền domain cú pháp của AWS để phân giải ra được địa chỉ IP Public của AWS chỉ định.

- Ví dụ : dns domain của AWS ALB Load Balancer mình vừa tạo
![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-16.png)

### Tại sao AWS chỉ cung cấp tên miền ALB cho người dùng ?
Đơn giản dễ hiểu thì với quản trị viên thì tính chất Hight Availability và Fail-over là vô cùng quan trọng cho mọi hệ thống dịch vụ kể cả cân bằng tải. Như vậy với AWS ALB cũng không khác gì, vì giả định đôi khi hệ thống Load Balancer của AWS ALB có vấn đề thì AWS sẽ tự động thực hiện các hành động như sau :

- Tự động scale thêm một Load Balancer cho người dùng nếu Load Balancer hiện tại không chịu nổi số lượng request cao, tức là khi phân giải tên miền DNS Load Balancer sẽ ra thêm 1 địa chỉ IP chẳng hạn.
- Nếu hệ thống Load Balancer ở khu vực Region đó bị lỗi ở AZ nào đấy, AWS sẽ tự động thay đổi Load Balancer khác. Vì vậy cũng sẽ có khả năng AWS thay đổi luôn địa chỉ IP, nhưng tên miền DNS Load Balancer thì không và AWS sẽ tự cấu hình thay đổi lại địa chỉ IP mới cho tền miền DNS Load Balancer. Để khi ứng dụng hay người dùng phân giải DNS Load Balancer sẽ nhận địa chỉ IP mới.

Chính vì vậy khi sử dụng AWS Load Balancer ở hình thức ‘public-facing‘ với tên miền DNS Load Balancer thì bạn phải sử dụng hình thức kết hợp sau :

Tên miền ứng dụng web của bạn, sẽ phải cấu hình CNAME record trỏ đến tên miền:

- AWS ALB Load Balancer.
- Nếu bạn xài Route 53 của AWS, thì có thể xài Alias Record.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-20.png)


### Địa chỉ IP Public/Private của AWS Application Load Balancer
Bạn sẽ thắc mắc về thông tin địa chỉ IP Public và IP Private của AWS ALB phải không nào ?!

- Mỗi vùng **Availability Zone**, tương ứng từng Subnet mà ta trải đều ra các AZ, mà AWS AD Load Balancer liên kết thì AWS sẽ khởi tạo một Load Balancer trên AZ đó với thông tin IP Public mapping IP Private.
- **IP Public :** địa chỉ IP Public chỉ có thể truy xuất từ DNS Domain Name của Load Balancer như trên và do AWS cấu hình.
- **IP Private :** AWS ALB sẽ tự lấy 1 địa chỉ IP Private bên trong các Subnet, mà AWS ALB tham gia vào VPC và chọn các Subnet ở phần cấu hình đầu tiên, để làm địa chỉ IP nguồn gửi request đến phía backend. Như vậy phía backend server EC2 Instance sẽ nhận request từ các IP Private còn trống mà Load Balancer đã tự động lấy trong các Subnet.

Phần **IP Private Load Balancer** khi bạn view thông tin **AWS AD Load Balancer** sẽ thấy như hình dưới, rằng AWS sẽ tự lấy IP Private trong Subnet còn trống để sử dụng cho

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-17.png)

Mô hình để dễ mường tượng sẽ như hình dưới, với các chi tiết lưu ý :

- Mỗi AZ sẽ có một Load Balancer trong AWS ALB bạn đã tạo.
Mỗi Load Balancer sẽ có thông tin IP Public và IP Private của AZ Subnet tương ứng.
- Từ Load Balancer sẽ tự cân bằng tải tuần tự xuống các server trong Target Group từ địa chỉ IP Private của các Load Balancer.
- Danh sách IP Public của Load Balancer trong AWS ALB sẽ được truy vấn trả về tuần tự DNS Domain Name AWS ALB Roundrobin.

![](https://cuongquach.com/resources/images/2019/04/create-aws-alb-19.png)

Bạn muốn lấy được thông tin IP Private của các Load Balancer thì vào phần ‘Network Interfaces‘ sẽ thấy thông ra các InterfaceID sử dụng cho Load Balancer có description miêu tả ví dụ là : “ELB app/test/1ef1f2315165379b“. Hình dưới là ví dụ :

![](https://cuongquach.com/resources/images/2019/05/aws-elb-private-ip.png)

### Header HTTP/HTTPS từ ALB Load Balancer
Bạn có thể băn khoăn từ AWS ALB Load Balancer sẽ gửi request đến các server backend có kèm thêm thông tin header gì không ?! Đây là những thông tin HTTP Header bạn có thể bắt gói tin bằng ‘tcpdump’ hoặc ‘ngrep’.

```
T 2019/04/06 15:14:20.731804 10.110.5.201:27934 -> 10.110.6.66:80 [AP] #18
GET / HTTP/1.1.
X-Forwarded-For: 113.172.11.8.
X-Forwarded-Proto: http.
X-Forwarded-Port: 80.
Host: cuongqc-alb-web-35977512.ap-southeast-1.elb.amazonaws.com.
X-Amzn-Trace-Id: Root=1-5ca8c24c-1ba0975df9bb573e0b1b4ae5.
```
Từ các Header trên bạn có thể cấu hình Web Server backend của bạn trích xuất thông tin địa chỉ IP thật của người dùng truy cập tới Load Balancer .

### Truy cập web qua DNS Domain Name AWS ALB

Giờ bạn thử truy cập DNS Domain Name ALB thì bạn sẽ thấy web server phản hồi cho bạn nội dung html luân phiên bản giữa web 1 và web 2.

Bạn tiếp tục coi log access của Apache trên 2 EC2 Instance Web1 và Web2 , sẽ thấy log access ghi nhận request đến từ IP Private của các Load Balancer nằm ở khu vực AZ Subnet của bạn.

## Tổng kết
Vậy là bạn đã biết cách cấu hình AWS ALB sử dụng để Cân bằng tải ứng dụng web public ra ngoài Internet Public. Chúng ta vẫn còn vài case để lab về AWS ALB như : sử dụng cho internal service,