# 專案建置流程

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
```
cd backend
```

### 環境變數.env

新增名稱為`.env`的檔案，並參考`.env.sample`加入指定的環境變數。若未新增第三方登入環境變數及`Gemini API key`專案仍可運行，但無法使用相關功能。

#### Google 第三方登入環境變數
請至 [Google Cloud Console](https://console.cloud.google.com) 建立新專案並設定OAuth2.0，設定正確後可拿到`GOOGLE_CLIENT_ID`和`GOOGLE_SECRET_KEY`。

- 已授權的JavaScript來源:`http://localhost:5173`, `http://localhost:3000`
- 已授權的重新導向 URI: `http://localhost:3000/auth/google/login/callback`, `http://localhost:3000/auth/google/link/callback`


#### Line 第三方登入環境變數
請至 [Line Developer](https://developers.line.biz/en/) 創建開發者帳戶並設定第三方登入。`Login`及`Link`請使用不同channel，並分別填入相應的`callback URL`。

Login: `http://localhost:3000/auth/line/login/callback`
Link: `http://localhost:3001/auth/line/link/callback`

在設置完`channel`後會給予`Channel ID`和`Channel Secret`

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
```
cd frontend
```

### 套件安裝
執行下列指令安裝本專案必要的所有package
```
npm install
npm audit fix
```

執行`npm run dev`，若能正常運行就設定完成了

### Voice_Reco
切換到voice_reco目錄 
```
cd voice_reco
```
新增名稱為`.env`的檔案，並參考`.env.sample`加入指定的環境變數。

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




