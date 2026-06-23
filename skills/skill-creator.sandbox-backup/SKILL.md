---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for creating new skills and iteratively improving them through evaluation.

The high-level workflow is:

1. Decide what the skill should do and roughly how
2. Write a draft of the skill
3. Create test prompts and run a model with access to the skill on them
4. Help the user evaluate the results both qualitatively and quantitatively
5. Rewrite the skill based on feedback
6. Repeat until satisfied
7. Optionally expand the test set and re-evaluate at larger scale

When this skill activates, identify where the user is in this process and help them progress. If the user already has a draft, jump straight to the eval/iterate phase. If the user prefers a more conversational approach without formal evaluation, accommodate that.

After the skill is complete, the description can be optimized separately using the description improver script for better triggering accuracy.

---

## When to Use

Activate this skill when the user wants to:

- **Create a new skill from scratch** — "I want to make a skill for X", "build me a skill that does Y"
- **Edit or improve an existing skill** — "fix the skill I made last week", "make this skill trigger more reliably"
- **Run evals on a skill** — "test this skill", "benchmark it", "compare version A vs version B"
- **Optimize a skill's description** — "the skill isn't triggering when I ask for X", "improve its triggering accuracy"
- **Package a skill for distribution** — "zip this up", "give me a `.skill` file I can reuse"

**Do NOT activate this skill if:**

- The user only wants to **look up a ZAI ID** or see the list of reserved domains → use `zai-skill-registry` instead (read-only reference)
- The user wants to **invoke an existing skill** (e.g., "use the mermaid-diagrams skill") → invoke that skill directly
- The user is asking about **skill standards / format** as documentation → point them to `STD-SKILL-001`

---

## Communicating with the user

Users of this skill have varying levels of familiarity with coding terminology. Pay attention to context cues and adjust language accordingly.

In the default case:

- "evaluation" and "benchmark" are acceptable terms
- "JSON" and "assertion" should only be used without explanation if the user has shown they understand them

Briefly explain terms when in doubt. A short inline definition is preferable to assuming prior knowledge.

---

## Creating a skill

### Capture intent

Start by understanding the user's intent. The current conversation may already contain a workflow the user wants to capture (e.g., they say "turn this into a skill"). If so, extract answers from the conversation history first — tools used, sequence of steps, corrections made, input/output formats observed. The user fills the gaps and confirms before proceeding.

1. What should this skill enable the model to do?
2. When should this skill trigger? (which user phrases / contexts)
3. What is the expected output format?
4. Should test cases be set up to verify the skill works? Skills with objectively verifiable outputs (file transforms, data extraction, code generation, fixed workflow steps) benefit from test cases. Skills with subjective outputs (writing style, art) often do not. Suggest the appropriate default based on skill type, but let the user decide.

### Interview and research

Proactively ask about edge cases, input/output formats, example files, success criteria, and dependencies. Wait to write test prompts until this part is settled.

Check available MCPs — if useful for research (searching docs, finding similar skills, looking up best practices), research in parallel via subagents if available, otherwise inline. Come prepared with context to reduce burden on the user.

### Write the SKILL.md

Based on the user interview, fill in:

- **`name`**: Skill identifier (kebab-case, ≤64 chars)
- **`description`**: When to trigger, what it does. This is the primary triggering mechanism — include both what the skill does AND specific contexts for when to use it. All "when to use" info goes here, not in the body. The description should be on the "pushy" side to combat the model's tendency to undertrigger. For example, instead of `"How to build a simple fast dashboard to display internal Zhipu AI data."`, write `"How to build a simple fast dashboard to display internal Zhipu AI data. Use this skill whenever the user mentions dashboards, data visualization, internal metrics, or wants to display any kind of company data, even if they don't explicitly ask for a 'dashboard.'"`
- **`compatibility`**: Required tools, dependencies (optional, rarely needed)
- **The rest of the skill body**

