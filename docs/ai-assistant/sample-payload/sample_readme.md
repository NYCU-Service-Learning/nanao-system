# AI Assistant Test JSON Files

This directory contains sample request bodies used to test  
the `/analysis` and `/recommendation` endpoints.

The JSON files are grouped into **valid**, **boundary**, and **invalid** cases.
All JSON files contain pure JSON without comments (comments are documented only here).

---

## 1. /analysis Test Cases

### 1.1 analysis-valid.json
- **Type:** Valid case  
- **Description:** Correct request format with valid timeRange  
- **Expected Status:** `200 OK`

### 1.2 analysis-boundary-missing-timeRange.json
- **Type:** Boundary case  
- **Description:** timeRange omitted; backend should fall back to defaults  
- **Expected Status:** `200 OK`

### 1.3 analysis-invalid-dateFormat.json
- **Type:** Invalid case  
- **Description:** timeRange contains malformed date strings  
- **Expected Status:** `400 Bad Request`

---

## 2. /recommendation Test Cases

### 2.1 recommendation-valid.json
- **Type:** Valid case  
- **Description:** Proper analysisContext structure  
- **Expected Status:** `200 OK`

### 2.2 recommendation-boundary-missingAnalysisContext.json
- **Type:** Boundary case  
- **Description:** analysisContext omitted; backend generates recommendations using only user data  
- **Expected Status:** `200 OK`

### 2.3 recommendation-invalid-context.json
- **Type:** Invalid case  
- **Description:** Wrong types inside analysisContext  
- **Expected Status:** `400 Bad Request`

---

## Usage

These JSON files are intended for:
- Postman / Thunder Client manual testing
- Automated testing in CI
- Backend validation testing

Copy the JSON from each file directly into your API testing tool.

