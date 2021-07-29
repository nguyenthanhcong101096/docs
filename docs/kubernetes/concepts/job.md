---
sidebar_position: 8
---
# Job
## Khái niệm
- Job (jobs) có chức năng tạo các POD đảm bảo nó chạy và kết thúc thành công
- Khi các POD do Job tạo ra chạy và kết thúc thành công thì Job đó hoàn thành.
- Khi bạn xóa Job thì các Pod nó tạo cũng xóa theo
- Một Job có thể tạo các Pod chạy tuần tự hoặc song song
- Sử dụng Job khi muốn thi hành một vài chức năng hoàn thành xong thì dừng lại `(ví dụ backup, kiểm tra ...)`

## Template Job
```
apiVersion: batch/v1
kind: Job
metadata:
  name: job
  labels:
    job: job
spec:
  completions: 3               # Số lần chạy POD thành công
  backoffLimit: 2              # Số lần tạo chạy lại POD bị lỗi, trước khi đánh dấu job thất bại
  parallelism: 2               # Số POD tạo song song
  activeDeadlineSeconds: 120   # Số giây tối đa của JOB, quá thời hạn trên hệ thống ngắt JOB
  template:
    spec:
      containers:
      - name: busybox
        image: busybox
        command:
          - bin/sh
          - -c
          - date; echo "Job Executed"
      restartPolicy: Never
```

Trong đó:
- ***completions***: Số lần chạy POD thành công
- ***backoffLimit***: Số lần tạo chạy lại POD bị lỗi, trước khi đánh dấu job thất bại
- ***parallelism***: Số POD chạy song song
- ***activeDeadlineSeconds***: Số giây tối đa của JOB, quá thời hạn trên hệ thống ngắt JOB

![](https://raw.githubusercontent.com/xuanthulabnet/learn-kubernetes/master/imgs/kubernetes032.png)
