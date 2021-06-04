---
sidebar_position: 1
---
# Docker
## 1. Khái niệm
- Docker là một nền tảng dành cho các developer và sysadmin để phát triển, triển khai và chạy các ứng dụng bằng các container. Việc đóng gói thành container này giúp cho việc triển khai các ứng dụng trở nên dễ dàng hơn

- Công nghệ container ngày càng phổ biến bởi:

	- **Linh hoạt**: Có thể đóng gói từ ứng dụng đơn giản đến phức tạp
	- **Nhỏ gọn**: Các container tận dụng, sử dụng chung tài nguyên; kernel của host. Có thể chạy ở mọi nơi, mọi nền tảng.
   - **Khả năng thay đổi linh hoạt**: Cập nhật và nâng cấp nhanh chóng.
   - **Khả năng mở rộng**: Dễ dàng tăng và phân tán tự động các container
   - **Phân tầng dịch vụ**: Mỗi dịch vụ khi deploy sẽ được phân tầng, nằm trên các dịch vụ đang có sẵn. Như vậy sẽ không làm ảnh hưởng tới dịch vụ đang chạy.

### Life circle
![](https://miro.medium.com/max/2612/1*UbAOuq0K1oXxPOgigV9L9A.png)

### Docker container
Là 1 máy ảo được cấu thành từ 1 image. Có thể run, remove thông qua remote client
### Docker Image
Là 1 template tạo ra các container, Nó có thể gói các cài đặt môi trường, Thành 1 cụm duy nhất. đó là image

#### Một số chú ý
Có 02 cách để tạo ra các các mirror container

- **Cách 1:** Tạo một container, chạy các câu lệnh cần thiết và sử dụng lệnh docker commit để tạo ra image mới. Cách này thường không được khuyến cáo.
- **Cách 2:** Viết một Dockerfile và thực thi nó để tạo ra một images. Thường mọi người dùng cách này để tạo ra image.

Các **image** là dạng **file-chỉ-đọc (read only file).** Khi tạo một container mới, trong mỗi container sẽ tạo thêm một lớp có-thể-ghi được gọi là container-layer. Các thay đổi trên container như thêm, sửa, xóa file... sẽ được ghi trên lớp này. Do vậy, từ một image ban đầu, ta có thể tạo ra nhiều máy con mà chỉ tốn rất ít dung lượng ổ đĩa.

Quy tắt đặt tên images: **[REPOSITORY[:TAG]]**

#### Một số lệnh làm việc với images
**Kiểm tra hoạt động của docker**

Sử dụng lệnh `docker run hello-world` để kiểm tra hoạt động của docker trên host

```
sh root@u14-vagrant:~# docker run hello-world
Hello from Docker! This message shows that your installation appears to be working correctly. ....

```

**Tìm kiếm immages từ Docker HUB**

Sử dụng lệnh `docker search` để tìm kiếm các images trên Docker HUB

`docker search ubuntu`

Hoặc tìm chính xác phiên bản

`docker search ubuntu:14.04`

**Tải images từ Docker Hub về host**

Ví dụ tải images có tên là `ubuntu` về host

`docker pull ubuntu`

Để tạo một container từ `image ubuntu`, sử dụng lệnh `docker run ubuntu`

**Kiểm tra các images tồn tại trên host.**

Sử dụng lệnh `docker images` để kiểm tra danh sách các images

**Tạo container từ images**

Trong các tài liệu thường hay sử dụng lệnh docker run hello-world để chạy một container, sau khi chạy xong container này nó sẽ thoát. Tuy nhiên, đa số chúng ta lại cần tương tác nhiều hơn nữa với container (thao tác nhiều hơn)

Để chạy container và tương tác với container ta sử dụng tùy chọn -it trong lệnh docker run. Ví dụ: `docker run -it ubuntu`

**Save docker image**

```
docker save -o <output file> <image name>
docker save -o release.gz release
```

**Load docker image**
```
docker load -i <input image.gz>
docker load -i release.gz
```

#### Push - Pull images using Docker Hub.
Để push 1 image vừa tạo lên hub để chia sẻ với mọi người, thì ta cần tạo 1 tài khoản docker hub và login vào bằng câu lệnh

```
docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username:cosy294
Password:
Login Succeeded
```

Sau khi login thành công ta tiến hành push image lên hub

```
$ docker push cosy294/test
The push refers to a repository [cosy294/test]
255c5f0caf9a: Image successfully pushed
```

Trong đó: **cosy294/test** là tên images. - Lưu ý: Nếu bạn muốn push images lên docker hub thì tên images phải có dạng: **cosy294/test**, trong đó **cosy294** là id dockerhub và **test** là tên repo

Để Pull một image từ Docker Hub: `docker pull {image_name}`

#### Create and use Docker Registry: Local Images Repo.
Tạo môi trường chứa image. Docker đã hỗ trợ chúng ta cài đặt các môi trường này duy nhất trong 1 container. Rất là đơn giản, chúng ta chạy lệnh sau.

`docker run -d -p 5000:5000 --name registry registry:2`

Khi đó, port 5000 sẽ được listen. Mọi thao tác pull, push image sẽ được thực hiện trên port này.

Cấu hình docker để pull, push image từ registry vừa tạo: vi /etc/default/docker

`DOCKER_OPTS="--insecure-registry 172.16.69.239:5000"`

- Trong đó, 172.16.69.239 là địa chỉ ip máy chứa registry tạo ở trên.
- Sau khi cấu hình xong, ta khởi động lại docker

`service docker restart`

Các thao tác pull và push image tương tự ở như là pull, push ở docker hub.

### Docker engine
Quản lý việc tạo image. chạy container, dùng image có sẵn hay tải về, Kết nối container, thêm sữa xoá image và container
### Docker network
![](https://camo.githubusercontent.com/d2c856d1986260ace4a29c8478e17bba09dacc13/687474703a2f2f692e696d6775722e636f6d2f614e534a3639792e706e67)

Khi chúng ta cài đặt Docker, những thiết lập sau sẽ được thực hiện: - Virtual bridge docker0 sẽ được tạo ra - Docker tìm một subnet chưa được dùng trên host và gán một địa chỉ cho docker0

Sau đó, khi chúng ta khởi động một container (với bridge network), một veth (Virtual Ethernet) sẽ được tạo ra nối 1 đầu với docker0 và một đầu sẽ được nối với interface eth0 trên container.

#### Default network
Mặc định khi cài đặt xong, Docker sẽ tạo ra 3 card mạng mặc định là: - **bridge - host - only**.

Tương ứng với các nền tảo ảo hóa khác, ta có các chế độ card mạng của docker so với các nền tảng đấy là:

|General Virtualization Term|Docker Network Driver|
|---------------------------|:-------------------:|
| NAT Network	               |  bridge |
| Bridged                   | macvlan, ipvlan|
| Private / Host-only       | bridge |
| Overlay Network / VXLAN	 | overlay |

Để xem chi tiết, ta có thể dùng lệnh

`docker network ps`

Mặc định khi tạo container mà ta không chỉ định dùng network nào, thì docker sẽ dùng dải bridge.

**1. None Network**

Các container thiết lập network này sẽ không được cấu hình mạng.

**2. Bridge**

Docker sẽ tạo ra một switch ảo. Khi container được tạo ra, interface của container sẽ gắn vào switch ảo này và kết nối với interface của host.

`docker network inspect bridge`

**3. Host**

Containers sẽ dùng mạng trực tiếp của máy host. Network configuration bên trong container đồng nhất với host.

#### User-defined networks
Ngoài việc sử dụng các network mặc định do docker cung cấp. Ta có thể tự định nghĩa ra các dải network phù hợp với công việc của mình.

Để tạo network, ta dùng lệnh

`docker network create --driver bridge --subnet 192.168.1.0/24 bridgexxx`

Trong đó: 

- **--driver bridge**: Chỉ định dải mạng mới được tạo ra sẽ thuộc kiểu nào: bridge, host, hay none. -
- **--subnet**: Chỉ định địa địa chỉ mạng. - bridgexxx: Tên của dải mạng mới

Khi chạy container chỉ định sử dụng 1 dải mạng đặc biệt, ta dùng lệnh

`docker run --network=bridgexxx -itd --name=container3 busybox`

Trong đó: 

- **--network=bridgexxx**: Chỉ định ra dải mạng bridgexxx sẽ kết nối với container.

Container mà bạn chạy trên network này đều phải thuộc về cùng một Docker host. Mỗi container trong network có thể communicate với các containers khác trong cùng network.

#### An overlay network with Docker Engine swarm mode
- Overlay network là mạng có thể kết nối nhiều container trên các Docker Engine lại với nhau, trong môi trường cluster.
- Swarm tạo ra overlay network chỉ available với các nodes bên trong swarm. Khi bạn tạo ra một service sử dụng overlay network, manager node sẽ tự động kế thừa overlay network tới các nodes chạy các service tasks.

Ví dụ sau sẽ hướng dẫn cách tạo ra một network và sử dụng nó cho một service từ một manager node bên trong swarm:

```
# Create an overlay network `my-multi-host-network`.
$ docker network create \
  --driver overlay \
  --subnet 10.0.9.0/24 \
  my-multi-host-network

400g6bwzd68jizzdx5pgyoe95

# Create an nginx service and extend the my-multi-host-network to nodes where
# the service's tasks run.
$ $ docker service create --replicas 2 --network my-multi-host-network --name my-web nginx

716thylsndqma81j6kkkb5aus
```

#### "Nói chuyện" giữa các container với nhau.
- Trên cùng một host, các container chỉ cần dùng bridge network để nói chuyện được với nhau. Tuy nhiên, các container được cấp ip động nên nó có thể thay đổi, dẫn đến nhiều khó khăn. Vì vậy, thay vì dùng địa chỉ ip, ta có thể dùng name của các container để "liên lạc" giữa các container với nhau.
- Trong trường hợp sử dụng default bridge network thì ta khai báo thêm lệnh --link=name_container.
- Trong trường hợp sử dụng user-defined bridge network thì ta không cần phải link nữa.

**1. Trường hợp sử dụng default bridge network để kết nối các container**

Giả sử ta có mô hình: `web - db`

`container web` phải link được với `container db`.

```
docker run -itd --name=db -e MYSQL_ROOT_PASSWORD=pass mysql:latest
docker run -itd --name=web --link=db nginx:latest
```

Kiểm tra:

```
docker exec -it web sh
# ping redis
PING redis (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: icmp_seq=0 ttl=64 time=0.245 ms
...
# ping db
PING db (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: icmp_seq=0 ttl=64 time=0.126 ms
...
```

**2. Trường hợp sử dụng user-defined bridge network để kết nối các container**

Bạn không cần thực hiện thao tác link qua link lại giữa các container nữa.

```
docker network create my-net
docker network ls
NETWORK ID          NAME                DRIVER
716f591e185a        bridge              bridge              
4b0041303d6d        host                host                
7239bb9e0255        my-net              bridge              
016cf6ec1791        none                null

docker run -itd --name=web1 --net my-net nginx:latest
docker run -itd --name=db1 --net my-net -e MYSQL_ROOT_PASSWORD=pass mysql:latest

docker exec -it web1 sh
# ping db1
PING db1 (172.18.0.4): 56 data bytes
64 bytes from 172.18.0.4: icmp_seq=0 ttl=64 time=0.161 ms
# ping redis1
PING redis1 (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: icmp_seq=0 ttl=64 time=0.168 ms
```


### Docker volume
- Volume trong Docker được dùng để chia sẻ dữ liệu cho container. 
- Để sử dụng volume trong docker dùng cờ hiệu (flag) -v trong lệnh docker run.

#### Sử dụng volume để gắn (mount) một thư mục nào đó trong host với container.
Ví dụ ta sẽ gắn một thư mục **/var/datahost** vào trong **container**.

```
# Bước 1: Tạo ra thư mục trên host
mkdir /var/datahost

# Bước 2: Khởi tạo một container và chỉ ra volume được gắn
docker run -it -v /var/datahost ubuntu
```
Ở ví dụ trên ta đã thực hiện gắn một thư mục vào trong một container. Ta có thể kiểm tra bằng việc tạo ra dữ liệu trên host và kiểm tra ở container hoặc ngược lại.

#### Sử dụng volume để chia sẻ dữ liệu giữa host và container
Trong tình huống này thư mục trên máy host (máy chứa container) sẽ được mount với một thư mục trên container, dữ liệu sinh ra trên thư mục được mount của container sẽ xuất hiện trên thư mục của host.

Ví dụ: Các bước như sau:

- Tạo ra thư mục bindthis trên host, có đường dẫn /root/bindthis.
- Thư mục /root/bindthis này sẽ được mount với thư mục /var/www/html/webapp nằm trên container.
- Tạo ra 1 file trong thư mục /var/www/html/webapp trên container.
- Kiểm tra xem trong thư mục /root/bindthis trên host có hay không.

```
root@compute3:~# mkdir bindthis
root@compute3:~# ls bindthis/ 
root@compute3:~# docker run -it -v $(pwd)/bindthis:/var/www/html/webapp ubuntu bash
root@13aa90503715:/#
root@13aa90503715:/# touch /var/www/html/webapp/index.html
root@13aa90503715:/# exit
exit
root@compute3:~# ls bindthis/
index.html
root@compute3:~#
```
Có 2 chế độ chia sẻ volume trong docker, đó là read-write (rw) hoặc read-only (ro). Nếu không chỉ ra thì mặc định sử dụng chế độ read-write. Ví dụ chế độ read-only, sử dụng tùy chọn ro.

`docker run -it -v $(pwd)/bindthis:/var/www/html/webapp:ro ubuntu bash`

#### Sử dụng volume để chia sẽ dữ liệu giữa các container
Tạo container chứa volume

`docker create -v /linhlt --name volumecontainer ubuntu`

Tạo container khác sử dụng container *volumecontainer* làm volume. Khi đó, mọi sự thay đổi trên container mới sẽ được cập nhật trong container *volumecontainer*

`docker run -t -i --volumes-from volumecontainer ubuntu /bin/bash`

Trong đó, tùy chọn --volumes-from chỉ ra tên của container sẽ được map volume.

#### Backup và Restore volume.
**Backup**

`docker run --rm --volumes-from volumecontainer -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /linhlt`

Lệnh này sẽ backup thư mục volume là /linhlt trong container volumecontainer và nén lại dưới dạng file backup.tar.

**Restore**

`docker run -v /linhlt --name data-container ubuntu /bin/bash`

Tạo volume /linhlt trên container data-container.

```
docker run --rm --volumes-from data-container -v $(pwd):/backup ubuntu bash -c "cd /linhlt && tar -zxvf /backup/backup.tar"
```
-  Tạo container thực hiện nhiệm vụ giải nén file backup.tar vào thư mục /linhlt. Container này có liên kết với container data-container ở trên.

#### Các chú ý về volume trong Docker
- Đường dẫn trong cờ hiệu -v phải là đường dẫn tuyệt đối, thường dùng $(pwd)/ten_duong_dan để chỉ đúng đường dẫn.
- Có thể chỉ định việc mount giữa thư mục trên host và thư mục trên container ở các chế độ read-wirte hoặc read-only, mặc định là read-write.
- Để chia sẻ volume dùng tùy chọn --volumes-from

### Dockerfile
- Dockerfile là một tập tin dạng text chứa một chuỗi các câu lệnh, chỉ thị để tạo nên một image. Dockerfile bao gồm các câu lệnh liên tiếp thực hiện tự động dựa trên một image có sẵn để tạo ra một image mới

- Trong Dockerfile có các câu lệnh chính sau:

```
FROM
RUN
CMD
....còn nữa
```

##### FROM
Dùng để chỉ ra image được build từ đâu (từ image gốc nào)

```
FROM ubuntu
hoặc có thể chỉ rõ tag của image gốc
FROM ubuntu14.04:lastest
```

##### RUN
Dùng để chạy một lệnh nào đó khi build image, ví dụ về một Dockerfile

```
FROM ubuntu
RUN apt-get update
RUN apt-get install curl -y
```

##### CMD
Lệnh CMD dùng để truyền một lệnh của Linux mỗi khi thực hiện khởi tạo một container từ image (image này được build từ Dockerfile)

```
#Cách 1
FROM ubuntu
RUN apt-get update
RUN apt-get install curl -y
CMD ["curl", "ipinfo.io"]
```

```
#Cách 2
FROM ubuntu
RUN apt-get update
RUN apt-get install wget -y
CMD curl ifconfig.io
```

##### LABEL
`LABEL <key>=<value> <key>=<value> <key>=<value> ...`

Chỉ thị LABEL dùng để add các metadata vào image.

```
LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

##### MAINTAINER
`MAINTAINER <name>`

Dùng để đặt tên cho tác giả

##### EXPOSE
`EXPOSE <port> [<port>...]`

Lệnh EXPOSE thông báo cho Docker rằng image sẽ lắng nghe trên các cổng được chỉ định khi chạy. Lưu ý là cái này chỉ để khai báo, chứ ko có chức năng nat port từ máy host vào container. Muốn nat port, thì phải sử dụng cờ -p (nat một vài port) hoặc -P (nat tất cả các port được khai báo trong EXPOSE) trong quá trình khởi tạo contrainer.

##### ENV
```
ENV <key> <value>
ENV <key>=<value> ...
```

Khai báo cáo biến giá trị môi trường. Khi run container từ image, các biến môi trường này vẫn có hiệu lực.

##### ADD
```
ADD has two forms:
ADD <src>... <dest>
ADD ["<src>",... "<dest>"] (this form is required for paths containing whitespace)
```

- Chỉ thị ADD copy file, thư mục, remote files URL (src) và thêm chúng vào filesystem của image (dest)
- src: có thể khai báo nhiều file, thư mục, có thể sử dụng các ký hiệu như *,?,...
- dest: phải là đường dẫn tuyệt đối hoặc có quan hệ với chỉ thị WORKDIR

##### COPY
```
COPY <src>... <dest>
COPY ["<src>",... "<dest>"] (this form is required for paths containing whitespace)
```

Chỉ thị COPY, copy file, thư mục (src) và thêm chúng vào filesystem của container (dest).

##### ENTRYPOINT
```
ENTRYPOINT ["executable", "param1", "param2"] (exec form, preferred)
ENTRYPOINT command param1 param2 (shell form)
```

Hai cái CMD và ENTRYPOINT có tác dụng tương tự nhau. Nếu một Dockerfile có cả CMD và ENTRYPOINT thì CMD sẽ thành param cho script ENTRYPOINT. Lý do người ta dùng ENTRYPOINT nhằm chuẩn bị các điều kiện setup như tạo user, mkdir, change owner... cần thiết để chạy service trong container.

##### VOLUME
`VOLUME ["/data"]`

mount thư mục từ máy host và container. Tương tự option -v khi tạo container.
Thư mục chưa volumes là /var/lib/docker/volumes/. Ứng với mỗi container sẽ có các thư mục con nằm trong thư mục này. Tìm thư mục chưa Volumes của container sad_euclid:

##### USER

`USER daemon`

Set username hoặc UID để chạy các lệnh RUN, CMD, ENTRYPOINT trong dockerfiles.

##### WORKDIR
`WORKDIR /path/to/workdir`

Chỉ thị WORKDIR dùng để đặt thư mục đang làm việc cho các chỉ thị khác như: RUN, CMD, ENTRYPOINT, COPY, ADD,...

##### ARG
`ARG <name>[=<default value>]`

Chỉ thị ARG dùng để định nghĩa các giá trị của biến được dùng trong quá trình build image (lệnh docker build --build-arg =).
biến ARG sẽ không bền vững như khi sử dụng ENV.

##### STOPSIGNAL
`STOPSIGNAL signal`

Gửi tín hiệu cho container tắt đúng cách

##### SHELL
`SHELL ["executable", "parameters"]`

- Chỉ thị Shell cho phép các shell form khác có thể ghi đè shell mặc định.
- Mặc định trên Linux là ["/bin/sh", "-c"] và Windows là ["cmd", "/S", "/C"].


### Docker compose
Compose là công cụ giúp định nghĩa và khởi chạy multi-container Docker applications.

Khởi động tất cả các dịch vụ chỉ với 1 câu lệnh duy nhất.

Với 3 bước cơ bản như sau:

- Định nghĩa các ứng dụng thông qua Dockerfile
- Định nghĩa các ứng dụng chạy tách biệt và khởi động cùng nhau trong docker-compose.yml
- Thực thi câu lệnh docker-compose up -d để hoàn tất

##### Cài đặt
install using pip

`pip install docker-compose`

Một file docker-compose.xml mẫu:

```yml
version: '3'
services:
  web:
    build: .
    ports:
    - "5000:5000"
    volumes:
    - .:/code
    - logvolume01:/var/log
    links:
    - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```

Sử dụng docker-compose để quản lý vòng đời ứng dụng cụ thể xem và quản lý trạng thái của các service (Start, stop, rebuild,...); chuyển log của các ứng dụng đang chạy.

##### Ví dụ
Chúng ta sẽ tạo ra 2 containers, 1 containers chứa mã nguồn wordpress và 1 containers chưa cơ sở dữ liệu mysql. Bằng cách định nghĩa trong file compose. Chỉ với 1 dòng lệnh khởi tạo, docker sẽ lập tức tạo ra 2 containers và sẵn sàng cho chúng ta dựng lên wordpress, một cách nhanh chóng.

- Đoạn mã compose: Viết theo cú pháp YAML.

```yml
version: '2'

services:
   db:
     image: mysql:5.7
     volumes:
       - ./data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: wordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_PASSWORD: wordpress
```

- **version**: '2': Chỉ ra phiên bản docker-compose sẽ sử dụng.
- services:: Trong mục services, chỉ ra những services (containers) mà ta sẽ cài đặt. Ở đây, tạo sẽ tạo ra services tương ứng với 2 containers là db và wordpress.
Trong services db:
- **image**: chỉ ra image sẽ được sử dụng để create containers. Ngoài ra, bạn có thể viết dockerfile và khai báo lệnh build để containers sẽ được create từ dockerfile.
- **volumes**: mount thư mục data trên host (cùng thư mục cha chứa file docker-compose) với thư mục /var/lib/mysql trong container.
- **restart**: always: Tự động khởi chạy khi container bị shutdown.
environment: Khai báo các biến môi trường cho container. Cụ thể là thông tin cơ sở dữ liệu.
Trong services wordpress:
- **depends_on**: db: Chỉ ra sự phụ thuộc của services wordpress với services db. Tức là services db phải chạy và tạo ra trước, thì services wordpress mới chạy.
- **ports**: Forwards the exposed port 80 của container sang port 8000 trên host machine.
- **environment**: Khai báo các biến môi trường. Sau khi tạo ra db ở container trên, thì sẽ lấy thông tin đấy để cung cấp cho container wordpress (chứa source code).

Khởi chạy

`docker-compose up`


##### Một vài chú ý
- **dockerfile** dùng để build các image.
- **docker-compose** dùng để build và run các container.
- **docker-compose** viết theo cú pháp YAML, các lệnh khai báo trong docker-compose gần tương tự với thao tác chạy container docker run.
- **docker-compose** cung chấp chức năng Horizontally scaled, cho phép ta tạo ra nhiều container giống nhau một cách nhanh chóng. Bằng cách sử dụng lệnh

### Docker machine
Docker machine là công cụ của docker. cho phép ta tạo ra các máy ảo, trên các máy ảo đó đã cài sẵn docker

**Mục đích**

- Tạo ra các hệ thống Docker khác nhau chạy trên các máy ảo khác nhau, độc lập nhau
- Sau này sử dụng docker swarm để kết nối chúng lại thành 1 cụm máy docker trên đó chúng ta chạy các dịch vụ

#### Hiện thị tất cả docker-machine
`docker-machine ls`

```
➜  ~ docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS

vps11   -        virtualbox   Running   tcp://192.168.99.105:2376           v19.03.5
vps22   -        virtualbox   Running   tcp://192.168.99.106:2376           v19.03.5
vps33   -        virtualbox   Running   tcp://192.168.99.107:2376           v19.03.5
```

#### Create docker-machine
```
docker-machine create -driver <công cụ máy ảo> <name>

docker-machine create -driver virtualbox vps1
```

docker-machine bản chất nó là các máy ảo chạy trên **virtualbox**

#### Stop docker-machine
```
docker-machine stop <name> <name>
```

```
➜  ~ docker-machine stop vps11 vps22
Stopping "vps22"...
Stopping "vps11"...
Machine "vps11" was stopped.
Machine "vps22" was stopped.
```

```
➜  ~ docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS
vps11   -        virtualbox   Stopped                                       Unknown
vps22   -        virtualbox   Stopped                                       Unknown
vps33   -        virtualbox   Running   tcp://192.168.99.107:2376           v19.03.5
```

#### Start docker-machine
`docker-machine start vps1`

#### Remove docker-machine
`docker-machine rm vps1`

#### SSH docker-machine
```
docker-machine ssh <name>

docker-machine ssh vps1
```
#### Copy file from Docker-machine to Host, Host to Docker-machine
- copy file từ **host** -> **docker-machine**

```
docker-machine scp -r path/to/folder/ vps11:/home

docker-machine scp -r data/ vps11:/home
```

- copy file từ **docker-machine** ->  **host**

```
docker-machine scp -r  vps11:/home path/to/folder/ 

docker-machine scp -r vps11:/home/data ~/Desktop 
```

#### Show IP docker-machine
```
docker-machine ip <name>

docker-machine ip vps1
```

### Docker swarm

![](https://docs.docker.com/engine/swarm/images/services-diagram.png)

Docker swarm là một công cụ giúp chúng ta tạo ra một clustering Docker. Nó giúp chúng ta gom nhiều Docker Engine lại với nhau và ta có thể "nhìn" nó như duy nhất một virtual Docker Engine.

Trong phần này, tôi sẽ tạo ra 1 cụm cluster gồm 1 manager và 2 worker chạy dịch vụ web-server. - node manager sẽ là node quản lý cluster. - node worker là các node chạy dịch vụ. Nếu mà node worker die thì node manager sẽ run container trên chính nó.

**Mô hình swarm**
Dùng docker-machine tạo ra 3 máy ảo có docker

- `vsp1 192.168.1.17`
- `vps2 192.168.1.18`
- `vps3 192.168.1.19`

#### Tạo node manager
Trên `vps1` run: 

`docker swarm init --advertise-addr=192.168.99.105`

```
Swarm initialized: current node (b4u9iuqzhvb149ujyaw97sw9g) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-5enn8c4zwpfmo7q0bq6mlzhb6bo74zyyhssvllo946tagfspj3-bjznswmenwxyoz5ibn1ocgfob 192.168.99.105:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

**trong đó:**

- `192.168.99.105` là địa chỉ IP máy cần làm node manage leader `(vps1)`


#### Kiểm tra các node có trên node manage leader
`docker node ls`

#### Join swarm
- Nếu bạn muốn add thêm các node manager khác, chạy lệnh sau trên node manager`(vps1)`

```
docker@vps11:~$ docker swarm join-token worker
To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-5enn8c4zwpfmo7q0bq6mlzhb6bo74zyyhssvllo946tagfspj3-bjznswmenwxyoz5ibn1ocgfob 192.168.99.105:2377
```

- `vps2 và vps3` join **swarm** run: 

`docker swarm join --token SWMTKN-1-5enn8c4zwpfmo7q0bq6mlzhb6bo74zyyhssvllo946tagfspj3-bjznswmenwxyoz5ibn1ocgfob 192.168.99.105:2377`

- Sau khi join swarm 

```
docker@vps11:~$ docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
b4u9iuqzhvb149ujyaw97sw9g *   vps11               Ready               Active              Leader              19.03.5
678admqk2qaoy8dsrprly2100     vps22               Ready               Active                                  19.03.5
slv156sk9t6ok66g6opvjo3sd     vps33               Ready               Active                                  19.03.5
```

#### Leave swarm
node worker run: `docker swarm leave`

- kiểm tra node ở `node manage`
- vp2 trạng thái bị `down`
 
```
docker@vps11:~$ docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
b4u9iuqzhvb149ujyaw97sw9g *   vps11               Ready               Active              Leader              19.03.5
678admqk2qaoy8dsrprly2100     vps22               Down                Active                                  19.03.5
slv156sk9t6ok66g6opvjo3sd     vps33               Ready               Active                                  19.03.5
```

#### Remove node down
node manage run: `docker node rm id`

#### Run service in docker swarm
- **Tạo dịch vụ trên swarm sử dụng câu lệnh như sau:**

`docker service create --replicas 5 -p 3000:3000 --name testservice congttl/swarm:reactjs`

Docker swarm sẽ tiến hành tạo dịch vụ với 5 tác vụ chính là tạo ra 5 container

```
overall progress: 5 out of 5 tasks
1/5: running   [==================================================>]
2/5: running   [==================================================>]
3/5: running   [==================================================>]
4/5: running   [==================================================>]
5/5: running   [==================================================>]
verify: Service converged
```
- **Liệt kê các dịch vụ trên swarm**

`docker service ls`

- **Kiểm tra chi tiết các container ở trong dịch vụ testservice**

`docker service ps testservice`

```
ID                  NAME                IMAGE                   NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
2ernkew9lmpm        testservice.1       congttl/swarm:reactjs   vps11               Running             Running 8 minutes ago
4gqg3b5aajni        testservice.2       congttl/swarm:reactjs   vps22               Running             Running 3 minutes ago
75sp19v17r1a        testservice.3       congttl/swarm:reactjs   vps33               Running             Running 3 minutes ago
iw4aum5seqv8        testservice.4       congttl/swarm:reactjs   vps22               Running             Running 3 minutes ago
w26jl39pzvjj        testservice.5       congttl/swarm:reactjs   vps33               Running             Running 3 minutes ago
```

- **Kiểm tra trên worker có tao nhiêu container chạy**

vps2: `docker ps`

```
docker@vps22:~$ docker ps
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS               NAMES
4a4160b3a154        congttl/swarm:reactjs   "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes        3000/tcp            testservice.4.iw4aum5seqv8lcvrwdqil1rp2
9b47feae2a8c        congttl/swarm:reactjs   "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes        3000/tcp            testservice.2.4gqg3b5aajnigekbpksq2n3u9
```

- **Kiểm tra logs trên dịch vụ**

`docker service logs testservice`

```
docker@vps11:~$ docker service logs testservice                                         testservice.1.2ernkew9lmpm@vps11    |                                                   testservice.1.2ernkew9lmpm@vps11    | > calculator@0.1.0 start /app
testservice.1.2ernkew9lmpm@vps11    | > react-scripts start
testservice.1.2ernkew9lmpm@vps11    |
testservice.1.2ernkew9lmpm@vps11    | Starting the development server...
testservice.1.2ernkew9lmpm@vps11    |
testservice.1.2ernkew9lmpm@vps11    | Browserslist: caniuse-lite is outdated. Please run next command `yarn upgrade`
testservice.1.2ernkew9lmpm@vps11    | Compiled successfully!
testservice.1.2ernkew9lmpm@vps11    |
testservice.1.2ernkew9lmpm@vps11    | You can now view calculator in the browser.
testservice.1.2ernkew9lmpm@vps11    |
testservice.1.2ernkew9lmpm@vps11    |   Local:            http://localhost:3000/
testservice.1.2ernkew9lmpm@vps11    |   On Your Network:  http://10.0.0.6:3000/
```

- **Kiểm tra thống kê hệ thống mà container chạy trên node**

`docker stats`

```
CONTAINER ID        NAME                                      CPU %               MEM USAGE / LIMIT     MEM %               NET I/O             BLOCK I/O           PIDS
4a4160b3a154        testservice.4.iw4aum5seqv8lcvrwdqil1rp2   0.00%               129.9MiB / 989.5MiB   13.13%              6.84kB / 3.45kB     17.2MB / 4.1kB      31
9b47feae2a8c        testservice.2.4gqg3b5aajnigekbpksq2n3u9   0.00%               133.6MiB / 989.5MiB   13.51%              20.4kB / 14.8kB     799kB / 4.1kB       31
```

- **Xoá dịch vụ khỏi Swarm**

`docker service rm testservice`

- **Thay đổi số lương replicas**

`docker service scale testservice=6`

```
testservice scaled to 6
overall progress: 6 out of 6 tasks
1/6: running   [==================================================>]
2/6: running   [==================================================>]
3/6: running   [==================================================>]
4/6: running   [==================================================>]
5/6: running   [==================================================>]
6/6: running   [==================================================>]
verify: Service converged
```

- **[Thay đổi image trên service](https://docs.docker.com/engine/reference/commandline/service_update/)**

`docker service update --image=congttl/swarm:vuejs testservice`

```
testservice
overall progress: 6 out of 6 tasks
1/6: running   [==================================================>]
2/6: running   [==================================================>]
3/6: running   [==================================================>]
4/6: running   [==================================================>]
5/6: running   [==================================================>]
6/6: running   [==================================================>]
verify: Service converged
```

- **[Thay đổi, thêm port vào service swarm](https://docs.docker.com/engine/reference/commandline/service_update/)**

`docker service update --publish-add published=8080,target=8080  testservice`

### Docker stack
- Triển khai các dịch vụ và quản lý các dịch vụ trên `swarm` mà các dịch vụ đó đươc mô tả trong file. được gọi là `docker compose.yml`

#### Tạo docker compose.yml

- Chúng ta tạo 1 file `docker-compose.yml` copy vào máy có vai trò là `node manage leader`

`docker-machine scp -r ./docker-compose.yml  vps11:/home/docker-compose.yml`

```yml
version: '3'

services:
  service1:
    image: congttl/swarm:reactjs
    ports:
      - 3000:3000
    deploy:
      replicas: 5 # tạo ra 5 container chạy dịch vụ
      resources:
        limits:
          cpus: '0.5'   # chỉ được phép sử dụng 50% của 1 core
          memory: 150MB # được phép sử dụng 150MB
        reservations: # tài nguyên tối thiểu được cấp ngay
          cpus: '0.25'
          memory: 40MB
      restart_policy: # Chính sách khỏi động lại container
        condition: on-failure

  service2:
    image: congttl/swarm:vuejs
    ports:
      - 8080:8080
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: '0.5'  
          memory: 150MB 
        reservations: 
          cpus: '0.25'
          memory: 40MB
      restart_policy:
        condition: on-failure
```

#### Chạy docker stack
`docker stack deploy --compose-file docker-compose.yml testtack`

hoặc 

`docker stack deploy -c docker-compose.yml testtack`

```
docker@vps11:/home$ docker stack deploy --compose-file docker-compose.yml testtack
Creating service testtack_service2
Creating service testtack_service1
```

#### Liệt kê các stack
`docker stack ls`

```
NAME                SERVICES            ORCHESTRATOR
testtack            2                   Swarm
```

#### Liệt kê dịch vụ trong stack
`docker stack services testtack`

```
ID                  NAME                MODE                REPLICAS            IMAGE                   PORTS
mdstw6bq9wxu        testtack_service1   replicated          5/5                 congttl/swarm:reactjs   *:3000->3000/tcp
tg45btv0krmm        testtack_service2   replicated          5/5                 congttl/swarm:vuejs     *:8080->8080/tcp
```

#### Xoá stack trong docker swarm
`docker stack rm testtack`

```
Removing service testtack_service1
Removing service testtack_service2
Removing network testtack_default
```

### Network Overlay in Docker Swarm
![](https://lh3.googleusercontent.com/YQeT-zmvlZ4_sp8WzB44l9sNK1ZTlWXmAzoAArun5H6261v2rydniVAxuonY4aDhmgWo-iZuwlEBI6EMm9_n0n3fpMgiODjP-3Fymug_EJdC3WICWkarJiDkOMbwtTDQJgGP449wRbdBJ1lY-HJBk2PUBfpAwDszHkC2lu5ArV9ENNQblPfyFthstU8-tkcaK1yldcekZ2kwyeNdfAjv0tjmhWIpJGkcpacMEqDBe-i3kZ88ekNZ21eqAwasnV_Gwsw8uKtZW3psVTF8cZRV_7mZhuLC9Etih2XgeRPA94vR00TyzMO3XFVzrzTHR-1znJ4J5dtJMIEiTN4M2Q8u2gmKCS-9s8KtJ00-9vUD_bd3iR3GEPPeWToJvmO_pRKSKOf9x-cEdK8WiszKgfg0ggnoH7T45S72LxlmoplkJ9AJ_xT-reAMYvN7l3iUzCEL7gfuwxuf_5P_LJLqND4hj5O8hA1LKXYvRRpJfDFq71mFyVGjuoAo8EE8ylT9sdE4ow0QvY-cN5exX_tJJDbvTOdQ4lnkoLpUqvwCZqrLD6oTmXr0gtxzSttf1_sTTK9tsV3ZJtJ3Vrwfw8V284iJ1OlnOvQGJeeM7C606pY-bu0NludrmUogPy_ceR1SsIftjn4fAuzmrI0Bs_DQdM6ut3y9FmbNDUckWPV_-baJpHf9I6Zo5gO-0wYLjVY8F2Q=w1641-h879-no?authuser=0)

#### Create network overlay
`docker network create -d overlay mynetwork1`

#### sử dụng service kết nối vào mạng mynetwork1
`docker service create --replicas 3 p 8085:8085 --name service --network mynetwork1 congttl/swarm:nodejs`

## 2. So sánh giữa VM với container
- Container chạy trực tiếp trên môi trường máy chủ như một tiến trình và chia sẻ phần kernel bên dưới dùng chung với máy chủ chứa nó
- VM tạo ra một môi trường giả lập hoàn toàn tách biệt như 1 máy hoàn chỉnh thông qua việc phân bổ tài nguyên của máy chủ, do đó sẽ tốn tài nguyên nhiều hơn cho hệ điều hành của máy ảo

![](https://camo.githubusercontent.com/8cb14a3fc605ac71b9aff74ffb9027b7d003c179/68747470733a2f2f69322e77702e636f6d2f626c6f672e646f636b65722e636f6d2f77702d636f6e74656e742f75706c6f6164732f426c6f672e2d4172652d636f6e7461696e6572732d2e2e564d2d496d6167652d312d31303234783433352e706e673f73736c3d31)

## 3. Cấu trúc và thành phần của Docker

Docker bao gồm:

- **Docker Client**: Giao diện để tương tác giữa người dùng với Docker Daemon - HOST
- **Docker Daemon (HOST)**: Lưu trữ image local và khởi chạy container từ những image đó
- **Docker Hub (registry)**: Nơi lưu trữ các images

![](https://camo.githubusercontent.com/948ae5d9498319b4797adc05bf367ddd1646352c/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f302a584b54436d6d6f75346654366f732d632e)

## 4. Sự khác biệt Docker Swarm và Kubernetes
![](https://lazyadmin.info/content/images/size/w2000/2019/04/1.png)

### Định nghĩa ứng dụng
**Kubernetes**: Ứng dụng có thể được triển khai trên kubernetes bằng cách kết hợp nhiều services (microservices), deployments và pods.

**Docker Swarm**: Ứng dụng được trtriển khai dưới dạng services hoặc microservices trong một cụm cluster.

### Networking
Kubernetes: Hệ thống mạng kubernetes cho phép các pods có thể kết nối với nhau. Mô hình mạng được chọn ban đầu sẽ quy định kết nối giữa các pods.

Docker Swarm: Một lớp mạng overlay được tao ra để kết nối giữa các docker hosts. Các container sẽ kết nối thông qua mạng bridge ảo trên từng docker host.

### Scalability
**Kubernetes**: Do được thiết kế luôn đảm bảo trạng thái hoạt động và tính thống nhất trong toàn bộ cụm cluster, nên toàn bộ kubernetes là hệ thống tương đối phức tạp. Do đó thời gian xử lý khi scale hệ thống sẽ chậm hơn so với Swarm.

**Docker Swarm**: Khi có yêu cầu mở rộng hệ thống, Swarm có thể trineer khai thêm container và node nhanh hơn.

### High Availability
**Kubernetes**: Tất cả pods trong  kubernetes được phân tán đều giữa các node để tăng tính an toàn. Dịch vụ LB sẽ kiểm tra và loại các node lỗi ra khỏi hệ thống cho đến khi hoạt động lại bình thường.

**Docker Swarm**: Các services trên swarm có thể được cấu hình replicate. Node quản lý swarm sẽ chịu trách nhiệm quản lý phân bổ tài nguyên giữa các node.

### Load Balancing
**Kubernetes**: tận dụng triển khai serivces và pod như cách cân bằng tải trong nội bộ hệ thống. Ingress được sử dụng như tool để cân bằng tải kết nối từ bên ngoài vào.

**Docker Swarm**: Swarm mode cân bằng tải chủ yếu sử dụng cơ chế của DNS. Kết nối sẽ được điều hướng dựa vào services name.

### Kết luận
**Kuberntest** hỗ trợ yêu cầu cao và phức tạp hơn trong khi Docker Swarm cung cấp giải pháp đơn giản, có thể triển khai nhanh chóng.

**Docker swarm** thích hợp khi cần triển khai nhanh, đơn giản. Tuy nhiên kubernetes thích hợp với môi trường yêu cầu cao, tải lớn và mô hình phức tạp.
