---
sidebar_position: 3
---

# Simple Email Service

![](http://phanmemsaigon.net/wp-content/uploads/2015/02/bao-cao-1.png)

- **Deliveries**: lượng email đã được gửi đi trong ngày.
- **Bounces**: Tỷ lệ email không tồn tại hoặc không nhận email từ Amazon. (Bounce Rate là gì?)
- **Rejects**: Tỷ lệ những email từ chối nhận email từ bạn.
- **Complaints**: Tỷ lệ đánh dấu email của bạn là spam.

## Go to SES in dashboard
![](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/06/1466528569ses_home.png)

## Generate DKIM Settings
- Tại SES Home, ta chọn `Domains => Verify This Domain`, nhập tên miền của bạn vào mục Domain và tích vào ô `Generate DKIM Settings`, nhập xong click vào Verify This Domain.

![](https://hocmangmaytinh.com/wp-content/uploads/2017/11/verify-a-new-domain-amazon-ses-768x321.png)

- Sau đó sẽ hiện ra các bản ghi các bạn thiết lập đầy đủ các bản ghi này vào trang quản lý tên miền của bạn. Nếu bạn dùng CloudFlare thì bạn phải thiết lập trên **godaddy** mà không cần phải thiết lập trên trang quản lý tên miền nơi bạn mua.

![](https://lh3.googleusercontent.com/8GHV7SP3gbui2xa_jPUNSAmED0QnSYIfXtgObWeqpBpXg2Obph9NiA3ogzC__Npww-msMfU8fhponeEQpWY3KzCbS3t1eCwqBRUAbsKDIMaSvm4aAoF4-mmbdxfXuCaZE4urDwSDopQYyS-KSBbZ5MkX421Rw-Ed0063r0sRd8aYJUhf6N9NGmrMQZYjTUe2k-WF2uJHbpOSebwOeTzHh2xv3cSY5lZwrgXCJx-ggb8hjTNYVpNwjx7CjsA8NlNBCoRBmseHoDKypu2CYeMSO1Lr4HmMbN5egW2yIV9qkd25LjMhqa7lq_qKKb7F8lEs-d6XIE_qWFOhg-pljMPVXyOJ1d45wtgClQlVKujwgNTd6TK2BZgMV3WYtdMs4YQlh34sgXREo3LD5s1_q6GXC_PjqKOVaJRtBBf6PAs3fTCoOhAzWC4XG7ZbmvVW_uw-greJ1_rhYiK8tZ632D3MIsZLclhxJGBLjiPSF8V4h9h-rUZ3aMzSr2VXlg8P408WitWwobXEySH8wew_U16VBelLSkpnhG3HFMPV5ANyChm8kSduoZj5JdxXMPhSNg-2ztijcNhfL3DivuJk6tn8hZ3wNucAgSBMsAzRd13v_x9gsSalAFfcgpyeAcjvlqQTcN2NhHVm3dztWsyqrdHWNrm07V7YC3WiHZmzw72I-ztn78ChWwphoVEftvHdYJs=w2314-h1370-no?authuser=0)

- Sau khi thiết lập xong bản ghi bạn sẽ nhận được một email thông báo đã xác thực domain thành công và trên SES Home như bên dưới.



- Tiếp theo bạn hãy xác thực địa chỉ email, ta chon `Email Addresses => Verify This Email Address`, nhập email vào tại mục Email Address, sau đó chọn `Verify This Email Address.`

## Request send limit increase

> With sandbox access you can only send email to the Amazon SES mailbox simulator and to email addresses or domains that you have verified. To be moved out of the sandbox

Nội dung request example

```
Use case description: My name is Nguyen Thanh Cong. I am a backend engineer in ABC company. Until now I am working on the company project for 3 websites. Based on that, I hope to set the New limit value of 40000 to enhance user’s experience and send newsletters to them by using your service. 
I have been using Gmail but now my plan is using SES for supporting better to customer. 
Because I am using Ruby on Rails for managing all the websites, so: 
The types of email that your site will be sending are: 
+ Notification about registering.
+ Sending receipt of process notification when customer buying on website.
+ Newsletters when customer registered to receive (maximum 2 emails per week and users can be unsubscribe any time - I know spam mail is really annoying).
+ Help users to manage their information when they use our websites.
```

- Sau khi request thì chúng ta có thể send mail **50000mail/per day**

## Tạo User name và Password cho SMTP
- Sau khi bạn đã `verify` thành công `domain` và `email` trên Amazon SES, tiến hành cấu hình gửi mail với SMTP của Amazon SES.

Tại SES Home, ta chọn `SMTP Settings => Create My SMTP Credentials`

![](https://hocmangmaytinh.com/wp-content/uploads/2017/11/create-my-smtp-credentials.png)

Hệ thống sẽ chuyển ta tới bước tạo một `IAM` mới, ta nhập tên user name cho `IAM` tại mục `IAM User Name`, click `Create`.

![](https://hocmangmaytinh.com/wp-content/uploads/2017/11/iam-user-name.png)

**SMTP Amazon SES bao gồm:**

- **Server Name**: email-smtp.us-east-1.amazonaws.com
- **Port**: 25, 465 or 587
- **Use Transport Layer Security (TLS)**: Yes
- **Authentication**: User name và Password đã tạo ở trên.

## Config rails app
- Add `gem 'aws-sdk-rails'` and `bundle install`
- config/action_mailer.rb

```
# frozen_string_literal: true

return if Rails.env.test?

Rails.application.config.action_mailer.asset_host            = ENV['APP_HOST']
Rails.application.config.action_mailer.perform_deliveries    = true
Rails.application.config.action_mailer.default_options       = { from: "#{ENV['APP_NAME']} <no-reply@domain.com>" }
Rails.application.config.action_mailer.delivery_method       = Rails.env.development? ? :letter_opener : :aws_sdk
Rails.application.config.action_mailer.default_url_options   = { host: ENV['APP_DOMAIN'], protocol: ENV['PROTOCOL'] }
Rails.application.config.action_mailer.raise_delivery_errors = Rails.env.development?

case Rails.application.config.action_mailer.delivery_method
when :smtp
  Rails.application.config.action_mailer.smtp_settings = {
    address: ENV['SES_ADDRESS'],
    port: 587,
    user_name: ENV['SES_USERNAME'],
    password: ENV['SES_PASSWORD'],
    authentication: :login,
    enable_starttls_auto: true
  }
when :aws_sdk
  credentials = Aws::Credentials.new(ENV['AWS_ACCESS_KEY'], ENV['AWS_SECRET_KEY'])
  Aws::Rails.add_action_mailer_delivery_method(:aws_sdk, credentials: credentials, region: 'ap-southeast-2')
end
```

**ENV**

```
APP_NAME=App name
APP_HOST=https://domain.com
APP_DOMAIN=domain.com
PROTOCOL=https

SES_ADDRESS=email-smtp.<region>.amazonaws.com
SES_USERNAME=<STMP_USER>
SES_PASSWORD=<STMP_PASSWORD>

AWS_ACCESS_KEY=<IAM ACCESS>
AWS_SECRET_KEY=<IAM SECRET>
```

admin_mailer.rb

```ruby
class AdminMailer < ApplicationMailer
  def create(admin)
    mail(to: @admin.email, subject: 'Invitation from ABC')
  end
end
```
