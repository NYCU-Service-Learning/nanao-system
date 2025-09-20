---
title: 南澳資料庫API文件

---

# API

## 錯誤回報
### 400 (bad request)
json格式錯誤或json檔裡面有缺少或多餘的欄位

### 401 (unauthorized)
未登入或登入時密碼錯誤

### 403 (forbidden)
目前登入帳戶權限不足

### 404 (not found)
試圖操作id不存在的user或URL輸入錯誤

### 409 (conflict)
在POST新的method時出現重複的用戶名

### 429 (too many request)
<3 request / sec
<100 request / min

## 權限
權限是透過當前登入使用者的身分來判斷能否使用這個API
目前有三種的權限等級
### Admin Only
只有ADMIN可使用
### Admin or Same User

身分為ADMIN或是要修改/查看的資料所屬的使用者，才可使用

### No Limit
沒有限制

## 特殊用途API
### 回傳指定username的id
method: GET
URL: http://localhost:3000/user/find/{username}
Permission: No Limit

### 核對帳密正確性及獲取權限
method: POST
URL: http://localhost:3000/auth/login
Permission: No Limit
```json
{
    "username": "david_liu",
    "password": "49494949"
}
```
如果username不存在會回傳400，密碼不正確會回傳401，密碼正確會回傳true

### 登出並刪除權限
method: DELETE
URL: http://localhost:3000/auth/logout
Permission: No Limit
## userAPI
### user
method: POST
URL: http://localhost:3000/user
Permission: No Limit
Example:
```json
{
  "username": "john123",
  "password": "password123",
  "name": "john_doe",
  "role": "ADMIN",
  "userDetail": {
    "create": {
      "gender": "MALE",
      "birthday": "1990-05-15",
      "age": 32,
      "medical_History": "None",
      "address": "123 Main St",
      "email": "john.doe@example.com",
      "phone": "555-123-4567"
    }
  }
},
{
  "username": "david123",
  "password": "49494949",
  "name": "david_liu",
  "role": "USER"  
},
{
  "username": "john456",
  "password": "abcdefg",
  "name": "john_cena",
  "role": "USER"
}
```

method: GET
1. Get all user
URL: http://localhost:3000/user
Permission: Admin Only
2. Get user by id
URL: http://localhost:3000/user/{id}
Permission: Admin or Same User
3. Get id by username
URL: http://localhost:3000/user/find/{username}
Permission: No Limit

method: PATCH
URL: http://localhost:3000/user/{id}
Permission: Admin or Same User
Example:
```json
{
  "username": "David_Liu",
  "password": "49494949494949",
  "role": "USER"
}
```

method: DELETE
URL: http://localhost:3000/user/{id}
Permission: Admin or Same User



### user-detail

method: POST
URL: http://localhost:3000/user-detail
Permission: Admin or Same User
Example:
```json
{
  "gender": "MALE",
  "birthday": "1999-04-09",
  "age": 49,
  "medical_History": "Brain damaged",
  "address": "49 Main St",
  "email": "davidliu@gmail.com",
  "phone": "494-949-4949",
  "user": {
    "connect": {
      "id": 1
    }
  }
},
{
  "gender": "FEMALE",
  "birthday": "1985-08-15",
  "age": 37,
  "medical_History": "Heart condition",
  "address": "37 Elm St",
  "email": "sarahsmith@example.com",
  "phone": "555-123-4567",
  "user": {
    "connect": {
      "id": 2
    }
  }
},
{
  "gender": "OTHER",
  "birthday": "1970-03-22",
  "age": 52,
  "medical_History": "Diabetes",
  "address": "52 Oak St",
  "email": "alexjones@example.com",
  "phone": "777-987-6543",
  "user": {
    "connect": {
      "id": 3
    }
  }
}
```

method: GET
1. Get all user detail
URL: http://localhost:3000/user-detail
Permission: Admin Only
2. Get user detail by user_id
URL: http://localhost:3000/user-detail/{user_id}
Permission: Admin or Same User

method: PATCH
URL: http://localhost:3000/user-detail/{user_id}
Permission: Admin or Same User
Example:
```json
{
  "gender": "FEMALE",
  "birthday": "1999-04-07",
  "age": 47,
  "medical_History": "No",
  "address": "48 Main St",
  "email": "DavidLiu@gmail.com",
  "phone": "494-949-4949"
}
```

method: DELETE
URL: http://localhost:3000/user-detail/{user_id}
Permission: Admin or Same User

## formAPI
### API類別
#### 疼痛程度
hurtform/
#### 一周是否疼痛
weekform/
#### 一年是否疼痛
yearform/
### JSON格式
```json
{
  "id": 1,
  "user_id": 5,
  "fill_time": "2012-04-21T18:25:43-05:00" , //ISO 8601 DateTime
  "neck": 0,
  "right_upper_arm": 0,
  "right_shoulder": 0,
  "right_lower_arm": 0,
  "right_hand": 0,
  "left_upper_arm": 0,
  "left_shoulder": 0,
  "left_lower_arm": 0,
  "left_lower_leg": 0,
  "left_hand": 0,
  "left_upper_leg": 0,
  "left_ankle": 0,
  "left_feet": 0,
  "left_knee": 0,
  "right_lower_leg": 0,
  "right_ankle": 0,
  "right_upper_leg": 0,
  "right_feet": 0,
  "right_knee": 0,
  "abdomen": 0,
  "lower_body": 0,
  "upper_body": 0,
  "right_ear": 0,
  "left_ear": 0,
  "head": 0,
  "right_eye": 0,
  "mouth": 0,
  "left_eye": 0,
  "nose": 0,
  "back_head": 0,
  "back_neck": 0,
  "left_elbow": 0,
  "right_elbow": 0,
  "lower_back": 0,
  "back": 0,
  "butt": 0,
  "right_upper_shoulder": 0
}
```
對於 hurtform，變數資料型態為int
對於 weekform和yearform，變數型態為boolean
## API 使用方式
### 注意事項
1. 以下用form代替三種form
2. 大括號代表要填入的變數

### GET
1. Get all form belong to the user
URL: http://localhost:3000/form/{user_id}
Permission: Admin Only
回傳為一個陣列包含多個表單物件
從近到遠排序
2. 詢問使用者的一段時間內的表單
URL: http://localhost:3000/form/{user_id}/?start={startTime}&end={endTime}
Permission: Admin or Same User
回傳為一個陣列內包含多個表單物件
start是起始時間，end是結束時間，start要比end早，時間請使用ISO-8601
從近到遠排序
若只要起始時間，可以不要加上end
http://localhost:3000/form/:userId/?start={startTime}
同樣也可以不要結束時間


3. 詢問使用者最近數個的表單
URL: httpform/{user_id}/{number}
Permission: Admin or Same User
回傳為一個陣列內包含number個表單物件
代表user最新的number個表單填寫紀錄
從近到遠排序


method: POST
URL: http://localhost:3000/form/{user_id}
Permission: Admin or Same User
對於對於指定使用者，傳入表單資料，新增表單填寫紀錄
JSON檔格式為表單格式但不包含id, user_id和fill_time

method: DELETE
URL: http://localhost:3000/form/{form_id}
Permission: Admin or Same User
刪除指定id的表單
要注意是指定form_id，不是user_id
