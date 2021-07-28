---
sidebar_position: 4
---

# Lambda và SNS CloudWatch AWS

![](https://miro.medium.com/max/7724/1*_ulsaWF4LAmK0C30ziJWwA.png)

AWS Lambda là một dịch vụ được cung cấp bởi Amazon nơi mà có thể write/upload code và trả về một HTTP request. AWS Lambda sử dụng tài nguyên của AWS để chạy các đoạn code(function).

Lambda hỗ chợ các ngôn ngữ sau:

- NodeJs v10.15 và v8.10
- Java 8
- Python 3.7, 3.6 và 2.7
- .NET Core : 1.0.1 và 2.1
- Go 1.x
- Ruby 2.5
- Rus

## Lambda: 
Chúng ta bắt đầu tạo một serverless “Hello, World” với AWS Lambda.

Chọn lambda trong Compute:

![](https://labs.septeni-technology.jp/wp-content/uploads/2019/10/1-768x541.png)

### 1. Create function
### 2. Chọn Use a blueprint
Chọn **authorFromScratch** → **Configure** để bắt đầu tạo một Lambda function

![](https://lh3.googleusercontent.com/wGeWeGKeAXurSeqgkyYegSW4aKpc3Q7jHQf3AtZHM5NLFs6uZpyG6zh7vBaGm_I9wKNXo-kXVh1ARNuQIFzqEevOOz4h9kDL3ao_d-Bo7XDFTsCaBIyZvs1pdGyMmHE4FYUNt9Fw_JF0gusiW709141BhSWN0d1TBn9NrRvi8XANslP_6WfPWGDT5J4kZOtiV8xK2KmVsKKLgHq2uaWAKdLVwGpaDOfy71L2h2nDgENMZmjWPJLgsEEDoPGKizSM-Lxt0hyT0F1qcPHB_MV7bBJ8W4EGR0cd843xo0RAreEww6abBKbYgJFIv4mXdjkZ8-8PWajL3X-WamO7U9v9H3QvZh2eluAdqzKdgvTX7vL4HDN2RWMS8MSUR22e4w0iz-JMCLP8-zDPlD9u1Df7d2-u1DIa7XPQRVoB6qOfxrFz_Xmd0C8nnG_7WuGE5-aDChVyODv3TZYEPWkzuPve_mInXJtMVwh6SP-eHkTLyqn3L12KWrAbHEQoovB_36lhDzjMZw-t9a-TUBVY-P2T0q6_8XPOu_CqFdV50LT78SdfItKd-sSEP0OByuL72aACmOzt0EFX3C8Zf0H83rn1gs4wEBP0S3dnpI4h1wnoQXRDR9tvP2c24moubIseQC0-ze1Iwjk-EdwNJc-a460KzSQGSVbl47hFFkQbsSn5lWwDLYu87zeMxQSKglLe9YQ=w2716-h1498-no?authuser=0)

Create function

### 3. Test function bằng cách click vào Test, 
ta có thể chọn mã code tại Runtime, chỉ định function/method tại Handler

![](https://labs.septeni-technology.jp/wp-content/uploads/2019/10/5-1024x575.png)

### 4. Nhập Event name

![](https://labs.septeni-technology.jp/wp-content/uploads/2019/10/6-1024x608.png)

→ kết quả test trả về HTTP requests như sau:

![](https://labs.septeni-technology.jp/wp-content/uploads/2019/10/8-1024x572.png)

lambda_function.rb example

```
require 'json'
require 'net/http'
require 'uri'

def lambda_handler(event:, context:)
    uri     = URI.parse('https://hooks.slack.com/services')
    
    params  = {
      'channel': '#wakuwaku-bots',
      'username': 'Cloudwatch WakuWaku System',
      "blocks": block,
      'icon_emoji': ':fire_engine:'
    }
    
    request = Net::HTTP::Post.new(uri)
    request.body = params.to_json
    
    req_options = { use_ssl: uri.scheme == 'https' }
    
    Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
end

def block
  [
    {
      "type": "section",
      "block_id": "section567",
      "text": {
        "type": "mrkdwn",
        "text": "Test Send mail failure"
      }
    }
  ]
end
```

## Simple Notification Service:
AWS SNS là một dịch vụ web dùng để điều phối và quản lý việc chuyển hoặc gửi tin nhắn đến các điểm cuối hoặc khách hàng đăng ký.

![](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/p3vlq4nt9v_image.png)

### SNS có 3 thành phần chính
- **Publisher :**
kích hoạt việc gửi tin nhắn (ví dụ: CloudWatch Alarm ,Bất kỳ ứng dụng nào hoặc sự kiện S3 nào xảy ra )

- **Topic :**
Đối tượng mà bạn muốn publish tin nhắn của mình (≤256KB)
Thuê bao đăng ký Topic để nhận tin nhắn
Chỉ giới hạn được 10tr subscribers

- **Subscriber :**
Một điểm cuối cho một tin nhắn được gửi. Tin nhắn được đẩy đồng thời đến subscriber

### Create SNS
Go to SNS

![](https://lh3.googleusercontent.com/g4wTPHFdlmS2fVndcgkwiS3P_MeO-lTsGP18VB3j1wfZ7foBtbi1yM52XWK7YQSXeukmL2to-QVEOinXWWbfniTeUR15xu2VDkWC7jCN0F6y5lq3RNGM5AjB9y-rSdCG1ECJCpj2N1qqxzcDOkaatpO7D8F_Mr4Fxj6-qO9h7y8xlQ3hBfUGHogF0r_SqoYKzhqSVVlBXn66O3DOHiRgsgZHZ0YEZ5jBOk8uN__vAb63-xmJ1loT2wtX63ZpBMQdX-7u4SigZ4jW504AoxST7J0i8DJwTRD-FRmqeg3nPnbAeepS5-lPgibSjuxki3hs91IdfNNI-fMLN9NKgAw0FYjW8HtQJZiUjM70ryQa128YJ1aL4174vQOpiM_QIfQyfgraKz6cqVCqbwteiZsmQeKYoSxiPOs5dyY9jzcjUEXBRv5E5CWYSgAC6pJb-pTCybRO1e0yb0BUWrRvPDZtH6oFwhhV6QjXLk6NgiG4qcz3BZDRPGtf5L2dOwpfEIpSM8qukZ5Zwt7gvkPVCZeAY65tylqNqR1xSCIt5ekbyGJ-gnldiWKqWQ64gtluiMBWqhWZDsM_pEIWLeCwsT8R4Wwvuq7hCgJW__3zs_t7KuxtXw76l7wvvRpY2xsiHcsO9ckDAOGgGI9XpCORrwR9puh9KUJpCHvNWp9Hc8ZlFnnxgbRCAwTrskhSu4FSoxs=w2878-h1020-no?authuser=0)

Create topic

![](https://lh3.googleusercontent.com/gwFwN7da6nulvg-1lTQgZ8aKWLq7ZceuOVs9NdtC5x-YseG-2fmwqXRu4iXjz8FYpOXqPPJpqaLCE-FZYoixr4uM0dAmtakhrslf49YSYiHoCalfrafPM_WQRPOttkl8gF8Kgfrs0111VukMWK79gQFLJZONTEe6U00_zbBpaoEt4o5-77aADwZKLG-WH6Zh_dHYEjprWNigWbN17R-EwgdPtMUHJ_8VyyPVgsFj_scB3ROGTo6Ys7aF0AnMjsA9IY_V-tv2mb1EUWpzWCoQACgUg2yUyhWvjIOWaUFoxEmcFhJKiW4vB3tIuzO_5PtwSUMYwv_GTW7uONu39F24t148C1gj4aWtMkOp-v1JMbaEifgbniHO9UlfF1jPO8Y2TZl08UfdjWEKRyAPpBgFKEhnTZqx4Eh7O9hvjvX3w7cIExD63-Hlz4YGZONDxs8y6XkC7kM8MBaOoXww8v8c3uoKV-jojMwBQg51GxEpx7Llr0iUNTPY2L5506YcA_2Gt-AaABpVg10WG-46Aj91kwCRasCQmFMDSEfFPmYwSSWq8XIhMxkAJsXFYDPia58rjcqTXQmHR7yYqHZo_Je888mJ1MlGlD4H8vM56ztqGgRPjwBW_-dH56-lfRHIRvKp3SpBkg0P8dZZFIGLIrI5dGqss5DdyKkqJ57MPytGmWTMSiv_XBuk3OCBFXh-_k4=w2080-h900-no?authuser=0)

Next

![](https://lh3.googleusercontent.com/_fcDYvI17T7dhqMgsnZ3Zj2YXN0ZVFRCv9o3CuBRnph_ZeRGRxEHMBf3tZGxSFJToVn1WDWSG37U41-eDJiIFuZpMfvJzoq3qQIST5eM5dio-fX7MAJyNHc9A9rgOxK_CmjPhJqX4En-GCjNoVXD2_R4lavyyjK2r98ZbU5KdlattWNww1acD2AdzpsFJVgfmwlDXZ1T2nD5dRnSxFhQzwgIXs12Rr1GvMwfn6XfmZLFlinh9-uSEUgjd3NSbd_zbJAYjHkLFnM0UJWySRNNIDg6lzgpQ37UqkXJ__djIS-SkCINrpAGGF7LxfuydhtUlFpW7PvQR0V6b16_2Fm1bpM15r91XMTnomHoExxe18l7cu5WQ6RR6x5GlcBIpJbZxeAuBiK82lIfWr3oZa9AN0OJVdL3oa8y0Ni_2Fyfhw_pGUKBcN4kN9NANu1pqShwr2eWC77rL22YYVXTkDFuhAm_wwyAzAcuJ8jWdYUfgfjjDCuvByHagOZTs-TYy7ONtf1UQ7ZnQAU1qJdT_cRsR9v8IJs4x4xVue08ih561NU6_uocTD30XwFe9yTypHDyjIdbfmTaX85s4SXaR44BvTPJzyDIyWWx3CZF0VIqbFMyAyq9i_IRO35L1yhWWXODuULr1DTUWnaIeXP8DVEXvYP5HhLUrZ37ZEMk1OwJC34Po5tdtvyNcHMel-7gEWU=w2246-h1288-no?authuser=0)

Create subscription

![](https://lh3.googleusercontent.com/FtYY1vyjmkkMNgpEIKifBlnk0rm6s_2mdqkCwGtBAqT2txKYVNWI3ytreAtMXpOhb-AUabbLuq4KsEXkluUyb_aaUI5kK824unmr2TFKjZ0M1Mn5KHnwkFKQAbnfmYYiWKrD5vRYK6upoCQIbD2OeYDejI3X-VHDwqS7CZMuj5qmEV8bznSTuBWgP6_9bFc-9RVaB2zBEewO_CVuu40rzIR2i9NgNl73koHI76m87gsbCLm7HBfhhCYzZUU_kVP94HCUN-Aa0gtgZBDYm74ZmIMIPDj3OMWyZarqaPsRLj16F0IsptpM4rrpLeWd3nbuHTU5TRqhyAkv8AD9sdFuZh_dmxA8tgxcZI2T2qlLchwE7TFA1kwkFrJUF55m7_y9DiwFwKopGs7kEees4u0_rmr-qhouQumfhFSn-gSu5jg_lQ28Zem5i-IVIaU9aUBCjDGMkgRS_03rO6jVmq-KDrNrUhNd3MssZ_0ldu4-kvG3VRKECm5NDPqg1fnXXbXb1wRiB1Ep9Sg4_fC5oshhqm5xGQrI4Q-uLFaZJRo-G80tpZtTiSZjsjOc0c4z5t6r4h0kIUEjjH5PWSxxDhdu6bhpXcgRqyD3KgUaA-JoCKwm17LG4NPE-s9pkmVviM9gjJnsjNt84BRVXlRQ0VMH5WZUTbd1rA9nlSSCrZB0e646s8OlqWnW6qmK22lxVMs=w2102-h1178-no?authuser=0)

## Cloudwatch
Cloudwatch là một dịch vụ giám sát các nguồn tài nguyên cloud và ứng dụng chạy trên AWS (amazon web service). Bạn có thể sử dụng Cloudwatch để thu thập và theo dõi các số liệu thống kê, giám sát log file, và cài đặt cảnh báo (Giả sử giám sát lượng ram của máy chủ đang sử dụng, nếu quá 1 lượng nào đó, ví dụ là lượng ram sử dụng quá 90% thì sẽ thông báo đến 1 email cụ thể nào đó, để người đó có thể nắm bắt và có phương án để cứu chữa tình hình)

### Các metric mặc định của cloudwatch
Các metric này mặc định có sẵn khi tạo máy chủ EC2. Nên khong cần phải cài đặt gì. Chỉ cần vào [cloudwatch](https://console.aws.amazon.com/cloudwatch) chọn máy chủ EC2 là có thể xem được các metric của máy của EC2

![](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/metric%20mac%20dinh1.png_eph6eedoes)

### Cài đặt cloudwatch alarm CPU CPU Utilization
dùng cloudwatch alarm gửi thông báo tới sns khi cpu > 0 bằng cách thông báo bằng lambda

`Go to CloudWatch -> Alarm -> Create Alarm -> Select Metric ->EC2 -> CPU Utilization`

`Nhập thông số "Define the threshold value = 0" -> Next -> Select SNS topic -> Chọn topic ở phần hướng dẫn sns phía trên -> Create`

Sau khi tạo. nếu cpu trên 0 % thì nó sẽ alarm bằng sns tới lambda to slack. hoặc có thể gửi mail

 