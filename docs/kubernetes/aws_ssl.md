---
sidebar_position: 3
---

# HTTPS using service load balancer
## Resolution
- 1 Request a public ACM certificate for your custom domain.
- 2 Identify the ARN of the certificate that you want to use with the load balancer's HTTPS listener.
- 3 Create file deployment.yml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echo-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: echo-pod
  template:
    metadata:
      labels:
        app: echo-pod
    spec:
      containers:
      - name: echoheaders
        image: k8s.gcr.io/echoserver:1.10
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
```

```
kubectl create -f deployment.yaml
```

- 4 Create file service.yml

```
apiVersion: v1
kind: Service
metadata:
  name: echo-service
  annotations:
    # Note that the backend talks over HTTP.
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
    # TODO: Fill in with the ARN of your certificate.
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:{region}:{user id}:certificate/{id}
    # Only run SSL on the port named "https" below.
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
spec:
  selector:
    app: echo-pod
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: https
    port: 443
    targetPort: 8080
  type: LoadBalancer
```

```
kubectl create -f service.yaml
```

- 5 To return the DNS URL of the service of type LoadBalancer, run the following command:
> Note: If you have many active services running in your cluster, be sure to get the URL of the correct service of type LoadBalancer from the command output.

```
kubectl get service
```

- 6 Open the Amazon Elastic Compute Cloud (Amazon EC2) console, and then choose Load Balancers.
- 7 Select your load balancer, and then choose Listeners.
- 8 For Listener ID, confirm that your load balancer port is set to 443
- 9 For SSL Certificate, confirm that the SSL certificate that you defined in the YAML file is attached to your load balancer.
- 10 Associate your custom domain name with your load balancer name.
- 11 In a web browser, test your custom domain with the following HTTPS protocol

```
https://yourdomain.com
```

### refs
[terminate-https-traffic-eks-acm](https://aws.amazon.com/vi/premiumsupport/knowledge-center/terminate-https-traffic-eks-acm/)
