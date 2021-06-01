---
title: Setup Ingress Controller on Kubernetes Cluster v1.19.3
author: Congnt
authorURL: http://twitter.com/ericnakagawa
authorFBID: 661277173
---
# Setup Ingress Controller on Kubernetes Cluster v1.19.3
### Prerequisites
Clone the Ingress controller repo and change into the deployments folder:

```
git clone https://github.com/nginxinc/kubernetes-ingress/
cd kubernetes-ingress/deployments
git checkout v1.9.0
```

### Configure RBAC

```
# Create a namespace and a service account for the Ingress controller:
kubectl apply -f common/ns-and-sa.yaml

# Create a cluster role and cluster role binding for the service account:
kubectl apply -f rbac/rbac.yaml
```

### Create Common Resources
```
# Create a secret with a TLS certificate and a key for the default server in NGINX
kubectl apply -f common/default-server-secret.yaml

# Create a config map for customizing NGINX configuration
kubectl apply -f common/nginx-config.yaml

# Create an IngressClass resource (for Kubernetes >= 1.18)
kubectl apply -f common/ingress-class.yaml
```

### Check and Deploy
Check IP adress of `ec2-node` on browser will return `nginx page 404`

```
kubectl get ns
kubectl get pod --namespace nginx-ingress
kubectl apply -f app.yml

# if you have error for admission 443
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```


File app.yml
```yml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: hotel-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: reviewphim.today
    http:
      paths:
      - path: /
        backend:
          serviceName: demo-ingress
          servicePort: 80

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docs
spec:
  replicas: 2
  selector:
    matchLabels:
      app: docs
  template:
    metadata:
      labels:
        app: docs
    spec:
      containers:
      - name: docs
        image: congttl/docs:latest
        ports:
        - containerPort: 3000

---
apiVersion: v1
kind: Service
metadata:
  name: demo-ingress
spec:
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: docs
```

### Refs
[nginx-ingress-controller](https://docs.nginx.com/nginx-ingress-controller/installation/installation-with-manifests/)

[how-to-set-up-an-nginx-ingress](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm)

[https://www.youtube.com/watch?v=o6gxAsgWdBM](https://github.com/vipin-k/Ingress-Controller-v1.9.0)
