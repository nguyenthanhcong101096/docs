---
sidebar_position: 3
---

# Identity & Access Management
Identity and Access Management (IAM) là dịch vụ cho phép người dùng quản lý việc truy cập những tài nguyên và dịch vụ trên AWS - AWS Resource

## Root & IAM User
Do tính bảo mật, AWS không khuyến khích người dùng sử dụng Root User trong các tác vụ thông thường. Thay vào đó, người dùng nên tạo ra những IAM User cho những mục đích khác nhau cùng quyền hạn cần thiết tương ứng

## IAM Group
IAM Group là tập hợp những IAM User chia sẻ chung một số quyền hạn. Một User cũng có thể thuộc về nhiều Group khác nhau, và do đó cũng sẽ có quyền khác nhau.

- Ví dụ chúng ta có thể tạo ra các group với permission:
  - Admin - quản trị mọi dịch vụ và tài nguyên trong hệ thống
  - DevOps - thực hiện xây dựng và vận hành các dịch vụ liên quan đến hoạt động CI/CD
  - Engineer - sử dụng những tài nguyên, dịch vụ cho phát triển ứng dụng
  - Finance - quản lý và báo cáo chi phí sử dụng các dịch vụ AWS

## IAM Role
IAM Role có ý nghĩa tương tự với IAM User ở điểm chúng đều là những đối tượng có định danh - AWS Identity, và được gán quyền sử dụng tài nguyên AWS

- Tuy Nhiên
  - IAM Role không bao gồm thông tin **credential (username/password hoặc access key)** như IAM User
  - IAM Role có thể được sử dụng bởi nhiều đối tượng khác, cho phép chúng có thêm những permission cho một tác vụ cụ thể

## Principle
Principle là các thực thể được xác thực bởi AWS, cho phép chúng gửi các yêu cầu đến AWS Resources. Principle có thể là IAM User, AWS Root User, hoặc IAM Role

## Policy
Policy là tập hợp những điều khoản định nghĩa quyền truy cập, sử dụng AWS Resources. AWS cung cấp 6 loại Policy, trong đó phổ biến nhất

- Cấu trúc một statement:
  - Sid - statement identity
  - Effect - có giá trị Allow hoặc Deny áp dụng lên quyền truy cập
  - Principal - đối tượng áp dụng của policy, chỉ áp dụng với Resource-based policies.
  - Action - danh sánh các hoạt động policy cho phép hoặc từ chối
  - Resource - tài nguyên cần truy cập, thường chỉ áp dụng với Identity-based policies
  - Conditional - điều kiện policy có tác dụng
