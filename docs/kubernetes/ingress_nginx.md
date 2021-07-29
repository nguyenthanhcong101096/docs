---
sidebar_position: 10
---
# Ingress nginx
## Setup ingress nginx
### Prerequisites
Clone the Ingress controller repo and change into the deployments folder:

```
git clone https://github.com/nginxinc/kubernetes-ingress/
cd kubernetes-ingress/deployments
git checkout v1.11.3
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

### Create Custom Resources
```
# Create custom resource definitions for VirtualServer and VirtualServerRoute, TransportServer and Policy resources:
kubectl apply -f common/crds/k8s.nginx.org_virtualservers.yaml
kubectl apply -f common/crds/k8s.nginx.org_virtualserverroutes.yaml
kubectl apply -f common/crds/k8s.nginx.org_transportservers.yaml
kubectl apply -f common/crds/k8s.nginx.org_policies.yaml
```

### Deploy the Ingress Controller
We include two options for deploying the Ingress controller

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="deploy"
  values={[
    { label: 'Deployment', value: 'deploy' },
    { label: 'Daemon Set', value: 'daemon_set' },
  ]
}>
<TabItem value="deploy">

Use a Deployment if you plan to dynamically change the number of Ingress controller replicas.

> When you run the Ingress Controller by using a Deployment, by default, Kubernetes will create one Ingress controller pod.

```
kubectl apply -f deployment/nginx-ingress.yaml
```

##### Get Access to the Ingress Controller
- Use a NodePort service

```
kubectl create -f service/nodeport.yaml
```

- Use a LoadBalancer service

```
# For GCP or Azure, Digitalocean
kubectl apply -f service/loadbalancer.yaml

# For AWS
kubectl apply -f service/loadbalancer-aws-elb.yaml
```

</TabItem>
<TabItem value="daemon_set">

Use a DaemonSet for deploying the Ingress controller on every node or a subset of nodes.

> When you run the Ingress Controller by using a DaemonSet, Kubernetes will create an Ingress controller pod on every node of the cluster.

```
kubectl apply -f daemon-set/nginx-ingress.yaml
```

##### Get Access to the Ingress Controller
> ports 80 and 443 of the Ingress controller container are mapped to the same ports of the node where the container is running. To access the Ingress controller, use those ports and an IP address of any node of the cluster where the Ingress controller is running.


</TabItem>
</Tabs>

### Check and Deploy
Check IP adress of `ec2-node` on browser will return `nginx page 404`

```
kubectl get pod --namespace nginx-ingress
kubectl get svc nginx-ingress --namespace=nginx-ingress

# if you have error for admission 443
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```

File app.yml
```yml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: demo-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
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
  - name: http
    port: 80
    targetPort: 3000
  - name: https
    port: 443
    targetPort: 3000
  selector:
    app: docs
```

### Uninstall the Ingress Controller
```
kubectl delete namespace nginx-ingress
kubectl delete clusterrole nginx-ingress
kubectl delete clusterrolebinding nginx-ingress
```

## Setup cert-manager

## Refs
[nginx-ingress-controller](https://docs.nginx.com/nginx-ingress-controller/installation/installation-with-manifests/)

[how-to-set-up-an-nginx-ingress](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm)

[https://www.youtube.com/watch?v=o6gxAsgWdBM](https://github.com/vipin-k/Ingress-Controller-v1.9.0)
