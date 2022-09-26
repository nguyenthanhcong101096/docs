---
sidebar_position: 4
---
# Rails deploy by puma
## Cài đặt project
- Chúng ta sẽ clone mã nguồn project về instance

cài đặt dự án
```
git clone https://github.com/username/projectname
```

cài đặt config/puma.rb sau đó run rails server
```ruby
# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
#
app_path = '/home/app/deploy'

max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
#
worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
#
port ENV.fetch("PORT") { 3000 }

# Specifies the `environment` that Puma will run in.
#
environment ENV.fetch("RAILS_ENV") { "development" }

# Specifies the `pidfile` that Puma will use.
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

pidfile "#{app_path}/tmp/pids/puma.pid"

state_path "#{app_path}/tmp/pids/puma.state"

stdout_redirect "#{app_path}/log/stdout", "#{app_path}/log/stderr", true

threads 5, ENV.fetch('RAILS_MAX_THREADS') { 5 }

bind "unix://#{app_path}/tmp/sockets/puma.sock"

# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked web server processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
#
# workers ENV.fetch("WEB_CONCURRENCY") { 2 }

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory.
#
# preload_app!

# Allow puma to be restarted by `rails restart` command.
plugin :tmp_restart
```

## Cài đặt webserver
cài đặt nginx
```
sudo apt-get install nginx
```

config file /sites-avaliable/default và restart `sudo service nginx restart`
```bash
# log directory
#error_log  /etc/nginx/log/error.log;
#access_log /etc/nginx/log/access.log;

upstream app_server {
    # for UNIX domain socket setups
    server unix:///home/app/deploy/tmp/sockets/puma.sock fail_timeout=0;
}

server {
    listen 80;
    server_name localhost;

    # path for static files
    root /home/app/deploy/public;

    # page cache loading
    try_files $uri/index.html $uri @app_server;

    location / {
        # If requested files exists serve them
        try_files $uri $uri @app;
    }

    location @app {
        # When nginx should return maintenance page?
        # - when tmp/maintenance.txt file exists
        if (-f $document_root/../tmp/maintenance.txt) {
            set $maint_mode 1;
        }
        if ($remote_addr = 127.0.0.1) {
            set $maint_mode 0;
        }
        if ($maint_mode) {
            return 503;
        }

        # HTTP headers
        proxy_pass http://app_server;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
    }

    # Maintenance page
    error_page 503 /maintenance.html;
    location /maintenance.html {
        if (!-f $request_filename) {
            rewrite ^(.*)$ /maintenance.html break;
        }
    }

    # Error pages
    error_page 500 502 504 /500.html;
    location = /500.html {
        root /home/app/deploy/public;
    }
    error_page 404 /404.html;
    location = /404.html {
        root /home/app/deploy/public;
    }

    client_max_body_size 4G;
    keepalive_timeout 10;
}
```

## Script restart rails

Create file deploy.sh và run `chomd +x deploy.sh`
```bash
#!/bin/bash

PROJECT_PATH=/home/app/deploy

cd  ${PROJECT_PATH}

rm -f ${PROJECT_PATH}/tmp/pids/puma.pid
rm -f ${PROJECT_PATH}/tmp/pids/puma.state
rm -f ${PROJECT_PATH}/tmp/sockets/puma.sock

kill -9 $(lsof -i:3000 -t)

bundle check || bundle install

bundle exec rails db:migrate

./bin/webpack

rails s
```

update code rails restart rails `./deploy.sh`


Truy cập localhost và thấy kết quả

## Run sidekiq on deamon
cd `/usr/lib/systemd/system`
touch `sidekiq.service`

```sh
# /lib/systemd/system/sidekiq.service
[Unit]
Description=sidekiq
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=/path/to/your/app

# If you use rbenv:
# ExecStart=/bin/bash -lc 'exec /home/deploy/.rbenv/shims/bundle exec sidekiq -e production'
# If you use the system's ruby:
# ExecStart=/usr/local/bin/bundle exec sidekiq -e production
# If you use rvm in production without gemset and your ruby version is 2.6.5
# ExecStart=/home/deploy/.rvm/gems/ruby-2.6.5/wrappers/bundle exec sidekiq -e production
# If you use rvm in production with gemset and your ruby version is 2.6.5
# ExecStart=/home/deploy/.rvm/gems/ruby-2.6.5@gemset-name/wrappers/bundle exec sidekiq -e production
# If you use rvm in production with gemset and ruby version/gemset is specified in .ruby-version,
# .ruby-gemsetor or .rvmrc file in the working directory
ExecStart=/home/deployer/.rvm/bin/rvm in /path/to/your/app/current do bundle exec sidekiq -e production

User=deployer
Group=deployer
UMask=0002

# Greatly reduce Ruby memory fragmentation and heap usage
# https://www.mikeperham.com/2018/04/25/taming-rails-memory-bloat/
Environment=MALLOC_ARENA_MAX=2

# if we crash, restart
RestartSec=1
Restart=on-failure

# output goes to /var/log/syslog
StandardOutput=syslog
StandardError=syslog

# This will default to "bundler" if we don't specify it
SyslogIdentifier=sidekiq

[Install]
WantedBy=multi-user.target
```

Command

```
# reload serivces
sudo systemctl daemon-reload
# enable the sidekiq.service so it will start automatically after rebooting
sudo systemctl enable sidekiq.service
# start the sidekiq
sudo service sidekiq start
# we can check the log in /var/log/syslog
sudo cat /var/log/syslog
# we can check if Sidekiq is started
sudo ps aux | grep sidekiq
# or
sudo systemctl status
```


## Run puma on deamon

- touch `/lib/systemd/system/puma.service`
```
# /lib/systemd/system/puma.service
[Unit]
Description=Puma rails server
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=/home/spa
ExecStart= /root/.rbenv/shims/puma -C /home/spa/config/puma.rb
#ExecStart=/bin/bash -lc 'exec /root/.rbenv/shims/bundle exec puma -e delevelopment -C /home/spa/config/puma.rb'

User=root
Group=root
UMask=0002

# Greatly reduce Ruby memory fragmentation and heap usage
# https://www.mikeperham.com/2018/04/25/taming-rails-memory-bloat/
Environment=MALLOC_ARENA_MAX=2

# if we crash, restart
RestartSec=1
Restart=on-failure

# output goes to /var/log/syslog
StandardOutput=/var/log/syslog
StandardError=/var/log/syslog

# This will default to "bundler" if we don't specify it
#SyslogIdentifier=sidekiq

[Install]
WantedBy=multi-user.target
```