### Skill anatomy

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic/repetitive tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output (templates, icons, fonts)
```

### Progressive disclosure

Skills use a three-level loading system:

1. **Metadata** (name + description) — always in context (~100 words)
2. **SKILL.md body** — in context whenever skill triggers (<500 lines ideal)
3. **Bundled resources** — as needed (unlimited; scripts can execute without loading)

**Key patterns:**

- Keep SKILL.md under 500 lines. When approaching this limit, add hierarchy with clear pointers about where the model should go next.
- Reference files clearly from SKILL.md with guidance on when to read them.
- For large reference files (>300 lines), include a table of contents.

**Domain organization**: When a skill supports multiple domains/frameworks, organize by variant:

```
cloud-deploy/
├── SKILL.md (workflow + selection)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

The model reads only the relevant reference file.

### Principle of least surprise

Skills must not contain malware, exploit code, or any content that could compromise system security. A skill's contents should not surprise the user in their intent if described. Do not create misleading skills or skills designed to facilitate unauthorized access, data exfiltration, or other malicious activities.

### Writing style

- Prefer the imperative form in instructions.
- Explain why things are important rather than relying on heavy-handed MUSTs.
- Use theory of mind to keep the skill general rather than narrow to specific examples.
- Write a draft, then review with fresh eyes and improve.

### Output format patterns

**Template pattern** — when the skill should always produce a specific document structure:

```markdown
## Eval report format

Use this exact template for the eval report:

# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Examples pattern** — when the skill should follow a specific input/output convention:

```markdown
## Commit message format

**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

### Test cases

After writing the skill draft, come up with 2-3 realistic test prompts — the kind of thing a real user would actually say. Share them with the user for confirmation, then run them.

Save test cases to `evals/evals.json`. Do not write assertions yet — just the prompts. Assertions are drafted in the next step while runs are in progress.

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

See `references/schemas.md` for the full schema (including the `assertions` field, added later).

---

## Running and evaluating test cases

This section is one continuous sequence — do not stop partway through. Do NOT use `/skill-test` or any other testing skill.

Put results in `<skill-name>-workspace/` as a sibling to the skill directory. Within the workspace, organize results by iteration (`iteration-1/`, `iteration-2/`, etc.). Within each iteration, each test case gets a directory (`eval-0/`, `eval-1/`, etc.). Create directories as needed rather than upfront.

### Step 1: Spawn all runs (with-skill AND baseline) in the same turn

For each test case, spawn two subagents in the same turn — one with the skill, one without. Launch everything at once so it all finishes around the same time.

**With-skill run:**

```
Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <eval files if any, or "none">
- Save outputs to: <workspace>/iteration-<N>/eval-<ID>/with_skill/outputs/
- Outputs to save: <what the user cares about — e.g., "the .docx file", "the final CSV">
```

**Baseline run** (same prompt, but the baseline depends on context):

- **Creating a new skill**: no skill at all. Same prompt, no skill path, save to `without_skill/outputs/`.
- **Improving an existing skill**: the old version. Snapshot the skill before editing (`cp -r <skill-path> <workspace>/skill-snapshot/`), then point the baseline subagent at the snapshot. Save to `old_skill/outputs/`.

