---
sidebar_position: 2
---
# Quick Preview
## Đặt vấn đề
Trong hướng dẫn này, chúng tôi muốn thiết lập hai máy chủ web: `test` và `prod`, trên AWS. Chúng tôi sẽ cài đặt Nginx và cấu hình các môi trường. Sau đó chúng tôi sẽ triển khai một ứng dụng.

## Chuẩn bị
### Instance
```
# server test
docker run -d --name="test" -p 22:22 80:80 congttl/ubuntu

# server production
docker run -d --name="production" -p 21:22 81:80 congttl/ubuntu
```

### Local Ansible install
```bash
k@laptop:~$ sudo apt-get install ansible

k@laptop:~$ ansible --version
ansible 2.0.0.2
  config file = /etc/ansible/ansible.cfg
  configured module search path = Default w/o overrides
```

### Creating a playbook
- Ansible mặc định inventory file `(/etc/ansible/hosts)`

- create file hosts

```yml title="hosts"
[test]
52.54.142.56

[prod]
18.209.15.95
```

**Connection test with Ansible basic command**

```
$ ans@laptop:~$ ansible -i hosts all -m ping -u ubuntu
52.54.142.56 | SUCCESS => {
    "changed": false, 
    "ping": "pong"
}
18.209.15.95 | SUCCESS => {
    "changed": false, 
    "ping": "pong"
}
```
- Giải thích
  - `"-i"` is for inventory, and we want to test all.
  - `"-m"` is for command, and we used ping.
  - `"-u"` specifies the user, and in our case, it's ubuntu.


**Create simple ansibale playbook**

```yml title="ansible-playbook.yml"
- hosts: all
  gather_facts: False

  vars:
   - MyMessage: "Welcome to Ansible world!"

  pre_tasks:
  - name: install python 2
    raw: test -e /usr/bin/python || (apt -y update && apt install -y python-minimal)

  tasks:
   - name: Nginx setup
     apt: pkg=nginx state=installed update_cache=true
   - name: index.html copy
     template: src=index.html.j2 dest=/usr/share/nginx/html/index.html
```

- chạy tasks trong playbook

```
ans@laptop:~$ ansible-playbook -i hosts -s -u ubuntu ansible-playbook.yml

PLAY ***************************************************************************

TASK [install python 2] ********************************************************
ok: [52.54.142.56]
ok: [18.209.15.95]

TASK [Nginx setup] *************************************************************
changed: [18.209.15.95]
changed: [52.54.142.56]

TASK [index.html copy] *********************************************************
changed: [52.54.142.56]
changed: [18.209.15.95]

PLAY RECAP *********************************************************************
18.209.15.95               : ok=3    changed=2    unreachable=0    failed=0   
52.54.142.56               : ok=3    changed=2    unreachable=0    failed=0   
```

![](https://www.bogotobogo.com/DevOps/Ansible/images/AnsibleDemo/UpdatedPage.png)
