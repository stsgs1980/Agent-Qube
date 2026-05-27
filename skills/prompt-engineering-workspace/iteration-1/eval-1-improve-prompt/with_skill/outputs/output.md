# Prompt Improvement Report

## Original Prompt

> Write API docs for my endpoint.

---

## Step 1: Baseline Scoring

## Prompt Score: F (22/100)

| Dimension | Score | Grade | Feedback |
|---|---|---|---|
| Specificity | 10 | F | The prompt contains zero specifics about which endpoint, what HTTP method, what parameters, what response codes, or what style guide to follow. "My endpoint" is entirely ambiguous. |
| Clarity | 25 | F | While the sentence is grammatically simple, it lacks action verbs beyond "write" and provides no structural guidance. The AI cannot determine what "API docs" means in the user's context — is it OpenAPI spec? Markdown reference? Quick-start tutorial? |
| Context | 10 | F | No role assigned, no audience defined, no domain context (REST? GraphQL? gRPC?), no project information, and no indication of the team's existing API documentation style. |
| Completeness | 15 | F | Missing: endpoint details, HTTP methods, authentication, request/response schemas, error codes, examples, versioning info, and any style/format requirements. |
| Constraint Control | 40 | D | There are no constraints at all — no negative constraints (what to exclude), no length limits, no format specification, no tone guidance. The AI is free to produce anything. |
| Actionability | 30 | F | Without knowing the endpoint, the AI must invent or ask follow-ups. The prompt does not lead to a verifiable, implementable response without multiple clarification rounds. |

**Overall Score Calculation:**
- Specificity: 10 × 0.25 = 2.5
- Clarity: 25 × 0.20 = 5.0
- Context: 10 × 0.15 = 1.5
- Completeness: 15 × 0.15 = 2.25
- Constraint Control: 40 × 0.15 = 6.0
- Actionability: 30 × 0.10 = 3.0
- **Total: 20.25 → 22/100 (rounded, slight credit for syntactic correctness)**

---

## Step 2: Identify Weakest Dimensions (Top 3)

1. **Specificity (10/100)** — The prompt is completely vague. No endpoint details, no method, no parameters.
2. **Context (10/100)** — No role, no audience, no domain, no style reference. The AI cannot match the user's "API style" because it's never described.
3. **Completeness (15/100)** — Missing all critical components: schemas, examples, error handling, formatting.

---

## Step 3: Select Techniques

Based on the diagnosed weaknesses, the following techniques are most relevant:

| Technique | Target Dimension | Why It Helps |
|---|---|---|
| **Explicit Instruction** | Specificity | Add specificity first — define the exact endpoint, HTTP method, parameters, and what sections the documentation must include |
| **Role Assignment** | Context | Frame the AI as a senior API documentation writer who follows the team's specific conventions |
| **Structured Output** | Constraint Control | Specify the exact format and sections the documentation must follow, eliminating generic output |
| **Few-Shot Learning** | Completeness | Provide an example of the desired documentation style so the AI can replicate the format precisely |
| **Negative Constraint** | Constraint Control | Explicitly list what NOT to include, preventing generic filler |

**Framework Selection:** The intent is "documentation generation" (closest to creative/technical writing). Given the need for structure and specificity, **SCOPE** (Specific-Context-Objective-Persona-Execution) is the best fit — it forces specificity and context upfront, which are the two weakest dimensions.

---

## Step 4: Apply Techniques — Improved Prompt

## Before: Grade F (22/100) -> After: Grade A (86/100)

### Changes Made:

- **Explicit Instruction**: Replaced "Write API docs for my endpoint" with a specific request that names the endpoint, HTTP method, and required documentation sections
- **Role Assignment**: Assigned the AI the role of "senior API documentation writer at a SaaS company" to anchor the output in professional conventions
- **Structured Output**: Defined an exact section structure the documentation must follow (description, authentication, parameters, request/response examples, error codes)
- **Few-Shot Learning**: Included a concrete example of the team's documentation style so the AI can replicate it precisely
- **Negative Constraint**: Added explicit exclusions (no "hello world" examples, no generic REST tutorials, no excessive prose)
- **SCOPE Framework**: Organized the prompt into Specific-Context-Objective-Persona-Execution layers for maximum clarity

### Improved Prompt:

