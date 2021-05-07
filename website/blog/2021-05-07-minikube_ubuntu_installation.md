---
title: Minikube Installation on Ubuntu 16.04 LTS
author: Congnt
authorURL: http://twitter.com/ericnakagawa
authorFBID: 661277173
---

# Minikube Installation on Ubuntu 16.04 LTS

Overview:
1. Install hypervisor (Virtualbox)
2. Get and install Kubectl (repositories)
3. Get and install Minikube last version
4. Start and Test Minikube local cluster and expose demo service


### Install VirtualBox hypervisor
We will install virtualbox 5.* via official reposiories

```
$ sudo apt-get update
$ sudo apt remove virtualbox*
$ wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -
$ wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo apt-key add -
$ sudo su
$ echo "deb https://download.virtualbox.org/virtualbox/debian xenial contrib" >> /etc/apt/sources.list
$ apt-get update
$ sudo apt-get install virtualbox virtualbox-ext-pack
```

### Install Kubectl
We will install kubectl from official repositories. Recommened so you will get updates via apt.

```
$ sudo apt-get update && sudo apt-get install -y apt-transport-https
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
$ sudo touch /etc/apt/sources.list.d/kubernetes.list 
$ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
$ sudo apt-get update && sudo apt-get install -y kubectl
$ kubectl version
```

### Install Minikube
Download minukube binary directly from Google repositories.
```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
$ sudo mv -v minikube /usr/local/bin
$ minikube version
$ exit
```

### Start Kubernetes Cluster loccally with Minikube
Create and run Kubernetes cluster. This will take some few minutes depending on your Internet connection.
```
$ minikube start
```

### Test Kubernetes service
We test our cluster running a demo service
```
$ kubectl cluster-info
$ kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080
$ kubectl expose deployment hello-minikube --type=NodePort
$ kubectl get services
$ minikube service hello-minikube --url
$ minikube dashboard
$ kubectl delete service hello-minikube
$ kubectl delete deployment hello-minikube
$ minikube stop
```

### Adds Kubectl command 'k' alias to bash (optional)
Using command aliases for minikube and kubectl, example: "mk start", "k get po". Note: You need to restart
your bash terminal to see aliases working.

```
$ echo "alias k='kubectl'" >> ~/.bash_aliases
$ echo "alias mk='minikube'" >> ~/.bash_aliases
```
### Documentation Reference
Some documentation and tutorials

- https://kubernetes.io/docs/tasks/tools/install-minikube/
- https://kubernetes.io/docs/tasks/tools/install-kubectl/
- https://linuxhint.com/install-minikube-ubuntu/
- https://askubuntu.com/questions/17536/how-do-i-create-a-permanent-bash-alias
- https://websiteforstudents.com/install-virtualbox-latest-on-ubuntu-16-04-lts-17-04-17-10/
