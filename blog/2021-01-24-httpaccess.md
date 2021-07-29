---
slug: httpaccess
title: Nginx Protecting directories
author: congnt
author_title: BACKEND
author_url: https://github.com/ttl
author_image_url: https://user-images.githubusercontent.com/33750251/60287980-21aa2700-990b-11e9-9c9d-a79874587a86.png
tags: [facebook, hello, docusaurus]
---

## Log into your server via SSH.
Navigate to your user's directory.
Make sure you have a /etc/nginx/example.com directory. This doesn't exist by default; you must create it by running the following:
```
[server]$ mkdir -p nginx/example.com
```
## Add code in /etc/nginx/conf.d/default.conf
```
  location / {
    auth_basic "Restricted";
    auth_basic_user_file /home/username/nginx/example.com/.htpasswd;
  }
```

## Run the following to create the .htpasswd file:
```
[server]$ htpasswd -c /home/username/nginx/example.com/.htpasswd LOGIN

```

Reload the nginx config file.
