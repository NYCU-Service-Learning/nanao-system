# 專案建置流程
## 方法一：Visual Studio Code Dev Container
1. 安裝 Visual Studio Code
2. 安裝 Docker Desktop
3. 安裝 Docker-compose
4. 在此資料夾開啟 Visual Studio Code
5. 在 backend 資料夾下創建 .env 檔案，可以參考 backend/.env.sample 並填入對應的值
5. 如果尚未安裝插件 Dev Container，則請到 Extension 界面安裝
6. 按 F1 或是 crtl+shift+P，並執行指令 `Dev Containers: Rebuild and Reopen in Container`，選擇 frontend 或是 backend 即可開始開發
7. 如果要在 frontend、backend 切換，可以
    1. **使用多視窗開發**：開啟另一個 Visual Studio Code 視窗並開啟此專案資料夾，按 F1 或是 ctrl+shift+P 並且輸入 `Dev Containers: Reopen in Container` 並選擇對應的資料夾。
    2. **使用單一視窗開發**：在 F1 或是 ctrl+shift+P 輸入 `Run Dev Containers: Switch Container` 即可進行切換。

## 方法二：Docker Compose
1. 安裝 Docker 以及 Docker-compose，或是使用 podman 一系列的 container 管理工具亦可
2. 在專案資料夾輸入 `docker compose -f docker-compose-dev.yaml up`，並且使用 `docker exec -it {your_container_name} bash` 進入 Container 並使用任何文字編輯器編輯(使用 podman 請將 docker 改成 podman 並且自行設置 podman compose)

# 專案建置流程(Legacy)

安裝[Node.js v20.18.0(LTS)](https://nodejs.org/en/download/current)。

## 本地端mysql
[下載MySQL的installer](https://dev.mysql.com/downloads/installer/)，
打開installer後選擇安裝MySQL server、MySQL workbench,、MySQL shell (可選擇最新版本)。其餘設定保持預設(MySQL的port預設應為3306)，記得安裝流程中設定的root帳密。

(Windows)打開MySQL command line client直接輸入以下MySQL指令
```
CREATE DATABASE nanao_db;
CREATE USER 'nanao_user'@'localhost' identified by 'nanao_password';
GRANT ALL on nanao_db.* to 'nanao_user'@'localhost';
quit
```

(LINUX)
基本上就是下載好後照下面指令打，使用者跟密碼可以不用照下面的
```
sudo mysql -u root //windows的話下載的時候會有設定頁面 要輸入那個密碼才行
CREATE DATABASE nanao_db;
CREATE USER 'nanao_user'@'localhost' identified by 'nanao_password';
GRANT ALL on nanao_db.* to 'nanao_user'@'localhost';
quit
```
要進這個`nanao_db`只要打`mysql -unanao_user -pnanao_password nanao_db`就好，要注意的是`-u,-p`跟用戶名稱和密碼中間不能空格

## 後端建置
切換至後端的目錄

### 環境變數.env

新增名稱為`.env`的檔案，並加入指定的環境變數。

### 資料庫建置
安裝完MySQL後在terminal執行下列指令安裝本專案必要的所有package，並將database schema導入到資料庫中。
```
npm install
npm audit fix
npx prisma migrate dev --name nanao_db
```
打開MySQL command line client輸入以下MySQL指令新增管理員帳號
```
USE nanao_db;
insert into user values (DEFAULT, 'admin', '$2b$10$PmRQ.FCpi50lnr5OJ9Tib.kaL9WwhI2eCTFvJFn0QJk1xk0eVvfdq', 'admin', '', '', DEFAULT, 'ADMIN');
insert into userDetail values (1, null, '', 0, 'None', '0', '', '', now());
```

執行`npm run start:dev`，若以上都能正常運行就設定完成了

### 錯誤排除
若`npx prisma migrate dev --name nanao_db`無法成功執行有可能是因為`.env`中的`DATABASE_URL`不正確，無法成功連接到MySQL伺服器。

開發過程中若有更動到後端目錄中的`schema.prisma`皆須重新執行`npx prisma migrate dev --name nanao_db`才會更新資料庫的格式。若資料庫被強制重置則需要重新加入admin帳號

## 前端建置
切換至前端的目錄

### 套件安裝
執行下列指令安裝本專案必要的所有package
```
npm install
npm audit fix
```

執行`npm run dev`，若能正常運行就設定完成了

### 錯誤排除
如果npm install時出現node-sass套件相關錯誤，可將該套件刪除後再進行套件安裝。
```
npm uninstall node-sass
rm -rf node_modules
```

## 啟動專案
開啟兩個terminal分別啟動前端與後端
- 前端
  ```
  cd frontend
  npm run dev
  ```
- 後端
  ```
  cd backend
  npm run start:dev
  ```




