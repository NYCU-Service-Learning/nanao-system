# 疼痛互動系統

## 環境建置

在執行以下安裝之前，請確保已滿足以下環境：

1. **已安裝 Docker**：確保電腦上已安裝 Docker。可以透過執行 `docker --version` 和 `docker-compose --version` 來檢查。如果未安裝 Docker，請按照作業系統的安裝指南進行安裝：
   - **Windows**：從 [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-windows) 下載 Docker Desktop 並安裝。
   - **macOS**：從 [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-mac) 下載 Docker Desktop 並安裝。
   - **Linux**：請依照 Linux 發行版本的官方 Docker 安裝指南下載：
     - Ubuntu: [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
     - Debian: [Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
     - CentOS: [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
     - 其他發行版本: [Docker Engine Installation](https://docs.docker.com/engine/install/)

2. **Docker Hub 帳戶**：於 [Docker Hub](https://hub.docker.com) 建立帳戶並登入。

## 安裝步驟

假設您已安裝 Docker 並登入後，請按照以下步驟進行：  

1. **創建專案目錄**：  
    建立一個要存放專案的資料夾，並切換到該目錄。

2. **創建 `docker-compose.yml` 文件**：  
    在專案目錄中創建一個名為 `docker-compose.yml` 的文件，並填入以下內容：  
    ```yaml=
    # docker-compose.yml
    services:
      frontend:
        image: userwei/nycu_service-learning-nanao:frontend
        build:
          context: ./frontend
          dockerfile: Dockerfile
        ports:
          - "5173:80"

      backend:
        image: userwei/nycu_service-learning-nanao:backend
        build:
          context: ./backend
          dockerfile: Dockerfile
        ports:
          - "3000:3000"
        environment:
          NODE_ENV: production
          DATABASE_URL: mysql://nanao_user:nanao_password@db:3306/nanao_db
          SESSION_SECRET: nanao_db
          CORS_ORIGIN: http://localhost:5173
        depends_on:
          db:
            condition: service_healthy

      db:
        image: mysql:8.0
        environment:
          MYSQL_ROOT_PASSWORD: example
          MYSQL_DATABASE: nanao_db
          MYSQL_USER: nanao_user
          MYSQL_PASSWORD: nanao_password
        ports:
          - "3307:3306"
        volumes:
          - db-data:/var/lib/mysql
          - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql:ro
        healthcheck:
          test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
          interval: 10s
          timeout: 5s
          retries: 5

    volumes:
      db-data:
    ```
3. **創建 `init-db.sql` 文件**：  
    在專案目錄中創建一個名為 `init-db.sql` 的文件，並填入以下內容：  
    ```sql=
    -- init-db.sql
    CREATE DATABASE IF NOT EXISTS nanao_db;
    CREATE USER IF NOT EXISTS 'nanao_user'@'%' IDENTIFIED BY 'nanao_password';
    GRANT ALL PRIVILEGES ON nanao_db.* TO 'nanao_user'@'%';
    GRANT ALL PRIVILEGES ON *.* TO 'nanao_user'@'%';
    FLUSH PRIVILEGES;
    ```
4. **初始化環境**：  
    在專案目錄中打開終端機，並輸入以下指令以初始化環境。  
    ```bash=
    docker login
    docker-compose pull
    docker-compose up -d
    ```
5. **驗證服務是否正在運行**：  
    使用此命令檢查服務的狀態。  
    ```bash=
    docker-compose ps
    ```
    若顯示以下內容即為正常運行。  
    ```bash=
    NAME                                     IMAGE                                          COMMAND                  SERVICE    CREATED              STATUS                        PORTS
    nycu_service-learning-nanao-backend-1    userwei/nycu_service-learning-nanao:backend    "docker-entrypoint.s…"   backend    About a minute ago   Up About a minute             0.0.0.0:3000->3000/tcp
    nycu_service-learning-nanao-db-1         mysql:8.0                                      "docker-entrypoint.s…"   db         About a minute ago   Up About a minute (healthy)   33060/tcp, 0.0.0.0:3307->3306/tcp
    nycu_service-learning-nanao-frontend-1   userwei/nycu_service-learning-nanao:frontend   "/docker-entrypoint.…"   frontend   About a minute ago   Up About a minute             0.0.0.0:5173->80/tcp
    ```
6. **連接疼痛互動系統**：  
    安裝完成後可以通過瀏覽器訪問 http://localhost:5173 來連接系統。

## 附錄
1. 安裝後電腦若重新開機，需重新在存放專案的資料夾中重新打開終端機執行以下指令即可讓系統繼續運行。  
    ```bash=
    docker-compose up -d
    ```
2. 預設管理員帳密為 `admin` 與 `admin`。
3. 管理員與使用者的帳號名稱在建立後無法更改。
4. 登入階段會在登入 1 小時後過期，過期後需重新登入。
5. 若 AI 頭貼系統無法使用，請稍等約 10 分鐘後重試。
