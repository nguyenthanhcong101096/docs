---
sidebar_position: 1
---

# Vagrant

![](https://www.vagrantup.com/img/og-image.png)

## Sử dụng Vagrant tạo và quản lý máy ảo
### Công cụ vagrant là gì
- Vagrant là một công cụ tương tác với các nền tảng ảo hóa như VirtualBox, HyperV, VM ..., nó giúp tạo và quản lý các máy ảo trên các nền tảng đó. Vagrant cung cấp một cấu hình đơn giản tạo và quản lý, tương tác với máy ảo mà không có nhiều sự khác biệt dù bạn đang sử dụng VirtualBox, VM hay HyperV

### Cài đặt Vagrant
- Vagrant làm việc với một nền tảng ảo hóa nào đó như VirtualBox, HyperV, VM ... nên bạn cũng cần có trên hệ thống của mình, ví dụ cần cài đặt VirtualBox nếu dùng nền tảng này, ở phần này coi như bạn đã đang có VirtualBox hay HyperV trên hệ thống

**Cài đặt vagrant trên Windows / macOS**

[Link tai](https://www.vagrantup.com/downloads.html)

**Cài đặt Vagrant trên Ubuntu**

`sudo apt-get install vagrant`

Cũng kiểm tra bằng lệnh:

`vagrant version`

### Sử dụng Vagrant tạo và quản lý máy ảo Linux

- Cách sử dụng thông thường là khai báo các máy ảo trong một file cấu hình có tên là Vagrantfile, quy tắc viết cấu hình ở dưới, nhưng trước tiên cần xác định máy ảo đó chạy hệ điều hành gì ... để file cấu hình khởi tạo máy ảo, các nguồn để khởi tạo máy ảo được gọi là các Box, bạn cần tìm Box muốn sử dụng tại: Tìm Box Vagrant

- Ví dụ, muốn khởi tạo một máy ảo từ hệ điệu hành CentOS, thì có thể tìm và chọn Box có tên centos/7 nó phù hợp cho cả VirtualBox và HyperV. Muốn một máy ảo Ubuntu có thể chọn Box có tên ubuntu/trusty64 Box này lại chỉ phù hợp với Virtual Bõ. Tương tự như vậy có thể tìm kiếm chọn ra Box phù hợp! Hướng dẫn này giả sử sẽ tạo một máy ảo chạy CentOS/7, dùng nền tảng VirtualBox (trên máy phải cài đặt sẵn VirualBox).

Tạo một thư mục dự án đạt tên là vagrant-exam, từ dòng lệnh (terminal, powershell ...) vào thư mục đó gõ lệnh sau để nó sinh ra file cấu hình **Vagrantfile:**

`vagrant init`

Sau lệnh này, nó sinh ra file Vagrantfile trong đó có chứa nội dung hướng dẫn cấu hình theo mẫu. Nội dung file đó có dạng:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"


  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
end
```

Trong file trên chứa các hướng dẫn cấu hình, đa số ở trạng thái comment, nếu muốn cấu hình phần nào thì bỏ comment (xóa #) ở phần đó. Ở đây bạn thay nội dung cấu hình thành như sau để tạo máy ảo centos/7 - ý nghĩa có giải thích ở comment sau mỗi cấu hình

**Vagrantfile**

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|                # Bắt đầu khai báo máy ảo
  config.vm.box = 'centos/7'                    # Sử dụng Box centos/7 tạo máy ảo

  config.vm.provider "virtualbox" do |vb|       # Máy ảo dùng nền tảng virtualbox, với các cấu hình bổ sung thêm cho provider
     vb.name = "may-ao-01"                      # đặt tên máy ảo tạo ra
     vb.cpus = 2                                # cấp 2 nhân CPU
     vb.memory = "2048"                         # cấu hình dùng 2GB bộ nhớ
  end                                           # hết cấu hình provider

end                                             #  hết cấu hình tạo máy ảo
```

### vagrant up
- Thi hành tạo máy ảo: gõ với lệnh `vagrant up`, lệnh này sẽ tạo máy ảo (cập nhật) được cấu hình trong Vagrantfile, nếu mở VirtualBox Manager sẽ thấy tên và trạng thái máy ảo này. Ở đây là máy ảo có tên may-ao-01
![](https://raw.githubusercontent.com/xuanthulabnet/linux-centos/master/vagrant-exam/docs/vagrant02.png)

- Nhìn vào các thông báo quá trình tạo máy ảo, mặc định nó sẽ chia sẻ thư mục chứa file Vagrantfile ở máy host vào máy ảo ở đường dẫn /vagrant của máy ảo. Có nghĩa tại máy ảo truy cập vào thư mục /vagrant/ thì trong đó chính là dữ liệu trong thư mục có file Vagrantfile của máy host

### vagrant ssh
- Khi máy ảo đang chạy, vẫn đang ở dòng lệnh tại thư mục chứa file Vagrant để kết nối đến máy ảo bằng giao thức ssh gõ lệnh sau:

`vagrant ssh`

- Bạn sẽ đăng nhập vào máy ảo với tài khoản user có tên là vagrant, từ tài khoản này nếu muốn chuyển sang root gõ lệnh:

`sudo -i`

![](https://raw.githubusercontent.com/xuanthulabnet/linux-centos/master/vagrant-exam/docs/vagrant03.png)

### Lệnh vagrant hay dùng

- `vagrant init`	Sinh file cấu hình máy ảo mới Vagrantfile
- `vagrant up`	Thực hiện tạo / hoặc chạy máy ảo với cấu hình từ Vagrantfile
- `vagrant ssh`	Kết nối ssh vào máy ảo, tài khoản kết nối là vagrant
- `vagrant halt`	Dừng máy ảo (shutdown)
- `vagrant reload`	Khởi động lại máy ảo, có đọc lại cấu hình trong Vagrantfile
- `vagrant destroy`	Xóa máy ảo

## Đồng bộ thư mục
- Mặc định khi chạy máy ảo, nó đã đồng bộ qua lại giữa thư mục chứa file Vagrantfile vào thư mục /vagrant/ của máy ảo. Nếu muốn cấu hình đồng bộ sử dụng config.vm.synced_folder, ví dụ cần đồng bộ thư mục máy host hiện tại . vào thư mục /data/mydata/ của máy ảo

`config.vm.synced_folder '.', '/data/mydata/'`

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|                # Bắt đầu khai báo máy ảo
  config.vm.box = 'centos/7'                    # Sử dụng Box centos/7 tạo máy ảo

  config.vm.synced_folder '.', '/data/mydata/'  # Chia sẻ thư mục máy host và máy ảo

  config.vm.provider "virtualbox" do |vb|       # Máy ảo dùng nền tảng virtualbox, với các cấu hình bổ sung thêm cho provider
     vb.name = "may-ao-01"                      # đặt tên máy ảo tạo ra
     vb.cpus = 2                                # cấp 2 nhân CPU
     vb.memory = "2048"                         # cấu hình dùng 2GB bộ nhớ
  end                                           # hết cấu hình provider

end                                             #  hết cấu hình tạo máy ảo
```

- Sau khi sửa file cấu hình, nạp lại máy ảo bằng vagrant reload
- Nếu có lỗi có thể cần cài đặt Plugin vagrant-vbguest

`vagrant plugin install vagrant-vbguest`

### Forward cổng máy ảo ra host
- Nếu muốn chuyển cổng từ máy ảo ra máy host, ví dụ cổng máy ảo là 80 ra cổng máy host 8080 (có nghĩa là từ máy host truy cập cổng 8080 - locahost:8080 - thì có nghĩa là truy cập cổng 80 của máy ảo)

`config.vm.network "forwarded_port", guest: 80, host: 8080`

- Ngoài ra bạn cũng có thể thiết lập cho máy ảo có cấu hình với địa chỉ IP do bạn chỉ định và NAT giúp máy host (các máy khác trong LAN) truy cập đến địa chỉ này của máy ảo mà không cần forward cổng.

`config.vm.network "private_network", ip: "192.168.10.155"`

- Với cấu hình trên, thì địa chỉ máy ảo là 192.168.10.155, bạn có thể truy cập đến các cổng của máy ảo với địa chỉ IP này, ví dụ http://192.168.10.155 (tức cổng 80)

### Provision - chạy lệnh khi tạo máy ảo
- Trong quá trình tạo máy ảo, sau khi nạp Box, bạn có thể chạy các lệnh, các script của hệ điều hành, nếu chạy một script từ file myscript.sh thì cấu hình là:

`config.vm.provision "shell", path: "./myscript.sh"`

- Cũng có thể cấu hình chạy trực tiếp các lệnh, ví dụ:

```
config.vm.provision "shell", inline: <<-SHELL
    # các lệnh cần chạy
SHELL
```

Ví dụ sau tạo máy ảo CentOS, cài Apache, PHP:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|                # Bắt đầu khai báo máy ảo
  config.vm.box = 'centos/7'                    # Sử dụng Box centos/7 tạo máy ảo

  config.vm.network "private_network", ip: "192.168.10.55"   # Lập IP cho máy ảo
  config.vm.hostname = "master.xtl"             # Đặt hostname cho máy ảo

  config.vm.synced_folder '.', '/var/www/public/' # Chia sẻ thư mục máy host và máy ảo

  config.vm.provider "virtualbox" do |vb|       # Máy ảo dùng nền tảng virtualbox, với các cấu hình bổ sung thêm cho provider
     vb.name = "may-ao-01"                      # đặt tên máy ảo tạo ra
     vb.cpus = 2                                # cấp 2 nhân CPU
     vb.memory = "2048"                         # cấu hình dùng 2GB bộ nhớ
  end                                           # hết cấu hình provider

# Chạy các lệnh cài đặt
config.vm.provision "shell", inline: <<-SHELL
    # cài đặt Apache, PHP
    yum update -y
    yum install httpd php -y
    systemctl start httpd
    systemctl enable httpd

    # Tat SELinux cua CentOS
    setenforce 0
    sed -i --follow-symlinks 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux


    # Đổi root password thành 123 và cho phép login SSH qua root
    echo "123" | passwd --stdin root
    sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
    systemctl reload sshd

    # Tạo file cấu hình vhost lưu vào /etc/httpd/conf.d/vhost.conf để Apache nạp
    echo '<VirtualHost *:80>
      DocumentRoot /var/www/public
      AllowEncodedSlashes On

      <Directory /var/www/public>
        Options +Indexes +FollowSymLinks
        DirectoryIndex index.php index.html
        Order allow,deny
        Allow from all
        AllowOverride All
        </Directory>
    </VirtualHost>' > /etc/httpd/conf.d/vhost.conf
    systemctl start httpd
SHELL

end                                             #  hết cấu hình tạo máy ảo
```

Xóa máy ảo cũ, thực hiện vagrant up tạo lại máy ảo. Sau khi tạo máy ảo có thể cần khởi động lại (reload) để cấu hình như Selinux, Apache có hiệu lực

- Tạo file index.php ở thư mục dự án với nội dung:

```
<?php
    echo "Hello World!";
    phpinfo();
```

Giờ truy cập http://192.168.10.55
![](https://raw.githubusercontent.com/xuanthulabnet/linux-centos/master/vagrant-exam/docs/vagrant04.png)

## Setup
repo: https://github.com/nguyenthanhcong101096/vagrant-example

- cd /PATH/TO/vagrant

```
vagrant up
vagrant ssh

```
- cd /PATH/TO/app

```
bundler install
gem install bundler

yarn install
/bin/webpack

rails db:create db:migrate db:seed
rails s -b 0.0.0.0
```
