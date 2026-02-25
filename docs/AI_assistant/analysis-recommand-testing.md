# AI Assistant — 測試文件 (Testing Documentation)

本文件提供 `nanao-system` 專案 AI Assistant 模組的 **測試資料 (Test Data)**、**測試案例 (Test Cases)** 與 **API 驗證流程**。

主要涵蓋以下 Backend API：

-   `GET /analysis/health/:userId`

(註：`POST /recommendation` 尚未實作，故暫不列入測試範圍)

目標是確保資料流正確，以及 Gemini 模型能順利產生回應。

---

# 1. 測試資料總覽 (Test Data Overview)

由於此模組改為 **GET** 請求，並不接受 Body Payload。測試重點在於 **URL Parameter (userId)** 以及資料庫中是否存在對應的表單資料。

---

# 2. 測試案例 (Test Cases)

## 2.1 正常案例 (Valid Case)

-   **說明**: 使用者存在且有填寫過 HurtForm 或 MentalForm。
-   **URL**: `GET /analysis/health/2` (假設 User ID 2 有資料)
-   **預期**: 回傳 200 OK，並包含 `llm_response`。

## 2.2 無資料案例 (No Data Case)

-   **說明**: 使用者存在，但從未填寫任何表單。
-   **URL**: `GET /analysis/health/999` (假設 User ID 999 剛註冊)
-   **預期**: 回傳 200 OK，說明「沒有足夠的資料進行分析」。

## 2.3 異常案例 (Error Case) — 使用者不存在 (User Not Found)

-   **說明**: 查詢不存在的 User ID。
-   **URL**: `GET /analysis/health/99999`
-   **預期**: 視 User Service 實作而定，可能會回傳 `404 Not Found` 或空的分析結果。
-   *(目前 Analysis Service 實作會直接回傳無資料訊息，若 User Service 拋出錯誤則為 404)*

## 2.4 異常案例 (Error Case) — 參數錯誤

-   **說明**: userId 傳入非數字。
-   **URL**: `GET /analysis/health/abc`
-   **預期**: `400 Bad Request` (由 ParseIntPipe 攔截)。

---

# 3. API 測試流程 (API Testing Procedure)

## 3.1 本地開發環境 (Local Development)

1.  啟動 MySQL (`localhost:3306`) 並確認 `nanao_db` 存在。
2.  啟動後端：
    ```bash
    cd backend
    npm run start:dev
    ```
3.  使用 Postman 或 Thunder Client 進行測試：
    -   **URL**: `http://localhost:3000/analysis/health/2` (請替換為實際存在的 User ID)
    -   **Method**: `GET`

4.  驗證結果：
    -   HTTP Status Code 應為 `200`。
    -   JSON 回應應包含：
        ```json
        {
          "data_analyzed": { ... },
          "llm_response": "..."
        }
        ```
    -   `llm_response` 應為 Markdown 格式的中文分析報告。

## 3.2 Docker 環境 (Docker Environment)

1.  啟動 Docker 服務：
    ```bash
    docker-compose up -d
    ```
2.  後端存取位址：
    `http://localhost:3000`
3.  測試步驟同 3.1。

---

# 4. 檔案變更列表 (File Change List)

詳見 [規格文件 (Spec)](./analysis-recommand-spec.md#6-自定義變更與檔案列表-custom-modifications--file-list)。