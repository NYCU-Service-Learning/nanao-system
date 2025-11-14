# AI Assistant Module

This document defines the architecture, requirements, data specifications, test data, and API testing procedures for the **AI Assistant module** in the `nanao-system` project.  
It covers both the **analysis** and **workout recommendation** pipelines.

The backend uses **NestJS**; the frontend uses **Vue3 + Vite**.

---

## 1. Overview

The AI Assistant module provides two backend capabilities:

1. **`POST /analysis`**  
   Aggregates and formats user data (hurtform / weekform / yearform / personal profile) into a structured input for the LLM, then returns a summarized analysis.

2. **`POST /recommendation`**  
   Uses analysis outputs and/or raw data to generate structured workout recommendations.

The **backend (NestJS)** is responsible for validation, transformation, and communication with the LLM provider.  
The **frontend (Vue3 + Vite)** displays the final analysis and recommendation results.

---

## 2. User Flow

1. User logs into the system via frontend.
2. User fills out relevant forms (hurtform, weekform, yearform, etc.).
3. Frontend stores forms via existing form APIs (already implemented in project).
4. When the user opens the analysis page, the frontend calls:
   - `POST /analysis` with `userId` and optional `timeRange`.
5. Backend:
   - Fetches user and form data from MySQL via Prisma.
   - Validates and normalizes data.
   - Builds the LLM payload.
   - Calls the LLM and receives structured JSON.
   - Validates and returns the analysis response to frontend.
6. Frontend renders analysis (summary, risk, key findings, focus points).
7. Frontend optionally calls:
   - `POST /recommendation` to get workout recommendations.
8. Backend:
   - Uses `userId` and optional `analysisContext`.
   - Builds LLM payload for recommendations.
   - Calls LLM, validates structured workout cards, and returns to frontend.
9. Frontend displays workout recommendation cards.

---

## 3. Module Requirements (Functional / Non-functional)

### Functional Requirements

#### Analysis Module (`POST /analysis`)

- Accepts:
  - `userId` (required).
  - `timeRange.from`, `timeRange.to` (optional ISO date strings).
- Fetches all relevant forms for the user:
  - `hurtform` (int severity per body region).
  - `weekform` (boolean per body region).
  - `yearform` (boolean per body region).
- Cleans and normalizes data.
- Builds an LLM payload including:
  - User profile
  - Time range
  - Historical form data
- Calls LLM and expects structured JSON output.
- Returns:
  - `summary`
  - `overallRisk`
  - `keyFindings[]`
  - `suggestedFocus[]`
  - `rawModelMeta`
- Validates:
  - Required fields and types
  - `overallRisk` ∈ {low, medium, high}

#### Recommendation Module (`POST /recommendation`)

- Accepts:
  - `userId` (required)
  - Optional `analysisContext`
- Uses user data and/or analysis context to construct an LLM payload.
- Returns:
  - `cards[]` with:
    - `id`
    - `title`
    - `category`
    - `intensityLevel`
    - `frequencyPerWeek`
    - `estimatedDurationMinutes`
    - `description`
    - `caution`
  - `rawModelMeta`
- Ensures cards are safe, readable, and follow schema.

### Non-functional Requirements

- **Consistency**: Schema must remain stable.
- **Safety**: No medical diagnoses; include proper cautions.
- **Robustness**: Handle LLM errors gracefully.
- **Performance**: Responses should be generated within timeout.
- **Maintainability**: Prompt versions tracked in `rawModelMeta`.

---

## 4. Data Flow Specification (analysis / recommendation)

### Analysis Module
```
[Frontend] -- POST /analysis --> [Backend]
    └─ Validate
    └─ DB fetch (Prisma)
    └─ Normalize data
    └─ Build LLM payload
    └─ Call LLM
    └─ Validate JSON output
    └─ Return to frontend
```

### Recomendation Module
```
[Frontend] -- POST /recommendation --> [Backend]
    └─ Validate
    └─ Get analysisContext or user data
    └─ Build LLM payload
    └─ Call LLM
    └─ Validate workout cards
    └─ Return to frontend
```
---

## 5. API Specifications (request / response schemas)

### `/analysis`

#### Request Schema

```json
{
  "userId": 123,
  "timeRange": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  }
}
```

#### Response Schema

```json
{
  "userId": 123,
  "timeRange": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  },
  "summary": "string",
  "overallRisk": "low",
  "keyFindings": [
    {
      "id": "string",
      "title": "string",
      "detail": "string"
    }
  ],
  "suggestedFocus": ["string"],
  "rawModelMeta": {
    "model": "gpt-4o-mini",
    "promptVersion": "analysis-v1"
  }
}
```


### `/recommendation`

#### Request Schema

```json
{
  "userId": 123,
  "analysisContext": {
    "overallRisk": "medium",
    "keyFindings": ["lower_back_trend"]
  }
}
```

#### Response Schema

```json
{
  "userId": 123,
  "cards": [
    {
      "id": "string",
      "title": "string",
      "category": "stretching",
      "intensityLevel": "low",
      "frequencyPerWeek": 3,
      "estimatedDurationMinutes": 10,
      "description": "string",
      "caution": "string"
    }
  ],
  "rawModelMeta": {
    "model": "gpt-4o-mini",
    "promptVersion": "recommendation-v1"
  }
}
```

### Error & Permission Policy for AI Endpoints

The `/analysis` and `/recommendation` endpoints follow the **global backend API rules**:

- `400 Bad Request`  
  - Invalid JSON format  
  - Missing required fields (e.g., `userId`)  
  - Extra unknown fields in the request body  

- `401 Unauthorized`  
  - User not logged in or login session expired  

- `403 Forbidden`  
  - Current user is not allowed to access another user’s data  

- `404 Not Found`  
  - Target user does not exist  

- `429 Too Many Requests`  
  - Rate limit exceeded (same as global API policy)  

**Permission model**

- `/analysis`: **Admin or Same User**  
- `/recommendation`: **Admin or Same User**  

These rules are consistent with the existing `user` and `form` APIs in the backend.
