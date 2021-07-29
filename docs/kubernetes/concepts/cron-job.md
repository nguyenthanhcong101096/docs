---
sidebar_position: 9
---
# Cron-Job
## Khái niệm
- Chạy các Job theo một lịch định sẵn.
- Việc lên lịch cho CronJob khai báo giống Cron của Linux

## Template cron-job
```
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cronjob
  labels:
    cronjob: cronjob
spec:
  schedule: "*/1 * * * *"       # 1 Phút chạy 1 lần
  successfulJobsHistoryLimit: 3 # Số job lưu lại
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: busybox
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo "Job in CronJob"
          restartPolicy: Never
```

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes033.png)
