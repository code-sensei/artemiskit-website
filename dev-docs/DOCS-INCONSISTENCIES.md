# Documentation Inconsistencies Report

> **Generated:** 2026-03-06
> **Scope:** ArtemisKit CLI documentation (`src/content/docs/docs/cli/`)
> **Status:** Pending fixes

This document tracks inconsistencies found in the ArtemisKit documentation that should be corrected for a consistent user experience.

---

## Table of Contents

1. [Trailing Slash Inconsistencies](#1-trailing-slash-inconsistencies)
2. [--save Flag Default Inconsistency](#2---save-flag-default-inconsistency)
3. [Model Name Inconsistencies](#3-model-name-inconsistencies)
4. [Example Output Model Mismatch](#4-example-output-model-mismatch)
5. [Cross-Reference Style Inconsistency](#5-cross-reference-style-inconsistency)
6. [Pricing Table Model Naming](#6-pricing-table-model-naming)
7. [Recommended Standards](#7-recommended-standards)
8. [Fix Checklist](#8-fix-checklist)

---

## 1. Trailing Slash Inconsistencies

**Severity:** Medium
**Impact:** May cause broken links depending on routing configuration; inconsistent user experience

### Current State

Internal documentation links are inconsistent - some use trailing slashes, others don't.

#### Files using links WITHOUT trailing slash:

| File | Example Link |
|------|--------------|
| `cli/index.mdx` | `/docs/cli/commands/run` |
| `cli/commands/history.mdx` | `/docs/cli/commands/run` |
| `cli/commands/compare.mdx` | `/docs/cli/commands/run` |
| `cli/commands/init.mdx` | `/docs/cli/getting-started` |

**Specific instances in `cli/index.mdx`:**
```markdown
| [`artemiskit run`](/docs/cli/commands/run) | Run scenario-based evaluations |
| [`artemiskit redteam`](/docs/cli/commands/redteam) | Security red team testing |
| [`artemiskit baseline`](/docs/cli/commands/baseline) | Manage baselines for regression detection |
```

**Specific instances in `cli/commands/history.mdx`:**
```markdown
- [Run Command](/docs/cli/commands/run) — Run evaluations and save results
- [Compare Command](/docs/cli/commands/compare) — Compare two runs
- [Storage Backends](/docs/cli/storage) — Configure storage options
```

**Specific instances in `cli/commands/compare.mdx`:**
```markdown
- [Run Command](/docs/cli/commands/run) — Run evaluations
- [History Command](/docs/cli/commands/history) — View available runs
- [CI/CD Integration](/docs/cli/ci-cd) — Automate in your pipeline
```

**Specific instances in `cli/commands/init.mdx`:**
```markdown
- [Getting Started](/docs/cli/getting-started) — Full getting started guide
- [Scenario Format](/docs/cli/scenarios/format) — Learn scenario syntax
- [Configuration](/docs/cli/installation) — Configuration options
- [Providers](/docs/cli/providers) — Set up LLM providers
```

#### Files using links WITH trailing slash:

| File | Example Link |
|------|--------------|
| `cli/getting-started.mdx` | `/docs/cli/scenarios/format/` |
| `cli/commands/baseline.mdx` | `/docs/cli/commands/run/` |
| `cli/commands/run.mdx` | `/docs/cli/scenarios/format/` |
| `cli/commands/stress.mdx` | `/docs/cli/scenarios/format/` |
| `cli/commands/validate.mdx` | `/docs/cli/scenarios/format/` |
| `cli/commands/redteam.mdx` | `/docs/cli/scenarios/format/` |
| `cli/scenarios/format.mdx` | `/docs/cli/scenarios/expectations/` |
| `cli/ci-cd.mdx` | `/docs/cli/commands/validate/` |

### Recommended Fix

Standardize on **WITH trailing slash** (Astro/Starlight convention):
```markdown
# Correct
[Run Command](/docs/cli/commands/run/)

# Incorrect
[Run Command](/docs/cli/commands/run)
```

---

## 2. --save Flag Default Inconsistency

**Severity:** High
**Impact:** User confusion about expected behavior; may lead to lost test results

### Current State

The `--save` flag has different default values across commands:

| Command | Default | Documentation Text |
|---------|---------|-------------------|
| `run` | `true` | "Save results to storage (enabled by default)" |
| `redteam` | `false` | "Save results to storage" |
| `stress` | `false` | "Save results to storage" |

### Files Affected

- `cli/commands/run.mdx` (line ~37)
- `cli/commands/redteam.mdx` (line ~33)
- `cli/commands/stress.mdx` (line ~33)

### Questions to Resolve

1. Is this intentional behavior or an oversight?
2. If intentional, why does `run` default to saving but `redteam` and `stress` don't?
3. Should documentation clarify the reasoning?

### Recommended Fix

**Option A:** Make all commands consistent (all default to `true` or all default to `false`)

**Option B:** If intentional, add clarifying note:
```markdown
| `--save` | | Save results to storage | `false` |

> **Note:** Unlike the `run` command, `redteam` defaults to not saving results
> because security tests may contain sensitive attack patterns.
```

---

## 3. Model Name Inconsistencies

**Severity:** Medium
**Impact:** User confusion about correct model identifiers

### Anthropic Model Naming

Different files use different formats for the same model:

| File | Model Name Used |
|------|-----------------|
| `cli/commands/run.mdx` | `claude-3-5-sonnet-20241022` |
| `cli/commands/redteam.mdx` | `claude-3-5-sonnet-20241022` |
| `cli/providers/anthropic.mdx` | `claude-sonnet-4-5-20241022` |
| `cli/commands/stress.mdx` (pricing) | `claude-sonnet-4.5` |
| `cli/commands/init.mdx` | `claude-sonnet-4-20250514` |

### OpenAI Model Naming

| File | Model Name Used |
|------|-----------------|
| Most documentation | `gpt-5` |
| `cli/commands/init.mdx` | `gpt-4o-mini` |
| `cli/commands/stress.mdx` (example output) | `gpt-4o-mini` |

### Specific Instances

**`cli/commands/run.mdx` (line ~106):**
```bash
akit run scenarios/qa-test.yaml -p anthropic -m claude-3-5-sonnet-20241022
```

**`cli/providers/anthropic.mdx` (line ~27):**
```yaml
model: claude-sonnet-4-5-20241022
```

**`cli/commands/init.mdx` (line ~64):**
```yaml
anthropic:
  apiKey: ${ANTHROPIC_API_KEY}
  defaultModel: claude-sonnet-4-20250514
```

### Recommended Fix

1. Decide on canonical model names for examples
2. Use the most current/recommended models consistently
3. Update all files to use the same format

**Suggested standard:**
- OpenAI default: `gpt-5`
- Anthropic default: `claude-sonnet-4-5-20251022` (or latest)

---

## 4. Example Output Model Mismatch

**Severity:** Medium
**Impact:** Inconsistent examples confuse users

### Current State

Example output sections use different models:

**`cli/commands/run.mdx` (lines ~314-326):**
```
Running scenario: qa-test
Provider: openai (gpt-5)
...
```

**`cli/commands/redteam.mdx` (lines ~509-531):**
```
Red Team Testing: chatbot
Provider: openai (gpt-5)
...
```

**`cli/commands/stress.mdx` (lines ~138-165):**
```
Stress Test: chatbot
Provider: openai (gpt-4o-mini)   <-- INCONSISTENT
...
```

### Recommended Fix

Update `stress.mdx` example output to use `gpt-5`:
```
Stress Test: chatbot
Provider: openai (gpt-5)
...
```

---

## 5. Cross-Reference Style Inconsistency

**Severity:** Low
**Impact:** Inconsistent documentation style

### Current State

Some "See Also" links include descriptions, others don't:

**Style A - With description:**
```markdown
- [Red Team Command](/docs/cli/commands/redteam/) — Security testing with automated attacks
- [Run Command](/docs/cli/commands/run/) — Execute scenarios with baseline comparison
```

**Style B - Without description:**
```markdown
- [Run Command](/docs/cli/commands/run/)
- [Compare Command](/docs/cli/commands/compare/)
```

**Style C - Mixed separators:**
```markdown
- [Run Command](/docs/cli/commands/run/) - Execute scenarios   # Uses hyphen
- [Run Command](/docs/cli/commands/run/) — Execute scenarios   # Uses em-dash
```

### Files with inconsistent styles

| File | Style Used |
|------|------------|
| `cli/commands/run.mdx` | Mixed (some with, some without descriptions) |
| `cli/commands/stress.mdx` | Mixed |
| `cli/commands/baseline.mdx` | Uses hyphen `-` instead of em-dash `—` |
| `cli/commands/history.mdx` | With descriptions, em-dash |
| `cli/commands/compare.mdx` | With descriptions, em-dash |

### Recommended Fix

Standardize on **with description using em-dash**:
```markdown
## See Also

- [Run Command](/docs/cli/commands/run/) — Execute scenario-based evaluations
- [Red Team Command](/docs/cli/commands/redteam/) — Security testing with automated attacks
- [Stress Command](/docs/cli/commands/stress/) — Load and performance testing
```

---

## 6. Pricing Table Model Naming

**Severity:** Low
**Impact:** Confusing reference information

### Current State in `cli/commands/stress.mdx`

**OpenAI section (lines ~189-199):**
```markdown
| gpt-5 | $0.00125 | $0.01 | 400K context |
| gpt-5-mini | $0.00025 | $0.002 | |
| gpt-4.1 | $0.002 | $0.008 | 1M context |    <-- Uses period
| gpt-4o | $0.0025 | $0.01 | 128K context |
```

**Anthropic section (lines ~202-209):**
```markdown
| claude-opus-4.5 | $0.005 | $0.025 |         <-- Shorthand
| claude-sonnet-4.5 | $0.003 | $0.015 |       <-- Shorthand
| claude-sonnet-3.7 | $0.003 | $0.015 |       <-- Different version format
```

### Issues

1. OpenAI uses mixed formats: `gpt-5` vs `gpt-4.1` (dash vs period)
2. Anthropic uses shorthand that doesn't match full model IDs used elsewhere
3. Model versions don't match those used in code examples

### Recommended Fix

1. Use full, official model identifiers in pricing tables
2. Add note that shorthand aliases are supported
3. Ensure model names match those used in examples

---

## 7. Recommended Standards

### Links

```markdown
# Always use trailing slashes
[Link Text](/docs/cli/commands/run/)

# Not this
[Link Text](/docs/cli/commands/run)
```

### See Also Sections

```markdown
## See Also

- [Command Name](/docs/cli/commands/name/) — Brief description of the command
```

### Model Names in Examples

```yaml
# OpenAI
provider: openai
model: gpt-5

# Anthropic
provider: anthropic
model: claude-sonnet-4-5-20251022
```

### Flag Documentation

```markdown
| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--save` | | Save results to storage | `true` |
```

---

## 8. Fix Checklist

### High Priority

- [ ] Resolve `--save` flag default inconsistency (clarify or standardize)
- [ ] Standardize model names across all documentation

### Medium Priority

- [ ] Add trailing slashes to all internal links in:
  - [ ] `cli/index.mdx`
  - [ ] `cli/commands/history.mdx`
  - [ ] `cli/commands/compare.mdx`
  - [ ] `cli/commands/init.mdx`
- [ ] Update `stress.mdx` example output to use `gpt-5`

### Low Priority

- [ ] Standardize See Also section format (em-dash + descriptions)
- [ ] Update pricing table model names to be consistent
- [ ] Review and update Anthropic model naming across all files

---

## Related Files

All files in the docs submodule (`src/content/docs/docs/`):

```
cli/
├── index.mdx
├── getting-started.mdx
├── installation.mdx
├── ci-cd.mdx
├── commands/
│   ├── run.mdx
│   ├── redteam.mdx
│   ├── stress.mdx
│   ├── validate.mdx
│   ├── baseline.mdx
│   ├── compare.mdx
│   ├── history.mdx
│   ├── init.mdx
│   └── report.mdx
├── scenarios/
│   ├── format.mdx
│   └── expectations.mdx
├── providers/
│   ├── index.mdx
│   ├── openai.mdx
│   ├── anthropic.mdx
│   ├── azure.mdx
│   ├── openai-compatible.mdx
│   └── vercel-ai.mdx
└── storage/
    ├── index.mdx
    ├── local.mdx
    └── supabase.mdx
```

---

## Notes

- The docs are maintained in a separate submodule: `https://github.com/code-sensei/artemiskit-docs`
- Changes require commits to both the submodule and the main repository
- Consider creating a linter or pre-commit hook to enforce link formatting
