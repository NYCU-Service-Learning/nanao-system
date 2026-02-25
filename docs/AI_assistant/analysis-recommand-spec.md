# AI Assistant 模組設計文件 (AI Assistant Module)

本文件定義了 **AI Assistant module** 在 `nanao-system` 專案中的架構、需求、資料規格、測試資料與 API 測試流程。
目前主要實作了 **健康分析 (Health Analysis)** 功能。

Backend 使用 **NestJS**；Frontend 使用 **React + Vite**。

---

## 1. 概述 (Overview)

AI Assistant 模組目前提供以下後端能力：

1.  **`GET /analysis/health/:userId`**
    聚合使用者的 **HurtForm (身體不適紀錄)** 與 **MentalForm (心理狀況紀錄)**，將最近 5 筆資料整理成 Prompt，發送給 LLM (Gemini 2.0 Flash) 進行綜合分析，並回傳 Markdown 格式的建議報告。

2.  **`POST /recommendation`** (尚未實作 / Future Work)
    預計將使用分析結果或原始數據來產生結構化的運動建議卡片。

**Backend (NestJS)** 負責資料獲取、清洗 (Data Cleaning)、Prompt 組裝與 LLM 通訊。
**Frontend (React + Vite)** 負責顯示最終的分析報告 (Markdown 渲染)。

---

## 2. 使用者流程 (User Flow)

1.  使用者透過前端登入系統。
2.  使用者填寫並提交相關表格 (例如 HurtForm 或 MentalForm)。
3.  當使用者進入「個人健康分析」頁面時，前端呼叫：
    -   `GET /analysis/health/:userId`
4.  Backend 執行步驟：
    -   透過 Prisma 從 MySQL 獲取該使用者最近 5 筆的 HurtForm 與 MentalForm。
    -   若無資料，回傳提示訊息。
    -   若有資料，將資料格式化為自然語言描述。
    -   組裝 System Prompt (設定為台灣資深社區健康照護員) 與 User Prompt。
    -   呼叫 **Gemini 2.0 Flash** 模型。
    -   回傳 LLM 產生的 Markdown 內容給前端。
5.  Frontend 接收回應並透過 `react-markdown` 渲染分析結果 (包含整體關懷、趨勢分析、健康建議等)。

---

## 3. 模組需求 (Module Requirements)

### 功能需求 (Functional Requirements)

#### Analysis Module (`GET /analysis/health/:userId`)

-   **接受參數**:
    -   `userId` (URL Param, 必填)。
-   **資料獲取**:
    -   自動撈取該 User 最近 5 筆 `HurtForm` 與 `MentalForm`。
-   **資料處理**:
    -   將數值型疼痛指數轉換為文字描述 (如 "右肩(5)")。
    -   保留心理問卷分數。
    -   格式化填寫時間為台灣習慣格式。
-   **LLM 交互**:
    -   使用 `Gemini 2.0 Flash`。
    -   要求輸出格式為 Markdown。
-   **回傳**:
    -   `data_analyzed`: 包含 `physical` (身體紀錄筆數) 與 `mental` (心理紀錄筆數)。
    -   `llm_response`: AI 產生的完整分析文字 (Markdown)。

### 非功能需求 (Non-functional Requirements)

-   **在地化**: 使用繁體中文，語氣溫和親切，適合長輩閱讀。
-   **容錯性**: 若 LLM 呼叫失敗，應回傳預設的錯誤友善訊息 (AI 目前忙碌中)。
-   **安全性**: 僅限 Admin 或本人存取資料 (權限控制由 Guard 或 Controller 層處理)。

---

## 4. 資料流規範 (Data Flow)

### Analysis Module
```
[Frontend] -- GET /analysis/health/:userId --> [Backend AnalysisController]
    └─ AnalysisService.analyzeUserHealth(userId)
    └─ DB fetch (Prisma: HurtForm, MentalForm take 5)
    └─ Prepare Data Prompts (Clean & Format)
    └─ GeminiService.generateText (Call Gemini API)
    └─ Return JSON { data_analyzed, llm_response }
    └─ [Frontend] Render Markdown
```

---

## 5. API 規格 (API Specifications)

### `/analysis/health/:userId`

#### Request
-   **Method**: `GET`
-   **URL Params**: `userId` (Int)

#### Response Schema (Success)

```json
{
  "data_analyzed": {
    "physical": 5,
    "mental": 0
  },
  "llm_response": "## 1. 整體狀況關懷\n\n張伯伯您好..."
}
```

#### Response Schema (No Data)

```json
{
  "data_analyzed": {
    "physical": 0,
    "mental": 0
  },
  "message": "沒有足夠的資料進行分析",
  "llm_response": "目前沒有任何身體或心理紀錄可供分析，請鼓勵使用者多加紀錄。"
}
```

---

## 6. 自定義變更與檔案列表 (Custom Modifications & File List)

我們小組針對 AI Assistant 功能進行了以下檔案的修改與新增：

### Backend (`backend/`)

-   **[NEW] `src/aiassistant/Aiassistant.service.ts`**
    -   封裝 `GoogleGenerativeAI` SDK。
    -   實作 `generateText` 方法，負責與 Gemini 2.0 Flash 模型通訊。
    -   包含錯誤處理 (Try-Catch) 以防止 API 錯誤導致服務崩潰。

-   **[MODIFY] `src/analysis/analysis.controller.ts`**
    -   新增 API Endpoint: `@Get('health/:userId')`。

-   **[MODIFY] `src/analysis/analysis.service.ts`**
    -   新增 `analyzeUserHealth` 方法。
    -   整合 `HurtForm` 與 `MentalForm` 的資料查詢邏輯。
    -   實作 Prompt Engineering (角色設定、資料清洗、Markdown 格式要求)。

-   **[MODIFY] `package.json`**
    -   新增依賴: `@google/generative-ai`。

### Frontend (`frontend/`)

-   **[MODIFY] `src/api/analysisAPI.ts`**
    -   新增 `fetchUserHealthAnalysis(userId)` 函式，對接後端 API。

-   **[MODIFY] `src/pages/Analysis/Analysis.tsx`**
    -   實作健康分析頁面 UI。
    -   整合 `react-markdown` 與 `remark-gfm` 進行 Markdown 渲染。
    -   加入 Loading 狀態與錯誤處理 (Server Error / Network Error)。
    -   顯示分析資料來源的統計 (分析範圍: 近 5 筆)。