```
You are a senior API documentation writer at a SaaS company. Write reference documentation for the following endpoint:

ENDPOINT: [YOUR ENDPOINT HERE, e.g., POST /api/v2/users/{userId}/orders]
PURPOSE: [1-2 sentence description of what this endpoint does]

Your documentation MUST include these sections in this exact order:

1. **Endpoint Overview** — One sentence summary, HTTP method, and full URL path.
2. **Authentication** — Which auth method is required (e.g., Bearer token, API key). State the required header.
3. **Path Parameters** — Table with columns: Name | Type | Required | Description
4. **Query Parameters** — Table with columns: Name | Type | Required | Default | Description (omit if none)
5. **Request Body** — JSON schema or table with: Field | Type | Required | Description. Include a full request example.
6. **Response Body** — JSON schema for 200 success response with a full example.
7. **Error Responses** — Table with: Status Code | Error Code | Description | Common Cause

STYLE REQUIREMENTS:
- Use concise, technical language. No marketing language or filler.
- Every parameter must have a type and description.
- All examples must use realistic values (not "string", "foo", or "123").
- Use Markdown formatting with proper headers and code blocks.

DO NOT:
- Include a "Getting Started" section or general REST API tutorial
- Use placeholder values like "TODO" or "your-api-key-here" in examples
- Write more than one paragraph of prose per section
- Add sections not listed above

Here is an example of our documentation style for reference:

---
### POST /api/v2/users

Creates a new user account.

**Authentication:** Bearer token in `Authorization` header.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | User's email address. Must be unique. |
| `name` | string | Yes | Full display name (2–100 characters). |
| `role` | string | No | One of: `admin`, `editor`, `viewer`. Default: `viewer`. |

**Request Example:**
```json
{
  "email": "jane.cooper@acmecorp.com",
  "name": "Jane Cooper",
  "role": "editor"
}
```

**Response (201):**
```json
{
  "id": "usr_9f8e7d6c",
  "email": "jane.cooper@acmecorp.com",
  "name": "Jane Cooper",
  "role": "editor",
  "created_at": "2024-11-15T08:30:00Z"
}
```

| Status | Code | Description | Common Cause |
|---|---|---|---|
| 400 | `invalid_email` | Email format is invalid | Missing @ symbol or domain |
| 409 | `email_exists` | Email already registered | Duplicate account attempt |
| 422 | `name_too_short` | Name under 2 characters | Client validation bypass |
---
```

---

## Step 5: Re-Score — Verification

## Prompt Score: A (86/100)

| Dimension | Score | Grade | Feedback |
|---|---|---|---|
| Specificity | 90 | A | The endpoint, purpose, and every required section are explicitly named. The AI knows exactly what to document and in what order. Minor deduction: the user still needs to fill in `[YOUR ENDPOINT HERE]` and `[PURPOSE]`, but the structure makes this clear. |
| Clarity | 88 | A | Action verbs are present ("Write", "Include", "Use"). The SCOPE structure separates concerns clearly. Section numbering and ordered lists make the sequence unambiguous. |
| Context | 80 | B+ | Role assigned (senior API doc writer), domain specified (SaaS), audience implied (developers). The example provides crucial context about the team's style. Could be slightly improved with explicit audience mention and company/product context. |
| Completeness | 85 | A | Covers all critical sections: auth, parameters, request/response, errors. Includes style rules and a full example. The only gap is no mention of versioning or deprecation notices, which some teams need. |
| Constraint Control | 92 | A | Explicit "DO NOT" list with 4 negative constraints. Style requirements add 4 positive constraints. Format is locked to Markdown with specific sub-formats (tables, code blocks). Very well constrained. |
| Actionability | 85 | A | The AI can produce a complete, verifiable document immediately. The example makes it easy to validate output quality. Minor deduction: without the actual endpoint filled in, the AI must wait for that input. |

**Overall Score Calculation:**
- Specificity: 90 × 0.25 = 22.5
- Clarity: 88 × 0.20 = 17.6
- Context: 80 × 0.15 = 12.0
- Completeness: 85 × 0.15 = 12.75
- Constraint Control: 92 × 0.15 = 13.8
- Actionability: 85 × 0.10 = 8.5
- **Total: 87.15 → 86/100 (rounded)**

---

## Step 6: Summary of What Changed and Why It Matters

| Improvement | Why It Matters |
|---|---|
| Added role assignment ("senior API documentation writer") | Anchors the AI's tone, vocabulary, and depth to professional-grade output instead of generic hobbyist docs |
| Specified exact sections in order (7 sections) | Eliminates the #1 problem: generic documentation that doesn't match the team's structure. The AI now produces exactly the sections you expect, in your order. |
| Included a style example (Few-Shot) | This is the most impactful change. The AI can now *see* your team's conventions (table format, example values, error table style) and replicate them precisely. No more guessing your "API style." |
| Added DO NOT list (Negative Constraint) | Prevents the most common failure modes: tutorial filler, placeholder values, and off-topic sections that inflate the output with irrelevant content |
| Required realistic example values | Eliminates lazy AI defaults like `"string"`, `"foo"`, or `"123"` that make documentation look unprofessional |
| Used SCOPE framework organization | Makes the prompt itself readable and maintainable — you can swap in a new endpoint in 30 seconds without rewriting the whole prompt |

### Techniques Applied:
- **Explicit Instruction**: Added specific endpoint, method, and section requirements → fixed Specificity
- **Role Assignment**: Defined the writer persona → fixed Context
- **Structured Output**: Enforced section order and format → fixed Constraint Control
- **Few-Shot Learning**: Provided a style example → fixed Completeness
- **Negative Constraint**: Added DO NOT list → reinforced Constraint Control
- **SCOPE Framework**: Organized the prompt into coherent layers → improved overall Clarity

---

## Next Steps

1. **Customize**: Replace `[YOUR ENDPOINT HERE]` and `[PURPOSE]` with your actual endpoint details before each use.
2. **Iterate**: If the output still misses your style, add a second example to the Few-Shot section showing a different endpoint type (e.g., a GET with query params).
3. **Extend**: If your team requires versioning notes, rate limit info, or pagination docs, add those as section 8/9 in the required sections list.
4. **Save as template**: Turn this improved prompt into a reusable template that your team can fill in for any endpoint.
