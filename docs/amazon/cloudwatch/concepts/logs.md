---
sidebar_position: 3
---

# Logs

![](https://res.cloudinary.com/ttlcong/image/upload/v1629944557/image-docs/cwl_en_1.png)

## Tạo IAM Role
Để cho phép EC2 có thể thao tác với Cloudwatch, bạn cần tạo 1 IAM Role (mình khuyến khích sử dụng IAM Role thay cho IAM user để đảm bảo security nhé).

- policy: **CloudWatchAgentServerPolicy**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629944865/image-docs/Screen_Shot_2021-08-26_at_9.26.49.png)

**Attach Role tới EC2**

![](https://res.cloudinary.com/ttlcong/image/upload/v1629945061/image-docs/Screen_Shot_2021-08-26_at_9.30.39.png)

:::tip
Thực tế thì chúng ta thường cần collect log của cả 1 autoscale group chẳng hạn, thì mọi người hãy attach nó ở trong launch config hoặc launch template nhé.
:::

## Cài đặt và Cấu hình AWS Cloudwatch Agent
:::tip
Chúng ta sẽ cài đặt trên EC2, với autoscale group thì các bạn nhớ tạo trên 1 ec2 rồi tạo AMI cho autoscale group đó nhé. Yêu cầu đầu tiên là EC2 phải có aws-cli.
:::

```
#ubuntu
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
```

```
# centos
sudo yum install amazon-cloudwatch-agent
```

- Tiếp theo sẽ tạo file config, cái mà quyết định bạn sẽ collect folder logs nào. Config file đặt ở

```json title="/opt/aws/amazon-cloudwatch-agent/bin/config.json"
{
  "agent": {
    "run_as_user": "root"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/apache2/error.log",
            "log_group_name": "apache-error-log",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
 }
```

- **file_path** là path tới file bạn bạn cần collect. 
- **log_group_name** và **log_stream_name** chính là các namespace được hiển thị trên dịch vụ Cloudwatch Logs


- Cuối cùng để enable việc collect log, chúng ta cần start winzard

```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

- Start Agent

```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json -s
```

## Xem logs

![](https://res.cloudinary.com/ttlcong/image/upload/v1629947113/image-docs/image7.png)
