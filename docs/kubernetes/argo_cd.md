---
sidebar_position: 43
---

# Argo continuous delivery

![](https://ichi.pro/assets/images/max/724/1*9q37KuHZFWC7XOZRSQpJ6Q.png)

## Argocd Setup
### Before start
- Install Kubernetes
- Install [nginx-ingress](https://github.com/nguyenthanhcong101096/docs/blob/master/docs/kubernetes/ingess_cert_manger.md) or haproxy
- [Helm Chart](https://github.com/nguyenthanhcong101096/helm_chart)
### Argo CD Setup
- Install by Helm
```
kubectl create namespace argocd

helm repo add argo https://argoproj.github.io/argo-helm
```

- Install by Manual
```
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Argo CD Access
create file `values.yml`

```
installCRDs: false
server:
  extraArgs:
  - --insecure
  service:
    type: ClusterIP
  ingress:
    enabled: false
    annotations:
      - kubernetes.io/ingress.class: nginx
      - nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
      - nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    hosts:
      - argocd.mydomina.com
    paths:
      - /
```

create ingress `argocd-ingress.yml`

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-argocd
  namespace: argocd
spec:
  ingressClassName: nginx
  rules:
  - host: argocd.mydomina.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 80
```

```
helm install argocd -n argocd argo/argocd --values values.yaml

kubectl apply -f argocd-ingress.yml

kubectl get ingress -n argocd
```

Now access in browser with url `argocd.mydomina.com`

Login

```
# By Web
user: admin
get passowrd: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d


# By CLI
kubectl get pods -n argocd -l app.kubernetes.io/name=argocd-server -o name | cut -d'/' -f 2

argocd login <ARGOCD_SERVER>  # e.g. localhost:8080 or argocd.example.com
```

Change Passowrd Account
```
argocd account update-password
```

### ArgoCD Application
Create project on ArgoCD

```
# create file my-argo.yml

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: docomo-pfm-web
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/yourname/repo.git
    targetRevision: HEAD
    path: ./ #path file manifest
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
```

`kubectl apply -f my-argo.yml`

Via CLI
```
argocd app create guestbook --repo https://github.com/argoproj/argocd-example-apps.git --path guestbook --dest-server https://kubernetes.default.svc --dest-namespace default
```


- name — the name of our Argo CD application
- namespace — must be the same as Argo CD instance
- project — project name where the application will be configured (this is the way to organize your applications in Argo CD)
- repoURL— URL of our source code repository
- targetRevision — the git branch you want to use
- path — the path where Kubernetes manifests are stored inside repository
- destination — Kubernetes destination-related things (in this case the cluster is the same where Argo CD is hosted)


### Github CI Pipeline
```
# github-action.yml

name: DOCS CI/CD Pipeline

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  docker-build:
    runs-on: ubuntu-latest
    steps:
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        uses: docker/login-action@v1 
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Set tag var
        id: vars
        run: echo ::set-output name=docker_tag::$(echo ${GITHUB_SHA})

      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: congttl/docs:${{ steps.vars.outputs.docker_tag }}

      - name: Image digest
        run: echo ${{ steps.docker_build.outputs.digest }}

  update-manifest:
    needs: docker-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker://continuumio/anaconda3:2019.07

      - name: Set tag version
        id: vars
        run: echo ::set-output name=docker_tag::$(echo ${GITHUB_SHA})

      - name: authenticate git
        run: |
          git config --global user.name 'nguyenthanhcong101096'
          git config --global user.email 'nguyenthanhcong101096@gmail.com'
          git config --global credential.credentialStore ${{ secrets.TOKEN_GITHUB }}

      - name: git clone
        run: |
          sudo git clone https://github.com/nguyenthanhcong101096/helm_chart.git
      
      - name: update manifest
        run: |
          docker run --rm -v ${PWD}:/workdir mikefarah/yq:3.2.1 yq write --inplace --verbose helm_chart/values.yaml image.tag ${{ steps.vars.outputs.docker_tag }}

      - name: git commit & push to helm chart
        run: |
          rm -rf .git
          cd helm_chart
          git add .
          git commit -am "Update K8S image"
          git push origin master
```

> Mỗi lần push lên github helm_chart đã đăng kí ở my-argo.yml thì argoCD sẽ check file change manifest và apply lên kubernetes
