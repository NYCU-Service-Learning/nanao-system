# AI Assistant — Testing Documentation

This document provides **test data**, **test cases**, and **API verification procedures** for the AI Assistant module of the `nanao-system` project.

It covers two backend AI endpoints:

- `POST /analysis`
- `POST /recommendation`

The goal of Task E W2 is to ensure correctness, reliability, validation behavior, and error-handling stability.

---

# 1. Test Data Overview

Test JSONs are divided into:

- **Valid test cases**
- **Boundary test cases**
- **Invalid/error test cases**

These samples are designed for Postman / Thunder Client and automated testing.

---

# 2. Valid Test Data

## 2.1 `/analysis` — valid
```json
{
  "userId": 2,
  "timeRange": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  }
}
```

## 2.2 /recommendation — valid
```json
{
  "userId": 2,
  "analysisContext": {
    "overallRisk": "medium",
    "keyFindings": ["lower_back_trend"]
  }
}
```


# 3. Boundary Test Data

## 3.1 /analysis — missing timeRange
```json
{
  "userId": 2
}
```

## 3.2 /analysis — new user with no forms
```json
{
  "userId": 999,
  "timeRange": {
    "from": "2025-01-01",
    "to": "2025-01-02"
  }
}
```

## 3.3 /recommendation — missing analysisContext
```json
{
  "userId": 2
}
```


# 4. Invalid Test Data

## 4.1 /analysis — missing userId
```json
{}
```

## 4.2 /analysis — invalid date format
```json
{
  "userId": 2,
  "timeRange": {
    "from": "INVALID_DATE",
    "to": "WRONG"
  }
}
```

## 4.3 /recommendation — invalid analysisContext structure
```json
{
  "userId": 2,
  "analysisContext": {
    "overallRisk": "super_high",
    "keyFindings": "not-an-array"
  }
}
```


# 5. Expected Status Codes

- Case 2.1 `/analysis` — valid  
  - Expected: `200 OK`

- Case 2.2 `/recommendation` — valid  
  - Expected: `200 OK`

- Case 3.1 `/analysis` — missing `timeRange`  
  - Expected: `200 OK`  
  - Backend falls back to default time range (e.g., recent forms).

- Case 3.2 `/analysis` — new user with no forms  
  - Expected: `200 OK`  
  - Analysis may indicate "insufficient data" in `summary`.

- Case 3.3 `/recommendation` — missing `analysisContext`  
  - Expected: `200 OK`  
  - Backend builds recommendation based on raw form data only.

- Case 4.1 `/analysis` — missing `userId`  
  - Expected: `400 Bad Request`

- Case 4.2 `/analysis` — invalid date format  
  - Expected: `400 Bad Request`

- Case 4.3 `/recommendation` — invalid `analysisContext` structure  
  - Expected: `400 Bad Request`



# 6. API Testing Procedure

## 6.1 Local Development (NestJS directly)

1. Start the local MySQL server (`localhost:3306`) and ensure the database `nanao_db` already exists.

2. Start the backend in development mode:
   ```bash
   cd backend
   npm run start:dev
  ```

3. Confirm that NestJS starts successfully.
Default base URL:
  ```bash
  http://localhost:3000
  ```

4. Test the API using Postman or Thunder Client:

Testing /analysis
- URL: http://localhost:3000/analysis
- Method: POST
- Headers: Content-Type: application/json
- Body:
Select raw, paste any test JSON from Sections 2–4 of this document.

Testing /recommendation
- URL: http://localhost:3000/recommendation
- Method: POST
- Headers: Content-Type: application/json
- Body:
Use the test JSON samples provided in the /recommendation test cases.


5. Compare the actual results with `Section 5 — Expected Status Codes to verify`:
- Correct HTTP status code
- Correct response JSON schema


## 6.2 Docker Environment (docker-compose)

1. In the project root directory, start the Docker services:
```bash
docker-compose up -d
```

This starts:

- `nanao-system-backend-1` (NestJS)
- `nanao-system-db-1` (MySQL)
- `nanao-system-frontend-1` (frontend)

2. After containers start, the backend is accessible from the host at:
   http://localhost:3000





4. Test the API using Postman or Thunder Client:

Testing (same as local mode)

- POST http://localhost:3000/analysis
- POST http://localhost:3000/recommendation

4.Use the test JSON samples included in this document.

Verification criteria:

- Success scenarios:

  - Should return 200 OK, and response JSON must match the schemas defined in the specification document.

- Error scenarios:
  Use invalid/boundary JSON samples from Section 4 and confirm:

  - Returned HTTP status codes match Section 5 — Expected Status Codes
  - Error messages follow the global backend API rules