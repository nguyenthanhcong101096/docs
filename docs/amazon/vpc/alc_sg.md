---
sidebar_position: 3
---

# Security Group & Network ACL

Khi sử dụng AWS, bạn cần cẩn thận quan tâm về vấn đề security. AWS có nhiều dịch vụ quản lý security như IAM, Security Group, Network ACL (Network Access Control List),...

Bài này sẽ so sánh sự khác nhau của Security Group và Network ACL.

## 1. Sử dụng ở đâu
- **Network ACL** là tầng security của subnet, nó sẽ được gắn vào subnet, mọi traffic đi vào hay ra subnet đều phải qua sự kiểm duyệt của Network ACL.
- **Security Group** là tầng security của các EC2 instance, quản lý traffic vào ra của EC2 instance.

Điều đó nghĩa là:
- Khi traffic đi từ internet vào EC2 instance, nó phải đi qua Network ACL trước rồi mới đến Security Group.
- Khi traffic đi từ EC2 instance, nó phải đi qua Security Group trước rồi mới đến Network ACL.
 

## 2. Statefull và Stateless
Trước hết bạn cần biết **statefull** và **stateless** là gì:

- **Statefull** là khi cho phép ở `inbound rule` thì ở `outbound rule` cũng được tự động cho phép tương tự, và ngược lại.
- **Stateless** là khi cho phép ở `inbound rule` thì không được tự động cho phép ở `outbound rull`, và ngược lại.

Ví dụ: Khi bạn thêm inbound rule cho phép request đi vào ở port 80 thì:

- **Statefull**: bạn không cần phải thêm outbound rule cho phép response đi ra vì nó sẽ tự động được cho phép đi ra.
- **Stateless**: bạn phải thêm outbound rule để cho phép response có thể đi ra.
 
=> Network ACL là stateless, còn Security Group là statefull.


## 3. Cho phép và từ chối
- **Network ACL** khi tạo mới thì mặc định là `deny all` cả ở `inbound rule` và `outbound rule`, ta có thể thiết đặt `allow (cho phép)` hoặc `deny (từ chối)`. Vì vậy khi cần chặn IP thì thiết đặt ở đây.
- **Security Group** khi tạo mới thì mặc định là `deny all inbound` và `allow all outbound`, ta chỉ có thể thiết đặt allow, không thể thiết đặt deny. Vì thế không thể chặn IP ở đây.
 

## 4. Thứ tự các bản ghi
- **Network ACL**: thực hiện theo thứ tự được đánh số từ thấp tới cao, nếu gặp sẽ trả về kết quả luôn mà không thực hiện tiếp. Ví dụ bạn có bản ghi allow port 80 có số 100 và deny port 80 có số 101 thì khi có request vào port 80, gặp số 100 trước nên sẽ allow, không thực hiện số 101 để deny.
- **Security Group**: thực hiện tất cả bản ghi cùng lúc, mọi bản ghi đều phải thoả mãn.
 

## 5. Số lượng có thể gán
- **Network ACL**: một subnet chỉ có thể dùng một Network ACL, nhưng một Network ACL có thể gán cho nhiều subnet.
- **Security Group**: một instance có thể dùng nhiều Security Group, và một Security Group có thể gán cho nhiều instance.
