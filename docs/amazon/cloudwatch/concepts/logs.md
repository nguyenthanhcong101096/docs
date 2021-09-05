---
sidebar_position: 3
---

# Logs

![](https://res.cloudinary.com/ttlcong/image/upload/v1629944557/image-docs/cwl_en_1.png)

## Tạo IAM Role
Để cho phép EC2 có thể thao tác với Cloudwatch, bạn cần tạo 1 IAM Role (mình khuyến khích sử dụng IAM Role thay cho IAM user để đảm bảo security nhé).

### Create Policy

```json title="CWLogPolicy"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": ["arn:aws:logs:*:*:*"]
        }
    ]
}
```

![](https://res.cloudinary.com/ttlcong/image/upload/v1630817983/image-docs/Screen_Shot_2021-09-05_at_11.59.12.png)

### Create Role
- Attack policy ở trên

![](https://res.cloudinary.com/ttlcong/image/upload/v1630818347/image-docs/Screen_Shot_2021-09-05_at_12.05.33.png)

---

![](https://res.cloudinary.com/ttlcong/image/upload/v1630818424/image-docs/Screen_Shot_2021-09-05_at_12.06.54.png)

### Create EC2

- Attack role ở trên vào instance

![](https://res.cloudinary.com/ttlcong/image/upload/v1630818650/image-docs/Screen_Shot_2021-09-05_at_12.10.24.png)

## Install awslogs

- ssh ec2

```
sudo yum install awslogs
```

- edit awslogs.conf

```s title="awslogs.conf"
[/var/log/messages]
datetime_format = %b %d %H:%M:%S
file = /var/log/messages
buffer_duration = 5000
log_stream_name = {instance_id}
initial_position = start_of_file
log_group_name = /var/log/messages


[/var/log/nginx/access.log]
datetime_format = %b %d %H:%M:%S
file = /var/log/nginx/access.log
buffer_duration = 5000
```

- restart awslog

```
sudo systemctl enable awslogsd.service
sudo systemctl start awslogsd
```

## Check CloudWatch log

## Ref

- [AmazonCloudWatch](https://docs.amazonaws.cn/en_us/AmazonCloudWatch/latest/logs/QuickStartEC2Instance.html)
