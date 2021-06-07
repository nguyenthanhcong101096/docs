# helm example
### Install helm
```
curl -sSL https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

```
### Dowloadn repository Chart
helm repo add stable https://kubernetes-charts.storage.googleapis.com/

helm search repo stable
```

### Create helm chart
```
helm create helm_example

/example-project
    /Chart.yaml # Describe chart
    /values.yaml # Values default, you can changes it
    /charts/ # subcharts
    /templates/ # template file
```

### Deploy helm chart
```
# Check validate before run helm chart
helm install --debug --dry-run yourName helm-example

# deploy
helm install yourName helm-example
```

### Upgrade helm chart
```
helm upgrade yourName helm-example
```

### Rollback helm chart
```
helm history helm-example

helm rollback helm-example <number revision>
```

### Remove helm chart
```
helm uninstall helm-example
```