Write an `eval_metadata.json` for each test case (assertions can be empty for now). Give each eval a descriptive name based on what it is testing — not just "eval-0". Use this name for the directory too. If this iteration uses new or modified eval prompts, create these files for each new eval directory — do not assume they carry over from previous iterations.

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "The user's task prompt",
  "assertions": []
}
```

### Step 2: While runs are in progress, draft assertions

Use this time productively. Draft quantitative assertions for each test case and explain them to the user. If assertions already exist in `evals/evals.json`, review them and explain what they check.

Good assertions are objectively verifiable and have descriptive names — they should read clearly in the benchmark viewer so someone glancing at the results immediately understands what each one checks. Subjective skills (writing style, design quality) are better evaluated qualitatively — do not force assertions onto things that need human judgment.

Update the `eval_metadata.json` files and `evals/evals.json` with the assertions once drafted. Also explain to the user what they will see in the viewer — both the qualitative outputs and the quantitative benchmark.

### Step 3: As runs complete, capture timing data

When each subagent task completes, a notification arrives containing `total_tokens` and `duration_ms`. Save this data immediately to `timing.json` in the run directory:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

This is the only opportunity to capture this data — it comes through the task notification and is not persisted elsewhere. Process each notification as it arrives rather than batching.

### Step 4: Grade, aggregate, and launch the viewer

Once all runs are done:

1. **Grade each run** — spawn a grader subagent (or grade inline) that reads `agents/grader.md` and evaluates each assertion against the outputs. Save results to `grading.json` in each run directory. The `grading.json` expectations array must use the fields `text`, `passed`, and `evidence` (not `name`/`met`/`details` or other variants) — the viewer depends on these exact field names. For assertions that can be checked programmatically, write and run a script rather than eyeballing it — scripts are faster, more reliable, and can be reused across iterations.

2. **Aggregate into benchmark** — run the aggregation script from the skill-creator directory:

   ```bash
   python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
   ```

   This produces `benchmark.json` and `benchmark.md` with pass_rate, time, and tokens for each configuration, with mean ± stddev and the delta. If generating `benchmark.json` manually, see `references/schemas.md` for the exact schema the viewer expects. Put each `with_skill` version before its baseline counterpart.

3. **Do an analyst pass** — read the benchmark data and surface patterns the aggregate stats might hide. See `agents/analyzer.md` (the "Analyzing Benchmark Results" section) for what to look for — assertions that always pass regardless of skill (non-discriminating), high-variance evals (possibly flaky), and time/token tradeoffs.

4. **Launch the viewer** with both qualitative outputs and quantitative data:

   ```bash
   nohup python <skill-creator-path>/eval-viewer/generate_review.py \
     <workspace>/iteration-N \
     --skill-name "my-skill" \
     --benchmark <workspace>/iteration-N/benchmark.json \
     > /dev/null 2>&1 &
   VIEWER_PID=$!
   ```

   For iteration 2+, also pass `--previous-workspace <workspace>/iteration-<N-1>`.

   **Headless environments**: If `webbrowser.open()` is not available or the environment has no display, use `--static <output_path>` to write a standalone HTML file instead of starting a server. Feedback will be downloaded as a `feedback.json` file when the user clicks "Submit All Reviews". After download, copy `feedback.json` into the workspace directory for the next iteration to pick up.

   Use `generate_review.py` to create the viewer — do not write custom HTML.

5. **Tell the user**: "I've opened the results in your browser. There are two tabs — 'Outputs' lets you click through each test case and leave feedback, 'Benchmark' shows the quantitative comparison. When you're done, come back here and let me know."

### What the user sees in the viewer

The "Outputs" tab shows one test case at a time:

- **Prompt**: the task that was given
- **Output**: the files the skill produced, rendered inline where possible
- **Previous Output** (iteration 2+): collapsed section showing last iteration's output
- **Formal Grades** (if grading was run): collapsed section showing assertion pass/fail
- **Feedback**: a textbox that auto-saves as they type
- **Previous Feedback** (iteration 2+): their comments from last time, shown below the textbox

The "Benchmark" tab shows the stats summary: pass rates, timing, and token usage for each configuration, with per-eval breakdowns and analyst observations.

Navigation is via prev/next buttons or arrow keys. When done, the user clicks "Submit All Reviews" which saves all feedback to `feedback.json`.

### Step 5: Read the feedback

When the user says they are done, read `feedback.json`:

```json
{
  "reviews": [
    {"run_id": "eval-0-with_skill", "feedback": "the chart is missing axis labels", "timestamp": "..."},
    {"run_id": "eval-1-with_skill", "feedback": "", "timestamp": "..."},
    {"run_id": "eval-2-with_skill", "feedback": "perfect, love this", "timestamp": "..."}
  ],
  "status": "complete"
}
```

Empty feedback means the user thought it was fine. Focus improvements on the test cases where the user had specific complaints.

Kill the viewer server when done:

```bash
kill $VIEWER_PID 2>/dev/null
```

---

## Improving the skill

This is the heart of the loop. The test cases have been run, the user has reviewed the results, and now the skill needs to be improved based on feedback.

### How to think about improvements

1. **Generalize from the feedback.** The skill is being created to be used many times across many different prompts. Here the user is iterating on only a few examples because it is faster — they know these examples inside out and can assess new outputs quickly. But if the skill works only for those examples, it is useless. Rather than putting in fiddly overfit changes or oppressively constrictive rules, if there is a stubborn issue, try branching out and using different metaphors or recommending different patterns of working.

2. **Keep the prompt lean.** Remove things that are not pulling their weight. Read the transcripts, not just the final outputs — if the skill is making the model waste time doing things that are unproductive, try removing the parts of the skill causing that and observe the result.

3. **Explain the why.** Explain the reasoning behind every instruction. Today's models are smart and have good theory of mind — when given a good harness they can go beyond rote instructions. Even if the feedback from the user is terse or frustrated, try to understand the task and why the user wrote what they wrote, then transmit this understanding into the instructions. If you find yourself writing ALWAYS or NEVER in all caps, or using super rigid structures, that is a yellow flag — reframe and explain the reasoning so the model understands why the thing being asked for is important.

4. **Look for repeated work across test cases.** Read the transcripts from the test runs and notice if the subagents all independently wrote similar helper scripts or took the same multi-step approach. If all 3 test cases resulted in the subagent writing a `create_docx.py` or a `build_chart.py`, that is a strong signal the skill should bundle that script. Write it once, put it in `scripts/`, and tell the skill to use it. This saves every future invocation from reinventing the wheel.

Write a draft revision, then look at it anew and make improvements. Take time to understand what the user wants and needs.

### The iteration loop

After improving the skill:

1. Apply improvements to the skill.
2. Rerun all test cases into a new `iteration-<N+1>/` directory, including baseline runs. If creating a new skill, the baseline is always `without_skill` (no skill) — that stays the same across iterations. If improving an existing skill, use judgment on what makes sense as the baseline: the original version the user came in with, or the previous iteration.
3. Launch the reviewer with `--previous-workspace` pointing at the previous iteration.
4. Wait for the user to review and tell you they are done.
5. Read the new feedback, improve again, repeat.

Keep going until:

- The user says they are happy
- The feedback is all empty (everything looks good)
- No meaningful progress is being made

---

## Advanced: Blind comparison

For situations requiring a more rigorous comparison between two versions of a skill (e.g., the user asks "is the new version actually better?"), there is a blind comparison system. Read `agents/comparator.md` and `agents/analyzer.md` for details. The basic idea: give two outputs to an independent agent without telling it which is which, and let it judge quality. Then analyze why the winner won.

This is optional, requires subagents, and most users will not need it. The human review loop is usually sufficient.

---

## Description Optimization

The `description` field in SKILL.md frontmatter is the primary mechanism that determines whether the model invokes a skill. After creating or improving a skill, offer to optimize the description for better triggering accuracy.

### Step 1: Generate trigger eval queries

Create 20 eval queries — a mix of should-trigger and should-not-trigger. Save as JSON:

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

The queries must be realistic — something a user would actually type. Not abstract requests, but requests that are concrete and specific with detail: file paths, personal context about the user's job or situation, column names and values, company names, URLs. Some might be in lowercase or contain abbreviations, typos, or casual speech. Use a mix of different lengths, and focus on edge cases rather than making them clear-cut (the user will get a chance to sign off on them).

Bad: `"Format this data"`, `"Extract text from PDF"`, `"Create a chart"`

Good: `"ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage. The revenue is in column C and costs are in column D i think"`

For the **should-trigger** queries (8-10), think about coverage. Use different phrasings of the same intent — some formal, some casual. Include cases where the user does not explicitly name the skill or file type but clearly needs it. Include some uncommon use cases and cases where this skill competes with another but should win.

For the **should-not-trigger** queries (8-10), the most valuable ones are the near-misses — queries that share keywords or concepts with the skill but actually need something different. Think adjacent domains, ambiguous phrasing where a naive keyword match would trigger but should not, and cases where the query touches on something the skill does but in a context where another tool is more appropriate.

The key thing to avoid: do not make should-not-trigger queries obviously irrelevant. "Write a fibonacci function" as a negative test for a PDF skill is too easy — it does not test anything. The negative cases should be genuinely tricky.

### Step 2: Review with user

Present the eval set to the user for review using the HTML template:

1. Read the template from `assets/eval_review.html`.
2. Replace the placeholders:
   - `__EVAL_DATA_PLACEHOLDER__` → the JSON array of eval items (no quotes around it — it is a JS variable assignment)
   - `__SKILL_NAME_PLACEHOLDER__` → the skill's name
   - `__SKILL_DESCRIPTION_PLACEHOLDER__` → the skill's current description
3. Write to a temp file (e.g., `/tmp/eval_review_<skill-name>.html`) and open it.
4. The user can edit queries, toggle should-trigger, add/remove entries, then click "Export Eval Set".
5. The file downloads to `~/Downloads/eval_set.json` — check the Downloads folder for the most recent version in case there are multiple (e.g., `eval_set (1).json`).

This step matters — bad eval queries lead to bad descriptions.

### Step 3: Run the optimization loop

Tell the user: "This will take some time — I'll run the optimization loop in the background and check on it periodically."

Save the eval set to the workspace, then run in the background:

```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-powering-this-session> \
  --max-iterations 5 \
  --verbose
