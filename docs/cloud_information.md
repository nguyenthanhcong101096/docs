---
id: cloud_information
title: Amazon Cloud Information
sidebar_label: Amazon Cloud Information
---
![](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/create-stack-diagram.png)

CloudFormation – một công cụ để “tài liệu hóa” nguồn tài nguyên ( EC2 instances, RDS database , VPC …) trên AWS.

Việc sử dụng CloudFormation giúp tái sử dụng các tài nguyên trên AWS dễ dàng và tự động. Giúp tiến gần tới khái niệm “Infrastructure as Code”

## Concepts
### Templates

```json
{
  "AWSTemplateFormatVersion" : "version date",
  "Description" : "JSON string",
  
  "Metadata" : {
    template metadata
  },
  
  "Parameters" : {
    set of parameters
  },
  
  "Mappings" : {
    set of mappings
  },
  
  "Conditions" : {
    set of conditions
  },
  
  "Resources" : {
    set of resources
  },
  
  "Outputs" : {
    set of outputs
  }
}
```

### Stack
Stack là một thực thể của template, nó là một ngăn xếp giúp quản lý tập hợp các tài nguyên AWS đang được sử dụng trong cùng một nhóm. Bạn có thể hình dung như stack là một ngôi nhà cụ thể được xây dựng từ bản thiết kế ( các templates ). 

## Practice
