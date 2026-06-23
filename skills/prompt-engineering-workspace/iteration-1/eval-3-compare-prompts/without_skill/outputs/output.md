# Prompt Comparison: Code Review Prompts A vs B

## The Two Prompts

| | Prompt |
|---|---|
| **A** | "Review this code and find bugs" |
| **B** | "You are a senior security engineer. Review the following code for: 1) Security vulnerabilities (SQL injection, XSS, auth bypass), 2) Performance bottlenecks, 3) Error handling gaps. Output findings as a JSON array with severity, location, and fix suggestion fields." |

---

## Verdict: Prompt B is significantly better

---

## Detailed Analysis

### 1. Role Assignment

| Dimension | Prompt A | Prompt B |
|---|---|---|
| Role | None | "Senior security engineer" |

Prompt B assigns a specific persona. This primes the model to adopt the mindset, vocabulary, and prioritization of a security-focused expert. The model will weight security findings more heavily, use domain-appropriate terminology, and apply professional-grade scrutiny. Prompt A leaves the role undefined, so the model defaults to a generic reviewer — likely producing shallow, unfocused commentary.

### 2. Scope and Specificity

| Dimension | Prompt A | Prompt B |
|---|---|---|
| Scope | "find bugs" — completely open-ended | Three explicit categories with sub-examples |

Prompt A's "find bugs" is hopelessly vague. "Bugs" could mean anything: typos, logic errors, style issues, missing features, test gaps. The model must guess what the user cares about, and it will spread its effort thinly across many possible interpretations.

Prompt B defines **three concrete review dimensions**:
1. **Security vulnerabilities** — further constrained with named examples (SQL injection, XSS, auth bypass)
2. **Performance bottlenecks** — a specific class of issue
3. **Error handling gaps** — another specific class

This scoping has two critical effects:
- **Focus**: The model concentrates its reasoning capacity on the areas that matter to the user.
- **Completeness**: The enumerated list acts as a checklist, reducing the chance the model skips a category.

### 3. Output Format Constraint

| Dimension | Prompt A | Prompt B |
|---|---|---|
| Output format | Unspecified | JSON array with defined fields |

Prompt A produces free-form text — paragraphs, bullet points, or whatever the model decides. This is:
- Hard to parse programmatically
- Inconsistent across runs
- Difficult to integrate into CI/CD pipelines or dashboards

Prompt B demands a **structured JSON array** with explicit fields:
- `severity` — enables triage and filtering
- `location` — enables precise mapping to code
- `fix suggestion` — makes findings actionable

This structure makes the output **machine-readable, consistent, and immediately useful** for automated tooling.

### 4. Actionability

| Dimension | Prompt A | Prompt B |
|---|---|---|
| Actionability | Low — vague findings likely | High — each finding has severity + fix |

Prompt A might return "There's a potential issue on line 42." That's not actionable. Prompt B forces every finding to include a severity level (so you know what to fix first) and a fix suggestion (so you know *how* to fix it). This transforms the output from "information" into "a work plan."

### 5. Reproducibility

| Dimension | Prompt A | Prompt B |
|---|---|---|
| Reproducibility | Low — high variance between runs | Higher — constrained format and scope reduce variance |

Because Prompt A is so open-ended, two runs on the same code may produce wildly different outputs. Prompt B's constraints narrow the output space, making results more consistent and comparable across runs.

---

## Why Prompt A Falls Short: Cognitive Load on the Model

Prompt A offloads all decision-making to the model:
- *What kind of bugs?*
- *How deep should I go?*
- *How should I present findings?*
- *What level of detail?*

Each of these decisions consumes reasoning tokens that could have been spent on actual analysis. Prompt B resolves these decisions upfront, freeing the model's capacity for deeper, more focused reasoning.

---

## Score Summary

| Criterion | Prompt A | Prompt B |
|---|---|---|
| Role clarity | 1/5 | 5/5 |
| Scope specificity | 1/5 | 5/5 |
| Output structure | 1/5 | 5/5 |
| Actionability | 1/5 | 5/5 |
| Reproducibility | 1/5 | 4/5 |
| **Overall** | **1/5** | **4.8/5** |

---

## Conclusion

Prompt B is decisively better. It applies three core prompt engineering principles that Prompt A neglects entirely:

1. **Persona framing** — sets expertise level and perspective
2. **Constrained scope with examples** — focuses reasoning and acts as a completeness checklist
3. **Structured output specification** — ensures machine-readable, consistent, actionable results

Prompt A is not "wrong" — it will produce *something* — but that something will be unfocused, inconsistent, and far less useful than what Prompt B produces. The difference is not marginal; it is the difference between a toy and a tool.
