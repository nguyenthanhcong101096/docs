---
slug: balancer
title: Sử dụng NGINX làm load balancer
author: congnt
author_title: BACKEND
author_url: https://github.com/ttl
author_image_url: https://user-images.githubusercontent.com/33750251/60287980-21aa2700-990b-11e9-9c9d-a79874587a86.png
tags: [facebook, hello, docusaurus]
---

## Sử dụng NGINX làm load balancer
Sử dụng 3 server đều cài nginx

```ruby
instance loadbalance: docker run -p 22:22 --name=loadbalance -p 22:22 -p 80:80 congttl/ubuntu:latest
instance webserver1:  docker run -p 22:22 --name=webserver1  -p 23:22 -p 81:80 congttl/ubuntu:latest
instance webserver2:  docker run -p 22:22 --name=webserver2  -p 24:22 -p 80:80 congttl/ubuntu:latest
```

Cả 2 webserver 1 và 2 điều chứa src code

>Công việc của chúng ta là cấu hình sao cho khi người dùng truy cập vào vhost thì Master server sẽ điều hướng tới một trong hai Backend server, đồng thời không để mất session người dùng.


## Cấu hình Upstream trên instance master
Để bắt đầu sử dụng NGINX với một nhóm các máy chủ web, đầu tiên, bạn cần khai báo upstream group.

trong file /etc/nginx/site-avaliables/default

```ruby
upstream backend {
  server: webserver1 -> chúng ta có thể thay bằng địa chỉ IP tương ứng
  server: webserver2 -> chúng ta có thể thay bằng địa chỉ IP tương ứng
}
```

Để truyền cái request từ người dùng vào một group server, tên của group được truyền vào với direct `proxy_pass` hoặc `(fastcgi_pass, memcached_pass, uwsgi_pass, scgi_pass)` tùy thuộc vào giao thức

```
server {
  location / {
    proxy_pass http://backend
  }
}
```

Kết hoặc lại 

```
upstream backend {
    server backend1;
    server backend2;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

### Lựa chọn thuật toán cân bằng tải
Có rất nhiều thuật toán cho mọi người lựa chọn như round-robin, least_conn, least_time, ip_hash, ...

> Trong bài viết này mình lựa chọn round-robin: Các request lần lượt được đẩy về 2 server webserver1 và webserver2 theo tỉ lệ dựa trên server weights, ở đây là 1:1

```
upstream backend {
  server webserver1;
  server webserver2;
}
```

### Bảo toàn session người dùng
Hãy thử tưởng tượng bạn có một ứng dụng yêu cầu đăng nhập, nếu khi đăng nhập, session lưu trên Webserver 1, sau một hồi request lại được chuyển tới Webserver 2, trạng thái đăng nhập bị mất, hẳn là người dùng sẽ vô cùng nản

Để giải quyết vấn đề này, chúng ta có thể lưu session vào memcached hoặc redis.
Nhưng đơn giản chỉ vì việc đồng bộ hóa session giữa 2 server memcached diễn ra quá chậm, bị ảnh hưởng bởi yếu tố Network, I/O

Nhanh gọn hơn NGINX có cung cấp `sticky directive`, giúp NGINX tracks user sessions và đưa họ tới đúng upstream server.

Tuy nhiên, vấn đề ở chỗ NGINX chỉ cung cấp giải pháp này cho phiên bản thương mại: NGINX Plus mà chúng ta buộc phải bỏ tiền ra mua
[Tham khảo:](https://www.nginx.com/products/session-persistence/)


Theo một hướng khác, tại sao ta ko dùng ip_hash làm phương thức cân bằng tải ??

- Hash được sinh từ 3 chỉ số đầu của một IP, do đó tất cả IP trong cùng C-class network sẽ đc điều hướng tới cùng một backend.
- Tất cả user phía sau một NAT sẽ truy cập vào cùng một backend.
- Nếu ta thêm mới một backend, toàn bộ hash sẽ thay đổi, đương nhiên session sẽ mất.

Sau khi tham khảo các bài viết trên mạng thì mình tìm được hướng giải quyết như sau:

```
upstream backend {
    server backend1;
    server backend2;
}
map $cookie_backend $sticky_backend {
    backend1 backend1;
    backend2 backend2;
    default backend;
}
server {
    listen 80;
    server_name localhost;
    location / {
        set $target http://$sticky_backend;
        proxy_pass $target;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Step 1**: Khi user lần đầu tiên truy cập vào Master server, lúc đó sẽ ko có backend cookie nào được đưa ra, và dĩ nhiên $sticky_backend NGINX variable sẽ được chuyển hướng tới upstream group. Trong trường hợp này , request sẽ được chuyển tới Backend 1 hoặc Backend 2 theo phương thức round robin.

**Step 2**: Trên các webserver Backend 1 và Backend 2, ta cấu hình ghi các cookie tương ứng với mỗi request đến:

```
server {
    listen 80 default_server;
    ...
    location ~ ^/.+\.php(/|$) {
        add_header Set-Cookie "backend=backend1;Max-Age=3600";
        ...
    }
}

server {
    listen 80 default_server;
    ...
    location ~ ^/.+\.php(/|$) {
        add_header Set-Cookie "backend=backend2;Max-Age=3600";
        ...
    }
}
```

Dễ thấy nếu request được pass vào backend nào, thì trên client của user sẽ ghi một cookie có name=backend & value=backend1 or backend2 tương ứng.

**Step 3**: Mỗi khi user request lại tới Master, NGINX sẽ thực hiện map $cookie_backend với $sticky_backend tương ứng và chuyển hướng người dùng vào server đó qua proxy_pass.

### Health checks
Health checks là thực liên tục việc kiểm tra các server trên upstream được khai báo trong config của bạn để tránh việc điều hướng các request của người dùng vào các server không hoạt động. Tóm lại là việc này nhằm đảm bảo người dùng không nhìn thấy các page thông báo lỗi khi chúng ta tắt đi 1 server nào đó, hoặc server nào đó đột xuất bị lỗi không hoạt động.

```
upstream backend {
    server backend1 max_fails=3 fail_timeout=10s;
    server backend2 max_fails=3 fail_timeout=10s;
}
```

Việc điều hướng tới server nào đang nắm giữ session dựa vào $sticky_backend, tuy nhiên nếu $sticky_backend=backend1 mà server backend 1 ra đi thì sao ? lúc này ta buộc phải chuyển hướng các user ở backend 1 sang các server backend còn lại. Ở đây mình trigger event set lại $sticky_backend sang server khác khi có lỗi Gateway Time-out xảy ra trên proxy server.

```
upstream backend {
    server backend1;
    server backend2;
}
...
server {
    listen 80;
    server_name localhost;
    location / {
        set $target http://$sticky_backend;
        proxy_pass $target;
        ...
        # 504 Gateway Time-out
        error_page 504 = @backend_down;
    }

    location @backend_down {
      proxy_pass http://backend;
    }
}
```

**Tổng hợp lại file nginx default**

```
upstream webserver {
    server webserver_1 max_fails=3 fail_timeout=10s;
    server webserver_2 max_fails=3 fail_timeout=10s;
}

map $cookie_backend $sticky_backend {
    backend1 webserver_1;
    backend2 webserver_2;
    default webserver;
}

server {
    listen 80;

    server_name localhost;

    location / {
        resolver 127.0.0.1;
        set $target http://$sticky_backend;
        proxy_pass $target;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5;

        # 504 Gateway Time-out
        error_page 504 = @backend_down;
    }

    location @backend_down {
      proxy_pass http://webserver;
    }
}
```
