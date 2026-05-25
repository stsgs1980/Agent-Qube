# Prompt Improvement: API Documentation Generator

## Problem Analysis

Your current prompt — **"Write API docs for my endpoint."** — is too vague and gives the AI almost no constraints. Here's why it produces generic output:

| Issue | Why It Matters |
|---|---|
| **No endpoint details** | The AI doesn't know the HTTP method, path, parameters, or response shape, so it invents placeholders that don't match your API. |
| **No style guide** | Without seeing your documentation conventions, the AI defaults to whatever its training data suggests (often Swagger-style or a generic template). |
| **No format spec** | The AI doesn't know whether you want Markdown, OpenAPI YAML, inline code comments, or a Confluence page. |
| **No examples** | Zero-shot prompts with no reference output lead to high variance — each run may look different. |
| **No tone/voice guidance** | The AI can't match your team's writing style (formal vs. conversational, active vs. passive voice). |
| **No structural requirements** | You get whatever sections the AI decides to include, which likely won't match your standard sections. |

---

## Improved Prompt

Below is a significantly improved version. Replace the bracketed placeholders with your real values.

---

```
You are a technical writer for [Company/Team Name]. Write API documentation for the following endpoint, strictly following our documentation style and conventions.

## Endpoint Details
- HTTP Method: [e.g., POST]
- Path: [e.g., /api/v2/users/{userId}/orders]
- Summary: [One-sentence description of what this endpoint does]
- Auth Required: [Yes/No — and which scheme, e.g., Bearer token, API key]
- Rate Limit: [e.g., 100 requests/minute, or "None"]

## Request
### Path Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| [userId] | [string] | [Yes] | [The unique identifier of the user] |

### Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| [page] | [integer] | [No] | [Page number for pagination. Default: 1] |

### Request Body (if applicable)
Provide a JSON schema or example:
```json
{
  "productId": "string, required — UUID of the product",
  "quantity": "integer, required — must be >= 1"
}
```

## Response
### Success (200 OK)
```json
{
  "orderId": "string",
  "status": "string",
  "createdAt": "ISO 8601 datetime"
}
```

### Error Responses
- 400 Bad Request — [description]
- 401 Unauthorized — [description]
- 404 Not Found — [description]
- 500 Internal Server Error — [description]

## Documentation Style Guide
Follow these rules exactly:
1. Use present tense, imperative mood for descriptions (e.g., "Returns the list of orders" not "This endpoint will return the list of orders").
2. Use serial comma in lists.
3. Capitalize HTTP methods (GET, POST, PUT, DELETE).
4. Include a "Try It" curl example for every endpoint.
5. Use `code backticks` for all parameter names, paths, and HTTP methods in prose.
6. Document every possible error response — never omit error codes.
7. Keep descriptions concise: one sentence for summaries, no more than two for details.

## Reference Example
Here is an example of our documentation style:

---

### GET /api/v2/products

Returns a paginated list of products.

**Auth:** Bearer token required.

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category` | string | No | Filter by product category |
| `limit` | integer | No | Max results per page. Default: 20, Max: 100 |
| `page` | integer | No | Page number. Default: 1 |

#### Response — 200 OK

```json
{
  "data": [
    {
      "id": "prod_abc123",
      "name": "Widget Pro",
      "price": 29.99
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_PARAM | `category` is not a valid filter value |
| 401 | UNAUTHORIZED | Missing or invalid Bearer token |
| 500 | INTERNAL_ERROR | Unexpected server error |

#### Try It

```bash
curl -X GET "https://api.example.com/v2/products?category=electronics&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

Now, write the documentation for the endpoint specified above in the same style.
```

---

## What Changed and Why

| # | Improvement | Technique Used | Impact |
|---|---|---|---|
| 1 | Added **role** ("technical writer for [Company]") | Role assignment | Grounds the AI in a specific persona and org context |
| 2 | Provided **structured endpoint details** with explicit fields | Structured input | Removes guesswork about method, path, params, responses |
| 3 | Specified **documentation style guide** as numbered rules | Constraint specification | Forces the AI to follow your exact conventions |
| 4 | Included a **reference example** | Few-shot prompting | Shows the AI exactly what "good" looks like — this is the single most impactful change |
| 5 | Required **error documentation** | Completeness constraint | Prevents the AI from skipping error responses |
| 6 | Added **"Try It" curl example** | Structural requirement | Ensures every doc includes an actionable code snippet |
| 7 | Specified **tone and grammar rules** | Style enforcement | Matches your team's writing voice consistently |
| 8 | Used **"strictly following"** language | Emphasis directive | Signals that deviations from the style are unacceptable |

---

## Quick Wins (If You Want Something Shorter)

If the full prompt above is too long for your workflow, these three changes alone will dramatically improve results:

1. **Add a reference example** — Paste one doc you love and say: *"Write in exactly this style."*
2. **Specify the endpoint details** — Even just: *"POST /api/v2/users/{userId}/orders — creates a new order for a user. Returns orderId, status, createdAt."*
3. **List your required sections** — *"Include: summary, auth, parameters, request body, response schema, error codes, and a curl example."*

A minimal improved prompt:

> Write API docs for `POST /api/v2/users/{userId}/orders` which creates a new order. Auth: Bearer token. Request body: productId (string, required), quantity (integer, required, >=1). Response 200: orderId, status, createdAt. Include these sections: summary, auth, parameters, request body, response, errors, and a curl example. Use present tense imperative. Here is our style example: [paste one example doc].

---

## Summary

The root cause of generic output is **under-specification**. Your original prompt gave the AI zero constraints, zero examples, and zero style guidance. The improved prompt fixes all three by providing structured input, explicit style rules, and a concrete reference example. The single highest-leverage change is **adding a reference example** — this alone will cut generic output significantly.