```

Use the model ID from the system prompt (the one powering the current session) so the triggering test matches what the user actually experiences.

While it runs, periodically tail the output to give the user updates on which iteration it is on and what the scores look like.

This handles the full optimization loop automatically. It splits the eval set into 60% train and 40% held-out test, evaluates the current description (running each query 3 times to get a reliable trigger rate), then calls the model to propose improvements based on what failed. It re-evaluates each new description on both train and test, iterating up to 5 times. When it is done, it opens an HTML report in the browser showing the results per iteration and returns JSON with `best_description` — selected by test score rather than train score to avoid overfitting.

### How skill triggering works

Understanding the triggering mechanism helps design better eval queries. Skills appear in the model's `available_skills` list with their name + description, and the model decides whether to consult a skill based on that description. The model only consults skills for tasks it cannot easily handle on its own — simple, one-step queries like "read this PDF" may not trigger a skill even if the description matches perfectly, because the model can handle them directly with basic tools. Complex, multi-step, or specialized queries reliably trigger skills when the description matches.

This means eval queries should be substantive enough that the model would actually benefit from consulting a skill. Simple queries like "read file X" are poor test cases — they will not trigger skills regardless of description quality.

### Step 4: Apply the result

Take `best_description` from the JSON output and update the skill's SKILL.md frontmatter. Show the user before/after and report the scores.

### Package and present (only if `present_files` tool is available)

Check whether the `present_files` tool is available. If not, skip this step. If yes, package the skill and present the `.skill` file to the user:

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

After packaging, direct the user to the resulting `.skill` file path so they can install it.

---

## Environment-specific instructions

### GLM.ai (no subagents)

In GLM.ai, the core workflow is the same (draft → test → review → improve → repeat), but because GLM.ai does not have subagents, some mechanics change.

**Running test cases**: No subagents means no parallel execution. For each test case, read the skill's SKILL.md, then follow its instructions to accomplish the test prompt yourself. Do them one at a time. This is less rigorous than independent subagents (you wrote the skill and you are also running it, so you have full context), but it is a useful sanity check — and the human review step compensates. Skip the baseline runs — just use the skill to complete the task as requested.

**Reviewing results**: If a browser is not available (e.g., GLM.ai's VM has no display, or you are on a remote server), skip the browser reviewer entirely. Instead, present results directly in the conversation. For each test case, show the prompt and the output. If the output is a file the user needs to see (like a `.docx` or `.xlsx`), save it to the filesystem and tell them where it is so they can download and inspect it. Ask for feedback inline: "How does this look? Anything you'd change?"

**Benchmarking**: Skip the quantitative benchmarking — it relies on baseline comparisons which are not meaningful without subagents. Focus on qualitative feedback from the user.

**The iteration loop**: Same as before — improve the skill, rerun the test cases, ask for feedback — just without the browser reviewer in the middle. You can still organize results into iteration directories on the filesystem if you have one.

**Description optimization**: This section requires the `glm` CLI tool (specifically `glm -p`) which is only available in GLM Code. Skip it on GLM.ai.

**Blind comparison**: Requires subagents. Skip it.

**Packaging**: The `package_skill.py` script works anywhere with Python and a filesystem. On GLM.ai, run it and the user can download the resulting `.skill` file.

### Cowork (subagents, no display)

- Subagents are available, so the main workflow (spawn test cases in parallel, run baselines, grade, etc.) all works. If you run into severe problems with timeouts, it is OK to run the test prompts in series rather than parallel.
- No browser or display is available, so when generating the eval viewer, use `--static <output_path>` to write a standalone HTML file instead of starting a server. Then provide a link that the user can click to open the HTML in their browser.
- After running tests, always generate the eval viewer for the human to look at examples before revising the skill yourself. Use `generate_review.py` (do not write custom HTML). Generate the eval viewer BEFORE evaluating inputs yourself — get them in front of the human as soon as possible.
- Feedback works differently: since there is no running server, the viewer's "Submit All Reviews" button will download `feedback.json` as a file. Read it from there (you may have to request access first).
- Packaging works — `package_skill.py` just needs Python and a filesystem.
- Description optimization (`run_loop.py` / `run_eval.py`) should work in Cowork fine since it uses `glm -p` via subprocess, not a browser. Save it until you have fully finished making the skill and the user agrees it is in good shape.

### Updating an existing skill

The user might be asking to update an existing skill, not create a new one. In this case:

- **Preserve the original name.** Note the skill's directory name and `name` frontmatter field — use them unchanged. E.g., if the installed skill is `research-helper`, output `research-helper.skill` (not `research-helper-v2`).
- **Copy to a writeable location before editing.** The installed skill path may be read-only. Copy to `/tmp/skill-name/`, edit there, and package from the copy.
- **If packaging manually, stage in `/tmp/` first**, then copy to the output directory — direct writes may fail due to permissions.

---

## ID Assignment

Every skill you create should optionally have a unique ID following the Z.ai ID system. This is **optional** for skills used only in your own project, but **recommended** if you plan to publish or share the skill, or if you maintain more than a handful of skills and want to keep track of them.

### ID Format

```text
ZAI-<DOMAIN>-<NNN>
```

Where `<DOMAIN>` is one of the reserved domains below, and `<NNN>` is a 3-digit zero-padded number assigned in sequence within the domain.

### Reserved Domains

| Domain | Scope |
|--------|-------|
| `MEM` | Memory operations (store, query, delete, export) |
| `FS` | File system (folder indexing, file scanning) |
| `SESSION` | Session management (handoff, resume, context) |
| `DEV` | Development (project clone, commit, schema design) |
| `ARCH` | Architecture (C4, mermaid, DB schemas) |
| `QA` | Quality assurance (testing, validation) |
| `REQ` | Requirements (PRD, clarity) |
| `DOC` | Documentation (PDF, DOCX, PPT) |
| `SEC` | Security (sanitization, validation) |
| `GIT` | Git operations (clone, checkpoint, safe-ops) |
| `SDK` | SDK integration (z-ai-web-dev-sdk, API) |
| `HEALTH` | Health monitoring (API health, retry) |
| `META` | Meta-skills (this skill, ID system) |
| `STS` | **User-created skills** (your own skills, with `_sts` suffix) |

### User-Created Skills (STS Domain)

**IMPORTANT:** Skills created by you (the end user) should ALWAYS use `ZAI-STS-XXX` and have an `_sts` suffix on the folder name. This distinguishes them from toolkit-built skills and prevents naming conflicts.

| Type | Format | Example |
|------|--------|---------|
| Folder name | `<skill-name>_sts/` | `prompt-engineering_sts/` |
| ID | `ZAI-STS-XXX` | `ZAI-STS-008` |
| `name` frontmatter | same as folder (with `_sts`) | `prompt-engineering_sts` |

### Frontmatter Template with ID

When assigning an ID, extend the standard frontmatter:

```yaml
---
name: my-skill_sts
description: Short description with trigger phrases. Keep under 1024 chars.
id: ZAI-STS-008
version: 1.0
trigger: keyword1, keyword2, keyword3
aligned_with: STD-SKILL-001
---
```

The `quick_validate.py` script enforces this format. Fields `id`, `version`, `trigger`, `aligned_with` are optional but, if present, must match the format.

### Workflow: Assigning an ID to a New Skill

1. **Decide the domain.** If it is your own custom skill, use `STS`. If it fits a reserved domain cleanly (e.g., a git-related skill uses `GIT`), use that domain instead.
2. **Find the next available number.** Skim `/home/z/my-project/skills/` for existing skills with the same domain and pick the next free `NNN`. If unsure, start from `001` for STS — collision-free is what matters, not exact sequence.
3. **Assign the ID and folder name.** Write `id: ZAI-STS-XXX` into the frontmatter and create the folder as `<skill-name>_sts/`.
4. **Validate.** Run `python skills/skill-creator/scripts/quick_validate.py <skill-path>`.
5. **(Optional) Update the registry.** If you maintain a `skill-id-system` registry file in your toolkit, add an entry like `| ZAI-STS-008 | my-skill_sts | 1.0 |`. If you are working only in `/home/z/my-project/`, you can skip the registry step — the ID in the frontmatter is enough.

### Detailed Guide

See `references/id-assignment-guide.md` for the full ID assignment reference (domain selection table, conflict resolution, examples, and a verification checklist).

---

## Persistence

### Where skills live

In this environment, skills are stored under `/home/z/my-project/skills/<skill-name>/`. Anything you put there is:

- **Visible to the agent in the current session** — `Skill(command="<skill-name>")` will load it.
- **Reachable by the validator** — `python skills/skill-creator/scripts/quick_validate.py skills/<skill-name>` will check it.
- **Packageable** — `python skills/skill-creator/scripts/package_skill.py skills/<skill-name>` will produce a `.skill` zip in `/home/z/my-project/download/`.

### Session-to-session persistence

The `/home/z/my-project/skills/` directory may not persist across separate sessions of the Z.ai sandbox. To make a skill survive a session restart, there are two options:

1. **Package the skill into a `.skill` zip.** Use `package_skill.py` to write `<name>.skill` into `/home/z/my-project/download/`. In the new session, unpack the zip back into `skills/` and the skill is invokable again.
2. **Keep the source in a git repo or persistent upload.** Push the skill's folder to a private GitHub repo (or include it in your project's uploads). In a new session, clone the repo into `/home/z/my-project/skills/`.

### Project skills vs toolkit skills

| Type | Location | Scope |
|------|----------|-------|
| Project skills | `/home/z/my-project/skills/<name>/` | Available only in this sandbox session |
| Packaged skills | `/home/z/my-project/download/<name>.skill` | Re-installable across sessions |
| External skills | Your own git repo, local machine, etc. | Sync via clone or upload |

**Recommendation:** Build the skill in `/home/z/my-project/skills/`, test it via `Skill(command="...")`, and once it is stable, package it into a `.skill` file in `download/` so you have a persistent artifact.

### Updating an existing skill in this environment

If you need to modify a skill that already exists in `/home/z/my-project/skills/<name>/`:

1. Edit the files in place — the directory is writable.
2. Re-run `quick_validate.py` to confirm the frontmatter still passes.
3. Re-run any evals you have to make sure nothing regressed.
4. If packaging, use the **same `name` frontmatter and folder name** as the original (do not append `-v2` etc.).

---

## Reference files

The `agents/` directory contains instructions for specialized subagents. Read them when you need to spawn the relevant subagent.

- `agents/grader.md` — How to evaluate assertions against outputs
- `agents/comparator.md` — How to do blind A/B comparison between two outputs
- `agents/analyzer.md` — How to analyze why one version beat another

The `references/` directory has additional documentation:

- `references/schemas.md` — JSON structures for evals.json, grading.json, etc.
- `references/id-assignment-guide.md` — Full ID assignment reference (domains, number assignment, conflict resolution, examples)

---

## Core loop summary

1. Figure out what the skill is about
2. Draft or edit the skill
3. Run a model with access to the skill on test prompts
4. With the user, evaluate the outputs:
   - Create `benchmark.json` and run `eval-viewer/generate_review.py` to help the user review them
   - Run quantitative evals
5. Repeat until you and the user are satisfied
6. Package the final skill and return it to the user

Add steps to your TodoList to make sure nothing is forgotten. In Cowork, specifically put "Create evals JSON and run `eval-viewer/generate_review.py` so human can review test cases" in your TodoList to make sure it happens.
