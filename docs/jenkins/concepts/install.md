---
sidebar_position: 1
---
# Installation Jenkins

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="centos"
  values={[
    { label: 'Centos', value: 'centos' },
    { label: 'Ubuntu', value: 'ubuntu' },
  ]
}>
<TabItem value="centos">

- Java installation

```s
yum install -y java-1.8.0-openjdk-devel.x86_64
alternatives --config java
java -version
```

- Jenkins install

```s
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
yum install -y jenkins
```

- Start Jenkins

```
systemctl start jenkins
```

- Setting password

```s
cat /var/lib/jenkins/secrets/initialAdminPassword
```

</TabItem>
<TabItem value="ubuntu">

- Java installation

```s
apt install openjdk-11-jdk -y
```

- Jenkins install

```
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
```

```
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

```
sudo apt update
sudo apt install jenkins

```

- Start Jenkins

```
service jenkins start
```

- Setting password

```s
cat /var/lib/jenkins/secrets/initialAdminPassword
```
</TabItem>
</Tabs>

![](https://res.cloudinary.com/ttlcong/image/upload/v1628568475/image-docs/JenkinsMainLogin2.123020.png)

- Chọn suggested plugins

![](https://res.cloudinary.com/ttlcong/image/upload/v1628568277/image-docs/JenkinsMainLogin3.123020.jpg)

![](https://res.cloudinary.com/ttlcong/image/upload/v1628568556/image-docs/JenkinsMainLogin1.123020.png)
