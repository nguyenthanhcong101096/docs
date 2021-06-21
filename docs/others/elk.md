---
sidebar_position: 5
---

# ELK Stack
## ELK Stack là gì
- ELK Stack là tập hợp 3 phần mềm đi chung với nhau, phục vụ cho công việc logging. Ba phần mềm này lần lượt là
  - **Elasticsearch**: Cơ sở dữ liệu để lưu trữ, tìm kiếm và query log
  - **Logstash**: Tiếp nhận log từ nhiều nguồn, sau đó xử lý log và ghi dữ liệu và Elasticsearch
  - **Kibana**: Giao diện để quản lý, thống kê log. Đọc thông tin từ Elasticsearch
  - **Beats**: gửi dữ liệu thu thập từ log của máy đến Logstash

**Cơ chế hoạt động của ELK Stack**

![](https://raw.githubusercontent.com/xuanthulabnet/linux-centos/master/docs/beats-platform.png)

- Đầu tiên, log sẽ được đưa đến Logstash. (Thông qua nhiều con đường, ví dụ như server gửi UDP request chứa log tới URL của Logstash, hoặc Beat đọc file log và gửi lên Logstash)
- Logstash sẽ đọc những log này, thêm những thông tin như thời gian, IP, parse dữ liệu từ log (server nào, độ nghiêm trọng, nội dung log) ra, sau đó ghi xuống database là Elasticsearch.
- Khi muốn xem log, người dùng vào URL của Kibana. Kibana sẽ đọc thông tin log trong Elasticsearch, hiển thị lên giao diện cho người dùng query và xử lý.

**Tại sao phải dùng ELK Stack?**
- Với các hệ thống hoặc ứng dụng nhỏ, ta không cần sử dụng ELK stack làm gì! Cứ dùng thư viện ghi log đi kèm với ngôn ngữ, sau đó ghi log ra file rồi đọc thôi!

- Tuy nhiên, với những hệ thống lớn nhiều người dùng, có nhiều service phân tán (microservice), có nhiều server chạy cùng lúc… thì việc ghi log xuống file không còn hiệu quả nữa

- Giả sử bạn có 10 con server chạy cùng lúc, bạn sẽ phải lục tung 10 con server này để đọc và tìm file log, cực quá phải không nào? Lúc này, người ta bắt đầu áp dụng centralized logging, tức ghi log tập trung vào 1 chỗ.

**Vậy ELK Stack có gì hay ho?**
- Đọc log từ nhiều nguồn(DB, request)
- Dễ tích hợp
- Hoàn toàn free
- Khả năng scale tốt
- Search và filter mạnh mẽ
- Cộng đồng mạnh, tutorial nhiều

## Cài đặt ELK Stack
### Cài đặt Elasticsearch
```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list

sudo apt update

sudo apt install elasticsearch
```

- nano /etc/elasticsearch/elasticsearch.yml
```
# uncomment
network.host: localhost

http.port: 9200
```

- start service
```
sudo systemctl enable elasticsearch

sudo systemctl start elasticsearch
# or
sudo service elasticsearch start
```

- check
```
curl -X GET "localhost:9200"
```

### Cài đặt Kibana
```
sudo apt-get install kibana
```

- sudo nano /etc/kibana/kibana.yml

```
# uncomment
server.port: 5601

server.host: "localhost"

elasticsearch.hosts: ["http://localhost:9200"]
```

- start service
```
sudo systemctl enable kibana

sudo systemctl start kibana
# or
sudo service kibana start
```

- check
```
http://localhost:5601
```

### Cài đặt Logstash
- Logstash là nơi nhận dữ liệu đầu vào, nó xử lý sau đó chuyển lưu tại Elasticseach. Luồng làm việc của nó phải được cấu hình gồm cấu hình đầu vào input và đầu ra output

```
sudo apt-get install logstash
```

- Cấu hình input: file cấu hình tại `/etc/logstash/conf.d/02-beats-input.conf`

```
# phần này sẽ cấu hình để nó nhân đầu vào do Beats gửi đến cổng beats, thực hiện lệnh sau để tạo file 02-beats-input.conf

echo 'input {
  beats {
    host => "0.0.0.0"
    port => 5044
  }
}' > /etc/logstash/conf.d/02-beats-input.conf
```

- Cấu hình đầu ra, file cấu hình tại `/etc/logstash/conf.d/30-elasticsearch-output.conf`
```
# phần này sẽ cấu hình sau khi Logstash nhận dữ liệu đầu vào từ Beats, nó xử lý rồi gửi đến Elasticsearch (localhost:9200). Thực hiện lệnh để tạo file 30-elasticsearch-output.conf

echo 'output {
  elasticsearch {
    hosts => ["localhost:9200"]
    manage_template => false
    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
  }
}' > /etc/logstash/conf.d/30-elasticsearch-output.conf
```

- Ngoài ra nếu muốn lọc các log, định dạng lại các dòng log ở dạng dễ đọc, dễ hiểu hơn thì cấu hình filter tại file `/etc/logstash/conf.d/10-syslog-filter.conf`
```
# ví dụ sau là cấu hình định dạng lại cấu trúc system log, lấy theo hướng dẫn tại document của Logstash

echo 'filter {
  if [fileset][module] == "system" {
    if [fileset][name] == "auth" {
      grok {
        match => { "message" => ["%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sshd(?:\[%{POSINT:[system][auth][pid]}\])?: %{DATA:[system][auth][ssh][event]} %{DATA:[system][auth][ssh][method]} for (invalid user )?%{DATA:[system][auth][user]} from %{IPORHOST:[system][auth][ssh][ip]} port %{NUMBER:[system][auth][ssh][port]} ssh2(: %{GREEDYDATA:[system][auth][ssh][signature]})?",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sshd(?:\[%{POSINT:[system][auth][pid]}\])?: %{DATA:[system][auth][ssh][event]} user %{DATA:[system][auth][user]} from %{IPORHOST:[system][auth][ssh][ip]}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sshd(?:\[%{POSINT:[system][auth][pid]}\])?: Did not receive identification string from %{IPORHOST:[system][auth][ssh][dropped_ip]}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sudo(?:\[%{POSINT:[system][auth][pid]}\])?: \s*%{DATA:[system][auth][user]} :( %{DATA:[system][auth][sudo][error]} ;)? TTY=%{DATA:[system][auth][sudo][tty]} ; PWD=%{DATA:[system][auth][sudo][pwd]} ; USER=%{DATA:[system][auth][sudo][user]} ; COMMAND=%{GREEDYDATA:[system][auth][sudo][command]}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} groupadd(?:\[%{POSINT:[system][auth][pid]}\])?: new group: name=%{DATA:system.auth.groupadd.name}, GID=%{NUMBER:system.auth.groupadd.gid}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} useradd(?:\[%{POSINT:[system][auth][pid]}\])?: new user: name=%{DATA:[system][auth][user][add][name]}, UID=%{NUMBER:[system][auth][user][add][uid]}, GID=%{NUMBER:[system][auth][user][add][gid]}, home=%{DATA:[system][auth][user][add][home]}, shell=%{DATA:[system][auth][user][add][shell]}$",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} %{DATA:[system][auth][program]}(?:\[%{POSINT:[system][auth][pid]}\])?: %{GREEDYMULTILINE:[system][auth][message]}"] }
        pattern_definitions => {
          "GREEDYMULTILINE"=> "(.|\n)*"
        }
        remove_field => "message"
      }
      date {
        match => [ "[system][auth][timestamp]", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
      }
      geoip {
        source => "[system][auth][ssh][ip]"
        target => "[system][auth][ssh][geoip]"
      }
    }
    else if [fileset][name] == "syslog" {
      grok {
        match => { "message" => ["%{SYSLOGTIMESTAMP:[system][syslog][timestamp]} %{SYSLOGHOST:[system][syslog][hostname]} %{DATA:[system][syslog][program]}(?:\[%{POSINT:[system][syslog][pid]}\])?: %{GREEDYMULTILINE:[system][syslog][message]}"] }
        pattern_definitions => { "GREEDYMULTILINE" => "(.|\n)*" }
        remove_field => "message"
      }
      date {
        match => [ "[system][syslog][timestamp]", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
      }
    }
  }
}
' > /etc/logstash/conf.d/10-syslog-filter.conf
```

- Config Validation Result
```
sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -t
```

- start service
```
systemctl enable logstash

systemctl start logstash
or
service logstash start
```

### Cài đặt Beats
Trong phần này sẽ thử dùng [Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html), thu thập các file log trên Server cài đặt nó

- Beats là một nền tảng để gửi dữ liệu vào Logstash, nó có nhiều thành phần như
  - Packetbeat : lấy / gửi các gói tin mạng
  - Filebeat : lấy / gửi các file log của Server
  - Metricbeat : lấy / gửi các log dịch vụ (Apache log, mysql log ...)
  - Winlogbeat: collects Windows event logs.
  - Auditbeat: collects Linux audit framework data and monitors file integrity.
  - Heartbeat: monitors services for their availability with active probing.

- install
```
yum install filebeat -y
```

- File cấu hình tại `/etc/filebeat/filebeat.yml`, mở ra chỉnh sửa các nội dung sau

```
# Tìm đến mục Elasticsearch output comment lại để không gửi log thẳng đến Elasticsearch

#output.elasticsearch:
  # Array of hosts to connect to.
  # hosts: ["localhost:9200"]
```

Ngoài ra tại mục `filebeat.inputs`: có phần

```
paths:
  - /var/log/*.log
  #- c:\programdata\elasticsearch\logs\*
```

Có nghĩa là nó đang thu thập logs từ các file ở `/var/log/*.log`, nếu muốn cấu hình thu thập thêm log từ các đường dẫn khác cho các ứng dụng khác không viết log ra `/var/log` thì tự thêm vào

- filebeat có nhiều module tương ứng với loại log nó thu thập
```
filebeat modules list
```

Sau đó nếu muốn kích hoạt module nào thì thực hiện theo cú pháp, ví dụ kích hoạt system, apache, mysql ...

```
filebeat modules enable system
filebeat modules enable apache
filebeat modules enable mysql
```

- start service
```
systemctl enable filebeat

systemctl start filebeat
or
service filebeat start
```

## Tham khao
- [elasticsearch-logstash-kibana](https://xuanthulab.net/tim-hieu-va-cai-dat-elk-elasticsearch-logstash-kibana.html)
- [how-to-install-elk-stack-on-ubuntu](https://phoenixnap.com/kb/how-to-install-elk-stack-on-ubuntu)
- [kibana-elastic-stack-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-install-elasticsearch-logstash-and-kibana-elastic-stack-on-ubuntu-18-04)
