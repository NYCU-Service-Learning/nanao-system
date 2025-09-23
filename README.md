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

2. **初始化環境**：  
    在專案目錄中打開終端機，並輸入以下指令以初始化環境。  
    ```bash=
    docker login
    docker-compose pull
    docker-compose up -d
    ```

3. **驗證服務是否正在運行**：  
    使用此命令檢查服務的狀態。  
    ```bash=
    docker-compose ps
    ```
    若顯示以下內容即為正常運行。  
    ```bash=
    NAME                      IMAGE                                          COMMAND                   SERVICE    CREATED         STATUS                   PORTS
    nanao-system-backend-1    userwei/nycu_service-learning-nanao:backend    "/usr/wait-for-it.sh…"   backend    6 minutes ago   Up 6 minutes             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
    nanao-system-db-1         mysql:8.0                                      "docker-entrypoint.s…"   db         9 minutes ago   Up 9 minutes (healthy)   0.0.0.0:3307->3306/tcp, [::]:3307->3306/tcp
    nanao-system-frontend-1   userwei/nycu_service-learning-nanao:frontend   "/docker-entrypoint.…"   frontend   9 minutes ago   Up 9 minutes             0.0.0.0:5173->80/tcp, [::]:5173->80/tcp
    ```
4. **連接疼痛互動系統**：  
    安裝完成後可以通過瀏覽器訪問 http://localhost:5173 來連接系統。

## 附錄
1. 安裝後電腦若重新開機，需重新在存放專案的資料夾中重新打開終端機執行以下指令即可讓系統繼續運行。  
    ```bash=
    docker-compose up -d
    ```
2. 預設管理員帳密為 `admin` 與 `admin`。
3. 管理員與使用者的帳號名稱在建立後無法更改。
4. 登入階段會在登入 1 小時後過期，過期後需重新登入。
5. 若 AI 頭貼系統暫時無法使用。
