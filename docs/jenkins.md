---
id: jenkins
title: Pipeline với Jenkins
sidebar_label: Pipeline với Jenkins
---

![](https://miro.medium.com/max/4096/1*iKuaNfxgZSTe_J2x3PYRUg.png)


**Chuỗi bài về Jenkins**

- 1. Pipeline trong jenkins

- 2. Hướng dẫn tạo Jenkinsfile

- 3. Pipeline CI/CD hoàn chỉnh với Rails Framework

**Mục đích cuối cùng của chuỗi bài: xây dựng 1 CI/CD hoàn chỉnh bao gồm:**

- Docker: sử dụng nền tảng container để triển khai
- Ruby: framework Rails để làm website
- Rspec: Unit test cho Rails
- Feature testing: test chức năng cho service
- Deploy: CD deploy container bằng Pipeline

## Bài đầu tiên sẽ có những phần sau
- **Jenkins**: giới thiệu jenkins cùng những tính năng của nó
- **Cài đặt Jenkins với docker** : cài jenkins trong 5 phút với docker
Jobs trong Jenkins: cách định nghĩa + thiết lập build cho job
- **Pipeline trong Jenkins**: *pipeline là gì *
- **Hướng dẫn cách thiết lập Pipeline:**
- **Kết luận**

## Jenkins
- **Jenkins** là 1 tool open-source mạnh mẽ được sử dụng làm CI/CD (Continuous Integration/Continuous Delivery) trong phát triển ứng dụng. Link source code
- **Jenkins** cùng bộ plugins phong phú khiến cho việc sử dụng nó rất linh hoạt, phục vụ được nhiều mục đích cũng như thể loại ứng dụng khác nhau

## Cài đặt Jenkins với docker

```
docker run \
  -u root \
  --rm \
  -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkinsci/blueocean
```

Lấy mật khẩu trong log `docker log id_jenkins`

```
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

f785e588b9cb41aea495ebb930a0caf2

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
```

Access vào `http://localhost:8080` , nhập pass trên và hoàn thành cài đặt jenkins.

## Jobs trong Jenkins
- Tạo job chính là tạo item trong Jenkins (ở version cũ của Jenkins gọi là build job) , job/item là 1 cấu hình build cho 1 ứng dụng. Vòng đời quản lý của 1 ứng dụng có thể có 1 hoặc nhiều job/item.

### Tạo job

- Để tạo job/item ta click vào Create Item , nhớ là tên cho item là unique nhé:
- Phía dưới mục chọn tên có các loại job/project như trong hình (tuỳ chúng ta cài những plugin thêm nào mà sẽ có những loại project khác nhau, ví dụ hình tên có Maven project là nhờ việc add thêm plugin Maven Project Plugin )

> Các loại project thì khác nhau là những thiết lập tương ứng với loại project đó đã được chọn sẵn và bắt buộc ta phải thiết lập

- Giải thích các loại item như sau:

  - **Freestyle project**: cho người dùng lựa chọn tất cả các loại thiết lập, là loại thiết lập linh hoạt nhất.
  - **Maven project**: Maven 2/3 project thiết lập cho maven project, có thiết lập sẵn nhiều tính năng như là tự tích hợp tích hợp JUnit, findbugs, Incremental build (chỉ build phần module thay đổi thôi),Build modules in parallel,...
  - **Pipeline**: project build theo 1 chuỗi (chain) các bước, ta sẽ tìm hiểu kỹ hơn ở phần Pipeline.
  - **Eternal Job**: những job chạy ngoài Jenkins (có thể là ở remote host)
  - **Folder**: Thư mục chung cho các job lồng nhau (nested job)
  - **GitHub Organization**: thiết lập cho tất cả project trong acc GitHub premium.
  - **Multibranch Pipeline**: thiết lập pipeline cho project trên nhiều branch khác nhau.

### Thiết lập job
- Tại main menu của Jenkins bạn click New Item, khai báo job name và chọn type là Pipeline và click OK.
- Tại page config của job bạn chọn tab Pipeline và khai báo như hình:
![](https://miro.medium.com/max/1400/1*AB8-vInvdHuVOCqgBpG0Zw.png)

> Chú ý trường Repository URL bạn nhập url của repository lưu source code Jenkins Pipeline của bạn mà đã fork từ https://github.com/sontung0/tutorial-jenkins-pipeline
Sau khi hoàn tất thì click save để lưu thông tin job.

## Pipeline trong Jenkins
- Là chuỗi các tác vụ trong `CI/CD` như là `Build, Deploy, Test, Release,...` gọi là các `Stage` được ghép nối lại với nhau (anh sau diễn ra sau khi a trước được thực thi) để có thể đẩy ứng dụng đến được mục đích cuối cùng là phát hành (hoặc có thể chỉ là test trên môi trường dev thôi)
![](https://drive.google.com/uc?id=1pN8Hzx0Pj0ZJPkmf6O-ZhHRgYt9a94TF&export=download)

Ta có thể định nghĩa 2 kiểu Pipeline

- Chọn kiểu `job/item` là `Pipeline project`
- Tự tạo liên kết giữa các `job/item` với nhau bằng `Build Trigger` và `Post-build (Downstream/Upstream)`

### Thiết lập Pipeline trong Jenkins
**Cách 1: Chọn kiểu job/item là Pipeline project**

- Create Item > chọn Pipeline project
- Trong page thiết lập, để làm một sample về Pipeline ta định nghĩa các state trong session Pipeline, có 2 cách định nghĩa
  - ① Pipeline script là ta định nghĩa luôn trên webui của Jenkins
  - ② Pipeline script from SCM là config về pipeline được định nghĩa trong file Jenkinsfile trong source của project
- Ta sẽ thử định nghĩa Pipeline gồm 3 stage Build, Test, Deploy bằng phương pháp ① như sau

```
pipeline {
    agent any 

    stages {
        stage('Build') { 
            steps { 
                sh  'echo  "BUILD STAGE"' 
            }
        }
        stage('Test'){
            steps {
                sh  'echo  "TEST STAGE"' 
            }
        }
        stage('Deploy'){
            steps {
                sh  'echo  "DEPLOY STAGE"' 
            }
        }
    }
}
```

Thử build phát nhé, sau khi build xong thì vào màn hình chính của job ta sẽ thấy Stage View được hiển thị như sau

![](https://lh3.googleusercontent.com/41X6RhqUeTpWZeOAtx6zZ3_r4lrj7dj-mUuBQ3TSblUHLTglLFab5vuwLK71eII934u5=s121)

**Cách 2: Tự tạo liên kết giữa các job/item với nhau bằng Build Trigger và Post-build (Downstream/Upstream)**

- Tạo 3 job dạng Freestyle project và mỗi job được build bằng 1 shell script đơn giản (xem trong ảnh gif dưới) là echo "Test 0x"
- Project Test02 ta config Build Trigger là Build after other projects are built và chọn build sau khi Test01 được build
- Project Test02 phần Post-build Actions chọn Build other project và chọn project Test03. 2 bước vừa qua chính là ta config 1 chain như sau Test01 -> Test02 -> Test03 tạo thành 1 Pipeline
- Add Pipeline View: ở màn hình Dashboard chọn Addview và chọn Build Pipeline View rồi ở màn hình thiết lập cho View, session Pipeline Flow chọn project Test01 là Initial Job
- Tiếp theo ta build Test01 và truy cập vào Pipeline View vừa mới tạo để xem quá trình build các job được tiến hành theo trình tự như thế nào.

![](http://g.recordit.co/5ZUjQAL7dp.gif)

[link](https://recordit.co/5ZUjQAL7dp)

## Jenkinsfile
**Pipeline as a code:** thiết lập pipeline như là lập trình bằng script vậy. Ở trong bài viết trước mình đã giới thiệu có 2 cách để tạo file Jenkinsfile là file để thiết lập Pipeline cho project dạng Pipeline:

1. **WebUI**: thiết lập trực tiếp trên WebUI của project Pipeline.
2. **Jenkinsfile** trong git repo: thiết lập Pipeline trong file Jenkinsfile của project.

Về script Pipeline Jenkinsfile thì có 2 loại:

- **Declarative Pipeline(mới có):** sử dụng những syntax đơn giản hơn. Dựa trên các methods / functions dựng sẵn, việc của chúng ta sử dụng và tuân thủ theo các rule và syntax được định nghĩa sẵn theo các steps và funtions như vậy để implement theo các stages (từng đoạn trong pipeline)

- **Scripted Pipeline:** top of the underlying Pipeline sub-system. Sử dụng Groovy script là kỹ thuật nâng cao hơn khi cần sử dụng code để implement vài tasks nào đó hoặc logic phức tạp tùy thuộc bài toán.

Ví dụ script Jenkinsfile:

**Declarative Pipeline**

```
pipeline {
  agent {
      docker { image 'node:7-alpine' }
  }
  stages {
      stage('Test') {
          steps {
              sh 'node --version'
          }
      }
  }
```

**Scripted Pipeline**

```
node {
  stage('Example') {
      if (env.BRANCH_NAME == 'master') {
          echo 'I only execute on the master branch'
      } else {
          echo 'I execute elsewhere'
      }
  }
}
```

| Declarative Pipeline	  |  	Scripted Pipeline |
|---|---|
| Block ngoài cùng là pipeline {...} |Block ngoài cùng ko có quy định bắt buộc, nhưng thường là cùng là node {...} |
| Bắt buộc phải có block stages { ... } |Không bắt buộc cha để khai báo các stage { ... } con |
|Các Groovy khi muốn sử dụng phải add vào trong block scrip { ... } |Có thể viết bất kì đâu  |
|Mục đích: sử dụng các methods/functions định nghĩa sẵn để viết script đơn giản nhất| Mục đích: có thể sử dụng code Groovy thoải mái, áp dụng cho viết các script có logic phức tạp hơn, mang lại cho ta sự linh hoạt hơn|

## Declarative Pipeline
Cấu tạo Jenkinsfile sẽ gồm những thành phần sau

- Sections: Các phân đoạn, phạm vi thực thi, bao gồm các block sau
  - **agent** : chỉ định môi trường sẽ thực thi các thao tác trong steps
  - **post** : các action sẽ được chạy sau cùng, ví dụ gửi mail thông báo kết quả, xóa các resource sử dụng,...
  - **stages** : là block cha của block stage, block stage chứa khâu, giai đoạn trong Pipeline (là Pipe trong Pipeline)
  - **steps** : là block con bên trong block stage là các action thực thi các công việc cần thiết cho mỗi state

### agent
- Agent là môi trường để chạy pipeline code, các đoạn shell script vv...
- Agent có thể hiểu chính jenkins master, slave machine nào đó, hoặc docker image.

- Options :
  - **any** : Chỉ định cho bất cứ master/slave nào available sẽ được pick để chạy.
  - **none** : Không sử dụng, thay vì đó các stages sẽ phải tường minh chỉ định agent cho chính nó ( Xem phần stages ở phía dưới )
  - **label** : tên của agent (master hoặc slave machine) sẽ dụng để thực thi nhiều stages đã khai báo. ( Khác với any ở chỗ - any sẽ tự động pick master/slave machine available)
  - **node** : Giống như label nhưng có thể thêm nhiều options hơn. Hay nói cách khác option node này là phụ trợ cho label
  - **docker** : sử dụng docker image cho việc chạy pipeline - https://hub.docker.com/explore/

```yml
pipeline {
    agent any
    // agent none
    // agent { label 'master' }
    // agent { label 'manhnv-slave' }
    environment { // Định nghĩa global
        DB_ENGINE    = 'sqlite'
    }
    stages {
        stage('Build') {
            environment { // Định nghĩa riêng cho stage Build thôi
                AN_ACCESS_KEY = credentials('longta-hoho') 
            }
            steps {
                //sh 'printenv'
                echo "DB Engige : ${DB_ENGINE}"
                echo "DB Engige : ${AN_ACCESS_KEY_USR}"
            }
        }
    }
}
```

### post
Tiếp theo sub section của pipeline là post. Cái sẽ được chạy cuối cùng khi kết thúc Pipeline hoặc stage (giống như finally trong Java đó) Nhằm handle kết quả của pipeline hoặc chạy các tác vụ cần chạy sau cùng.

```yml
//Một ví dụ từ  https://jenkins.io/doc/pipeline/tour/post/
pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                echo 'Hello World'
            }
        }
    }

    post {
        always {
            echo 'One way or another, I have finished'
            deleteDir() /* clean up our workspace */
        }
        success {
            echo 'I succeeeded!'
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            echo 'I failed :('
        }
        changed {
            echo 'Things were different before...'
        }
    }
}
```

- **always** : luôn luôn được gọi, bất kể kết quả buidl là gì
- **changed** : chỉ chạy khi kết quả của lần build này khác với lần build trước
- **success** : khi kết quả build SUCCESS
- **unstable** : khi kết quả build là UNSTABLE
- **failure** : khi kết quả build là FAILURE
- **aborted** : khi kết quả build là ABORTED

[Class define kết quả build có thể refer tại Java doc](http://javadoc.jenkins-ci.org/hudson/model/Result.html)

### stages
Một stages có thể hiểu là chứa nhiều stage con. Mỗi stage sẽ đóng một vai trò đảm nhiệm khác nhau tùy bài toán của bạn. Nó giống như việc bạn viết nhiều method trong 1 class vậy

```
pipeline {
    agent any
    stages { 
        stage('Clone') {
            //implement pipeline code 
        }
        stage('Build') {
            //implement pipeline code 
        }
        stage('Test') {
            //implement pipeline code 
        }
    }
}
```
> P/s : Nếu agent là none bạn phải chỉ định agent tương ứng cho các stage( refer section agent ở mục trên)

### steps
steps là một thành phần nằm bên trong stage con. Nơi mà chúng ta đặt các xử lý logic bên trong nó .

```
pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                echo 'Hello World'

                script {
                    def browsers = ['chrome', 'firefox']
                    for (int i = 0; i < browsers.size(); ++i) {
                        echo "Testing the ${browsers[i]} browser"
                    }
                }
            }
        }
    }
}
```

## Syntax Scripted Pipeline
Nếu bạn muốn chèn một đoạn groovy script, bạn phải dùng thẻ script {} như ví dụ steps ở bên. Thì Scripted Pipeline không phải làm điều đó, bởi vì nó implement theo cách mang nghĩa Scripted

Giống như Declarative Pipeline, Scripted Pipeline cũng sử dụng cú pháp DSL và build với Groovy. Nhưng nó có thể sử dụng các functions cung cấp bởi Groovy, và "coding" theo cách của một coder

Ở đây là một ví dụ tiếp theo về Scripted Pipeline

```
node{
    stage("Prepare") {
        // Tạo function validate input param
        def checkParam = {
            val -> ('' == val || val == 'false')
        }
        if (checkParam(TOMCAT_USER) && checkParam(TOMCAT_STUDENT)) {
            error('You must select environment(s) to deploy')
        }

        // clean old build
        sh("rm -rf ${WAR_USER_BUILD_PATH}")
        sh("rm -rf ${WAR_STUDENT_BUILD_PATH}")

        // change dir và clone source vào folder src
        dir('source') { 
            git url: 'https://github.com/path/to/project', branch: 'develop', credentialsId: "${env.GITHUB_ID}"
        }
    }
}
```

### node
- node chính là agent theo cách hiểu của Declarative Pipeline. Bạn có thể thấy nó ở http://<jenkins-url>/computer/
- Một node có thể là master / slave machine / hoặc kết hợp node đó với docker
- Dùng để khai báo môi trường sẽ chạy jenkins job, hoặc chạy các stage vv. ( Giống như agent)

```
node(<node_name_or_label>) {
    <processor>
}
```

- Trong đó :
  - **node_name_or_label** : Tên hoặc label của node http://<jenkins-url>/computer/. Nếu để trống, xử lý này sẽ take một node bất kỳ đang available. Giống như agent any của Declarative Pipeline
  - **processor** : Implement các logic xử lý trong các stage, hoặc shell script ..vv

```
node { // sẽ take một node bất kỳ đang available
    stage('Prepare'){
        //TODO
    }
}

node('manhnv1_slave') { // sẽ chạy trên slave machine manhnv1_slave
    stage('Log1'){
        //TODO
    }
}

node('manhnv2_slave') { // sẽ chạy trên slave machine manhnv2_slave
    stage('Log2'){
        //TODO
    }
}

node('master') { // Hoặc chạy trên jenkins master 
    stage('Log'){
        //TODO
    }
}
```

Một stage có thể trong một node, 1 node cũng có thể sử dụng trong 1 stage tùy thuộc vào bài toán của bạn.

![](https://viblo.asia/uploads/2ea7a43a-5c46-4158-97b2-460b4c8ca2ca.png)

### Agent vs Node
Mình cùng compare lại cách sử dụng giữa agent (Declarative) vs node (Scripted) bằng hình ảnh dưới để thấy rõ trong cách sử dụng

![](https://viblo.asia/uploads/8bd18e18-8ad2-46aa-ab29-012aefe507d2.png)
![](https://viblo.asia/uploads/0dbf40c1-e1bb-4175-b846-adea738c2d40.png)
![](https://viblo.asia/uploads/27e4b813-be2e-40bf-9c02-e71ac0588c43.png)
![](https://viblo.asia/uploads/c29f5319-e377-435b-b772-0b55bc124590.png)

[https://blog.vietnamlab.vn/](https://blog.vietnamlab.vn/2017/11/22/huong-dan-tao-jenkinsfile/)

[https://viblo.asia/](https://viblo.asia/p/jenkins-pipeline-for-beginners-Qbq5QgJJZD8#declarative-pipeline-5)
