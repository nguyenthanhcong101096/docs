---
id: mina
title: Mina deploy
sidebar_label: Mina deploy
---

![](https://elmiyaagnesblog.files.wordpress.com/2016/06/mina.jpg?w=924&h=0&crop=1)

[Mina](http://nadarei.co/mina/) | [Github](https://github.com/mina-deploy/mina/tree/2608e50049cf21b1425c8bb7c3e5dd0e964b725f/docs)

## Step 1: New deploy user with sudo privileges
* ssh to server

```
sudo useradd -d /home/app -m app
sudo passwd app
```

* chỉnh phân quyền cho user deploy deploy ALL=(ALL:ALL)ALL

`sudo visudo`

## Step 2: Install Nginx

```
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install curl git-core nginx -y
```

## Step 3: Install Postgres & Create postgres user

* Install postgres

`sudo apt-get install postgresql postgresql-contrib libpq-dev`

* Create user in postgres

`sudo -u postgres createuser -s "user-name-data"`

* Set password

```
sudo -u postgres psql
\password "user-name-data"
```
* Creata database

```sudo -u postgres createdb -O "user-name-data" "database-name"```

## Step 4: Install rbenv & ruby & node & redis
> ...
> ...

## Step 5:  Setup SSH keys

`ssh -T git@github.com`

* Generate ssh key for own server

 `ssh-keygen -t rsa (/home/deploy/.ssh/id_rsa)`
* Add server key and local key to local agent

```
ssh-add ~/.ssh/id_rsa
ssh-add ~/.ssh/test-server.pem (is the public key of EC2)
```

* Add local's public key to server Copy local's public key at 

`cat ~/.ssh/id_rsa.pub`

Paste to file `~/.ssh/authorized_keys on server`

## Step 6: Mina Setup
* Include **mina** and **mina-puma** (pretend that we use puma as Rails server) in development group gem in **Gemfile**

**Gemfile**

```ruby
group :development do
  gem 'mina', require: false
  gem 'mina-puma', require: false
  gem 'mina-sidekiq', require: false
end
```

**config/deploy.rb**

* Run `bundle install` After that, run `mina init` to create **deploy.rb** file

```ruby
require 'mina/rails'
require 'mina/git'
require 'mina/rbenv'
require 'mina/puma'
require 'mina_sidekiq/tasks'

set :application_name, 'project_app'

task :staging do
  set :rails_env, 'staging'
  set :domain,    '127.0.0.1'
  set :user,      'app'
  set :branch,    'master'
end

task :production do
  set :rails_env, 'production'
  set :domain,    '127.0.0.1'
  set :user,      'app'
  set :branch,    'master'
end

set :deploy_to,  '/var/www/project_app/public_html'
set :repository, 'git@github.com:nguyenthanhcong101096/mina_rails.git'

set :port, '22'
set :forward_agent, true

set :shared_files, ['config/database.yml', 'config/master.key', ".env.#{fetch(:rails_env)}"]
set :shared_dirs, ['log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'bundle', 'public/packs', 'config/puma', 'node_modules', 'public/uploads']

set :bundle_bin,  "#{fetch(:rbenv_path)}/bin/rbenv exec bundle"
set :bundle_path, "#{fetch(:shared_path)}/bundle"

set :puma_config, "#{fetch(:shared_path)}/config/puma/#{fetch(:rails_env)}.rb"

set :sidekiq_log, "#{fetch(:shared_path)}/log/sidekiq.log"
set :sidekiq_pid, "#{fetch(:shared_path)}/tmp/pids/sidekiq.pid"

task :remote_environment do
  invoke :'rbenv:load'
end

task :setup do
end

desc 'Deploys the current version to the server.'
task :deploy do
  # uncomment this line to make sure you pushed your local branch to the remote origin
  # invoke :'git:ensure_pushed'
  deploy do
    invoke :'git:clone'
    # invoke :'sidekiq:quiet'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'

    on :launch do
      # invoke :'sidekiq:restart'
      invoke :'puma:hard_restart'
    end
  end
end

task :upload_file do
  run(:local) do
    command "scp package.json                        #{fetch(:user)}@#{fetch(:domain)}:#{fetch(:shared_path)}/package.json"
    command "scp config/master.key                   #{fetch(:user)}@#{fetch(:domain)}:#{fetch(:shared_path)}/config/master.key"
    command "scp config/database.yml                 #{fetch(:user)}@#{fetch(:domain)}:#{fetch(:shared_path)}/config/database.yml"
    command "scp .env.#{fetch(:rails_env)}           #{fetch(:user)}@#{fetch(:domain)}:#{fetch(:shared_path)}/.env.#{fetch(:rails_env)}"
    command "scp config/puma/#{fetch(:rails_env)}.rb #{fetch(:user)}@#{fetch(:domain)}:#{fetch(:shared_path)}/config/puma/#{fetch(:rails_env)}.rb"
  end

  run(:local) do
    command 'say "Done!"'
  end
end

task :log do
  in_path(fetch(:deploy_to)) do
    command "tail -f shared/log/#{fetch(:rails_env)}.log"
  end
end

task :console do
  in_path(fetch(:current_path)) do
    command %{#{fetch(:rails)} console}
  end
end

namespace :db do
  desc 'Seed the database.'
  task :seed do
    in_path(fetch(:current_path)) do
      command "RAILS_ENV=#{fetch(:rails_env)} #{fetch(:bundle_bin)} exec rake db:seed"
    end
  end

  desc 'Migrate database'
  task :migrate do
    in_path(fetch(:current_path)) do
      command "RAILS_ENV=#{fetch(:rails_env)} #{fetch(:bundle_bin)} exec rake db:migrate"
    end
  end

  desc 'Reset database'
  task :reset do
    in_path(fetch(:current_path)) do
      command "RAILS_ENV=#{fetch(:rails_env)} #{fetch(:bundle_bin)} exec rake db:drop db:create"
    end
  end
end
```

* First deploy

`mina staging setup`

`mina staging upload_file`

* Then

`mina staging deploy`

* create master.key
`bundle exec rails credentials:edit`
