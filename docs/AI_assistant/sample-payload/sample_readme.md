# AI Assistant Test JSON Files

This directory contains sample data for testing the `/analysis` and `/recommendation` endpoints.

- **Analysis (`GET /analysis/health/:userId`)**: Since this is a GET request with no body, the JSON files below represent **Sample Responses**.
- **Recommendation (`POST /recommendation`)**: This is a POST request, so the JSON files represent **Request Bodies**.

---

## 1. /analysis/health/:userId Test Cases (Response Examples)

### 1.1 analysis-valid.json
- **Type:** Valid Response
- **Description:** Successful analysis with data.
- **Expected Status:** `200 OK`

### 1.2 analysis-boundary.json
- **Type:** Boundary Response (No Data)
- **Description:** User exists but has no forms found.
- **Expected Status:** `200 OK`

### 1.3 analysis-invalid.json
- **Type:** Error Response
- **Description:** Invalid User ID format (e.g. string instead of int).
- **Expected Status:** `400 Bad Request`

---

## 2. /recommendation Test Cases (Request Body Examples)

### 2.1 recommendation-valid.json
- **Type:** Valid Request
- **Description:** Standard request with `userId` and `analysisContext`.
- **Expected Status:** `200 OK` (When implemented)

### 2.2 recommendation-boundary.json
- **Type:** Boundary Request
- **Description:** Missing `analysisContext`; should use raw data only.
- **Expected Status:** `200 OK` (When implemented)

### 2.3 recommendation-invalid.json
- **Type:** Invalid Request
- **Description:** Missing required `userId`.
- **Expected Status:** `400 Bad Request`
