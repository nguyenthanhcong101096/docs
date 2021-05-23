---
id: terraform
title: Terraform
sidebar_label: Terraform
---
## Install

```
curl -O https://releases.hashicorp.com/terraform/0.12.18/terraform_0.12.18_linux_amd64.zip
sudo unzip terraform_0.12.18_linux_amd64.zip -d /usr/local/bin/
```
## Concepts
[Tham khảo](https://hocdevops.com/infrastructure-as-code/lam-quen-voi-terrafom/#Workspaces)
### Variables

Các biến cục bộ hoạt động giống như các biến tiêu chuẩn, nhưng phạm vi của chúng bị giới hạn trong mô-đun nơi chúng được khai báo

```
locals {
  vpc_id = module.network.vpc_id
}
module "network" {
  source = "./network"
}
module "service1" {
  source = "./service1"
  vpc_id = local.vpc_id
}
```

Ở đây, biến cục bộ `vpc_id` nhận giá trị của một biến đầu ra từ `mô-đun network` . Sau đó, chúng ta chuyển giá trị này làm đối số cho `mô-đun service1`.

### Provider
Nó là một plugin để tương tác với các API của dịch vụ và truy cập các tài nguyên liên quan của nó.

```
provider "kubernetes" {
  version = "~> 1.10"
}
```
### Module

`Mô-đun Terraform` là tính năng chính cho phép chúng ta sử dụng lại các định nghĩa tài nguyên trên nhiều dự án hoặc đơn giản là có một tổ chức tốt hơn trong một dự án duy nhất

```
module "networking" {
  source = "./networking"
  create_public_ip = true
}
```
Ở đây, chúng ta đang tham chiếu đến một mô-đun nằm tại thư mục con “networking” và chuyển một tham số duy nhất cho nó – một giá trị boolean trong trường hợp này.

### State
State (tệp trạng thái) của một dự án Terraform là một tệp lưu trữ tất cả thông tin chi tiết về tài nguyên đã được tạo trong ngữ cảnh của một dự án nhất định

```
terraform {
  backend "s3" {
    bucket = "some-bucket"
    key = "some-storage-key"
    region = "us-east-1"
  }
}
```
Terraform sử dụng khái niệm backend để lưu trữ và truy xuất các tệp trạng thái. Phần backend mặc định là phần local backend , sử dụng một tệp trong thư mục gốc của dự án làm vị trí lưu trữ. Chúng ta cũng có thể định cấu hình một backend từ xa thay thế bằng cách khai báo nó trong một khối terraform trong một trong các tệp .tf của dự án

> Một điểm quan trọng về tệp trạng thái là chúng có thể chứa thông tin nhạy cảm . Ví dụ bao gồm mật khẩu ban đầu được sử dụng để tạo cơ sở dữ liệu, khóa riêng tư, v.v.


### Resources
resource là bất kỳ thứ gì có thể là mục tiêu cho các hoạt động CRUD trong ngữ cảnh của một provider nhất định. Một số ví dụ là phiên bản EC2, Azure MariaDB hoặc DNS(compute instances, virtual networks, etc.)

```
resource "aws_instance" "web" {
  ami = "some-ami-id"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.frontend.id
}
resource "aws_subnet" "frontend" {
  vpc_id = aws_vpc.apps.id
  cidr_block = "10.0.1.0/24"
}
resource "aws_vpc" "apps" {
  cidr_block = "10.0.0.0/16"
}
```

**count và for_each Đối số Meta**

Các đối số meta count và for_each cho phép chúng ta tạo nhiều phiên bản của bất kỳ tài nguyên nào. Sự khác biệt chính giữa chúng là số đếm mong đợi một số không âm, trong khi for_each  chấp nhận một danh sách hoặc bản đồ các giá trị.

```
resource "aws_instance" "server" {
  count = var.server_count 
  ami = "ami-xxxxxxx"
  instance_type = "t2.micro"
  tags = {
    Name = "WebServer - ${count.index}"
  }
}
```

```
variable "instances" {
  type = map(string)
}
resource "aws_instance" "server" {
  for_each = var.instances 
  ami = each.value
  instance_type = "t2.micro"
  tags = {
    Name = each.key
  }
}
```

### Data Source
Data Source hoạt động khá nhiều dưới dạng tài nguyên “chỉ đọc” , theo nghĩa là chúng ta có thể lấy thông tin về những nguồn hiện có nhưng không thể tạo hoặc thay đổi chúng. Chúng thường được sử dụng để tìm nạp các tham số cần thiết để tạo các tài nguyên khác.

Ví dụ điển hình là nguồn dữ liệu aws_ami có sẵn trong nhà cung cấp AWS mà chúng ta sử dụng để khôi phục các thuộc tính từ AMI hiện có:
```
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}
```

Ví dụ này định nghĩa một Data Source được gọi là “ubuntu” truy vấn AMI và trả về một số thuộc tính liên quan đến hình ảnh được định vị

```
resource "aws_instance" "web" {
  ami = data.aws_ami.ubuntu.id 
  instance_type = "t2.micro"
}
```

### Input Values
Bất kỳ mô-đun nào, kể cả mô-đun trên cùng hoặc mô-đun chính, đều có thể xác định một số biến đầu vào bằng cách sử dụng các định nghĩa khối biến

```
variable "myvar" {
  type = string
  default = "Some Value"
  description = "MyVar description"
}
```

Sau khi được xác định, chúng ta có thể sử dụng các biến trong biểu thức bằng cách sử dụng tiền tố var :

```
resource "xxx_type" "some_name" {
  arg = var.myvar
}
```

### Output Values
Theo thiết kế, người tiêu dùng của mô-đun không có quyền truy cập vào bất kỳ tài nguyên nào được tạo trong mô-đun. Tuy nhiên, đôi khi chúng ta cần một số thuộc tính đó để sử dụng làm đầu vào cho mô-đun hoặc tài nguyên khác. `Để giải quyết những trường hợp đó, một mô-đun có thể xác định các khối output hiển thị một tập hợp con của các tài nguyên đã tạo`

```
output "web_addr" {
  value = aws_instance.web.private_ip
  description = "Web server's private IP address"
}
```
Ở đây chúng ta đang xác định giá trị đầu ra có tên “web_addr” chứa địa chỉ IP của phiên bản EC2 mà mô-đun của chúng ta đã tạo. Bây giờ bất kỳ mô-đun nào tham chiếu đến mô-đun của chúng ta đều có thể sử dụng giá trị này trong các biểu thức dưới

`dạng module.module_name.web_addr ,  trong đó  module_name là tên chúng ta đã sử dụng trong khai báo mô-đun tương ứng`

## Lifecycle
- **Terraform init:** initializes the working directory which consists of all the configuration files
- **Terraform plan:** is used to create an execution plan to reach a desired state of the infrastructure. Changes in the configuration files are done in order to achieve the desired state.
- **Terraform apply:** then makes the changes in the infrastructure as defined in the plan, and the infrastructure comes to the desired state.
- **Terraform destroy:** is used to delete all the old infrastructure resources, which are marked tainted after the apply phase.
