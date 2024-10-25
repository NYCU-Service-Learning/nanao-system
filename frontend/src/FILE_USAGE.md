# /src
## 檔案
* `App.css`：介面的大小
* `App.tsx`：整合assets資料夾的內容，控制整個前端
* `index.css`：背景顏色、`App`位置
* `main.tsx`：讓`App`遵照`index.css`的格式運作
* `vite-env.d.cs`：空的

## /assets
### /Interact
* `BodySelector.css`：回報疼痛頁面的人體全身圖的位置和大小、鼠標經過的視覺效果
* `BodySelector.tsx`：允許使用者改變視角並選擇疼痛部位
* `DataFiller.css`：填寫疼痛資料的介面
* `DataFiller.tsx`：填寫過去的疼痛狀況和疼痛程度
* `Interact.css`：空的
* `Interact.tsx`：整合回報的資料，並傳給後端

### /ts
* `constants.ts`：儲存各身體部位的資料
* `types.ts`：儲存各參數的資料型態

### 其他檔案
* `Admin.css`：管理介面的表格、文字的大小和位置
* `Admin.tsx`：更改使用者資料、查看使用者疼痛統計
* `Home.css`：首頁的背景圖片、文字的大小和位置
* `Home.tsx`：首頁的文字內容、中間按鈕的導向
* `Login.css`：登入介面的文字的大小和位置
* `Login.tsx`：使用者登入
* `Logout.tsx`：使用者登出
* `Navig.tsx`：上方工作列的按鈕(會依使用者身分變化)
* `NotFound.css`：無此頁面的文字的大小和位置
* `NotFound.tsx`：無此頁面的文字內容
* `Profile.css`：使用者個人資料頁面的資料格式和排版
* `Profile.tsx`：使用者個人資料頁面的顯示內容
* `Stats.css`：疼痛統計頁面的外觀
* `Stats.tsx`：疼痛統計頁面的顯示內容、依時間/部位篩選、匯出至Excel
* `withAuthRedirect.tsx`：將未登入使用者訪問登入後才可使用的功能的請求重新導向至首頁