---
sidebar_position: 1
---

# Grafana Loki Promtail

## Concepts
![](https://d2l930y2yx77uc.cloudfront.net/production/uploads/images/12998465/picture_pc_e512d6bbc17a1038e4ff0f264b9704bc.png)

- **Promtail**: Promtail giúp giám sát các ứng dụng bằng cách chuyển các bản ghi vùng chứa lên đám mây Loki hoặc Grafana
- **Loki**: Loki là một hệ thống tổng hợp nhật ký, có khả năng mở rộng, có tính khả dụng cao, được lấy cảm hứng từ Prometheus
- **Grafana**: Grafana là một nền tảng mã nguồn mở để theo dõi và quan sát

## Grafana Loki Setup
Setup Grafana
```
wget https://dl.grafana.com/oss/release/grafana-8.0.3.linux-amd64.tar.gz
tar -zxvf grafana-8.0.3.linux-amd64.tar.gz

cd grafana-8.0.3/bin
./grafana-server
```

Setup Loki
```
wget https://github.com/grafana/loki/releases/download/v2.2.1/loki-linux-amd64.zip
wget https://raw.githubusercontent.com/grafana/loki/main/cmd/loki/loki-local-config.yaml

uzip loki-linux-amd64.zip
./loki-linux-amd64 --config.file=loki-local-config.yaml
```

Setup Promtail
```
wget https://github.com/grafana/loki/releases/download/v2.2.1/promtail-linux-amd64.zip
wget https://raw.githubusercontent.com/grafana/loki/main/clients/cmd/promtail/promtail-local-config.yaml

uzip loki-linux-amd64.zip
./loki-linux-amd64 --config.file=loki-local-config.yaml
```

Now: You access browser `localhost:3000, admin-admin`

## References
- [grafana](https://grafana.com/)
- [grafana github](https://github.com/grafana/grafana)