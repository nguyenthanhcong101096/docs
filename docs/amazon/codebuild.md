---
sidebar_position: 7
---
# CodeBuild && Pipeline
## Prepare
Example I have Cluster ECS
- **cluster ecs**     `rails-cluster`
- **task definition** `rails-compose`

## Codebuild
- [tham khảo](https://salzam.com/create-codedeploy-for-rails-and-sidekiq-task-definition/)
### Create buildspec files
Create the `buildspec-rails.yml` on the root directory of our rails application

```yml
version: 0.2

phases:
  install:
    runtime-versions:
      docker: 18
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin account_id.dkr.ecr.your-region.amazonaws.com
      - REPOSITORY_URI=account_id.dkr.ecr.your-region.amazonaws.com/rails_app
      - TIME_STAMP=$( date +%s )
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:v$TIME_STAMP
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:v$TIME_STAMP
      - echo Writing image definitions file...
      - printf '[{"name":"rails","imageUri":"%s"}]' $REPOSITORY_URI:v$TIME_STAMP > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```

### Create build project
> Go to CodeBuild from AWS service tab and click on `Create build project`

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03215742/005-8-1024x605.png)
![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03215802/006-6-1024x649.png)

> Connect to your github repository and allow AWS access.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03215834/007-5-1024x822.png)

> After selecting my repository, I have also selected master branch. You can change it as per your requirements

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03215855/009-4-1024x938.png)

> Make sure you select Privileged mode otherwise we won’t be able to build our Docker Image.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03215953/010-4-1024x343.png)

> Keep a note of the service role we have created above

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03225813/buildspec-rails-1024x451.png)

> we are using buildspec-rails.yml in this codebuild.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220026/012-2-1024x845.png)

> Just using simple caching options to speed up our build process.

**Adjustments to Service Role**
Add role: `AmazonEC2ContainerRegistryFullAccess, AmazonECS_FullAccess`

## Pipeline
- [Tham khảo](https://salzam.com/create-codepipeline-for-rails-project/)
### Create code pipeline
> Go to CodePipeline from AWS service tab and click on Create Pipeline

- Setting

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220825/017-1-1024x541.png)

- Source

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220853/019-1024x560.png)

> Click on Connect to Github and select the repository and the branch like CodeBuild step.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220905/020-1024x986.png)

- Build

> We will simply select the Codebuild project we have created earlier.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220916/021-1024x626.png)

- Deploy

> We will choose Amazon ECS and Deploy provider followed by cluster name and the rails service we have

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/03220928/022-1024x696.png)

Now Click on Release Change button to test the whole process.

![](https://s3-ap-southeast-2.amazonaws.com/sal-blog/wp-content/uploads/2020/01/04025930/sweet-726x1024.png)
