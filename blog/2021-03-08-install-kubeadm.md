---
slug: kubeadm
title: Steps to Install Kubeadm on Ubuntu
author: congnt
author_title: BACKEND
author_url: https://github.com/ttl
author_image_url: https://user-images.githubusercontent.com/33750251/60287980-21aa2700-990b-11e9-9c9d-a79874587a86.png
tags: [facebook, hello, docusaurus]
---

# Steps to Install Kubernetes on Ubuntu
## Set up Docker
**Step 1**: Install Docker
Kubernetes requires an existing Docker installation

```sh
sudo apt-get update

sudo apt-get install docker.io

sudo systemctl enable docker

sudo systemctl status docker

sudo systemctl start docker
```

## Install Kubernetes
```
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add

sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"

sudo apt-get install kubeadm kubelet kubectl

sudo apt-mark hold kubeadm kubelet kubectl
```

## Kubernetes Deployment
```
sudo swapoff –a

sudo kubeadm init --pod-network-cidr=10.244.0.0/16

mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config

sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```
