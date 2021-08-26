---
sidebar_position: 3
---

# Alarm
Tạo alarm gởi về email nếu CPU vượt quá 0%

Chuẩn bị: [SNS](/docs/amazon/continuous_delivery/codecommit#simple-notification-service-sns)

- Tạo [Alarm](https://ap-southeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-1#alarmsV2:create?~(Page~'MetricSelection~AlarmType~'MetricAlarm~AlarmData~(Metrics~(~)~AlarmName~'~AlarmDescription~'~ActionsEnabled~true~ComparisonOperator~'GreaterThanThreshold~DatapointsToAlarm~1~EvaluationPeriods~1~TreatMissingData~'missing~AlarmActions~(~)~InsufficientDataActions~(~)~OKActions~(~))))

Select metric - EC2 - Per-Instance Metrics - CPUUtilization

![](https://res.cloudinary.com/ttlcong/image/upload/v1629907075/image-docs/Screen_Shot_2021-08-25_at_22.57.45.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629907107/image-docs/Screen_Shot_2021-08-25_at_22.58.19.png)

- Configure actions

![](https://res.cloudinary.com/ttlcong/image/upload/v1629907172/image-docs/Screen_Shot_2021-08-25_at_22.59.09.png)

- Add name and description

![](https://res.cloudinary.com/ttlcong/image/upload/v1629907250/image-docs/Screen_Shot_2021-08-25_at_23.00.41.png)

- Create Success

![](https://res.cloudinary.com/ttlcong/image/upload/v1629907783/image-docs/Screen_Shot_2021-08-25_at_23.09.08.png)
![](https://res.cloudinary.com/ttlcong/image/upload/v1629907818/image-docs/Screen_Shot_2021-08-25_at_23.10.06.png)
