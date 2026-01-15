# ArtemisKit Landing Page & Documentation Site Specification

## Project Overview

**Product Name:** ArtemisKit  
**Tagline:** Open-source LLM evaluation toolkit for developers and research teams  
**CLI Commands:** `artemiskit` (full) / `akit` (short)  
**Purpose:** Landing page with waitlist for cloud offering + comprehensive documentation  
**Target Audience:** Developers, ML engineers, DevOps teams, and research organizations evaluating LLM applications  
**License:** Apache-2.0  
**npm Organization:** @artemiskit

---

## Technology Stack

### Core Framework
- **Astro** (v4.x) - Static site generator with excellent performance
- **Starlight** - Astro's official documentation theme (for docs section)
- **TypeScript** - Type safety throughout

### Styling
- **Tailwind CSS** (v3.x) - Utility-first CSS framework
- **Starlight built-in theming** - For documentation pages
- **Custom CSS variables** - For brand consistency

### Components & UI
- **Astro components** - For landing page sections
- **React components** (optional) - For interactive elements (waitlist form)
- **Lucide Icons** or **Heroicons** - For iconography

### Backend/Services
- **Supabase** - For waitlist email collection
  - Database: Store email addresses, timestamps, referral sources
  - Edge Functions (optional): Send confirmation emails
- **Resend** (optional) - Transactional emails for waitlist confirmation

### Deployment
- **Vercel** - Recommended for Astro sites
- **Custom domain**: artemiskit.dev (recommended)

### Analytics (Optional)
- **Plausible** or **Fathom** - Privacy-focused analytics
- **PostHog** (optional) - Product analytics for docs engagement

---

## Site Structure

Documentation is organized by package to keep CLI usage separate from programmatic API usage.

```
/                                   # Landing page
/waitlist/                          # Waitlist confirmation page
/blog/                              # (Future) Blog/changelog

# CLI Documentation (@artemiskit/cli)
/docs/cli/                          # CLI documentation home
/docs/cli/getting-started/          # Quick start guides
/docs/cli/installation/             # Installation guide
/docs/cli/commands/                 # CLI command reference
/docs/cli/commands/run/             # run command
/docs/cli/commands/redteam/         # redteam command
/docs/cli/commands/stress/          # stress command
/docs/cli/commands/report/          # report command
/docs/cli/commands/history/         # history command
/docs/cli/commands/compare/         # compare command
/docs/cli/scenarios/                # Scenario file format
/docs/cli/configuration/            # Configuration options
/docs/cli/providers/                # Provider setup guides
/docs/cli/ci-cd/                    # CI/CD integration

# Core API Documentation (@artemiskit/core) - Future
/docs/api/                          # Programmatic API home
/docs/api/getting-started/          # API quick start
/docs/api/reference/                # API reference
/docs/api/examples/                 # Code examples
/docs/api/testing/                  # Jest/Vitest integration
```

### Why Separate by Package?

1. **Clear audience separation** - CLI users vs programmatic API users
2. **Different mental models** - Command-line workflows vs code integration
3. **Independent versioning** - CLI docs can evolve separately from API docs
4. **Easier navigation** - Users find what they need faster
5. **Future-proof** - Easy to add more packages (e.g., `@artemiskit/jest`)

---

## Landing Page Design

### Design Principles
1. **Developer-focused** - Clean, minimal, code-centric
2. **Dark mode first** - Match developer tooling aesthetics
3. **Warm & Bold** - Deep orange accents for energy and approachability
4. **High contrast** - Easy readability
5. **Performance** - Sub-1s load time

### Color Palette - Deep Warm Orange Theme

```css
:root {
  /* Primary - Deep Warm Orange */
  --primary-50: #fff7ed;
  --primary-100: #ffedd5;
  --primary-200: #fed7aa;
  --primary-300: #fdba74;
  --primary-400: #fb923c;
  --primary-500: #f97316;  /* Main brand color */
  --primary-600: #ea580c;
  --primary-700: #c2410c;
  --primary-800: #9a3412;
  --primary-900: #7c2d12;
  --primary-950: #431407;

  /* Secondary - Warm Amber (complementary) */
  --secondary-400: #fbbf24;
  --secondary-500: #f59e0b;
  --secondary-600: #d97706;

  /* Accent - Coral/Terracotta (for special highlights) */
  --accent-400: #f87171;
  --accent-500: #ef4444;
  --accent-600: #dc2626;

  /* Success - Warm Green */
  --success-400: #4ade80;
  --success-500: #22c55e;
  --success-600: #16a34a;

  /* Warning - Gold */
  --warning-400: #facc15;
  --warning-500: #eab308;
  --warning-600: #ca8a04;

  /* Danger - Deep Red */
  --danger-400: #f87171;
  --danger-500: #ef4444;
  --danger-600: #dc2626;

  /* Neutrals - Warm Gray */
  --gray-50: #fafaf9;
  --gray-100: #f5f5f4;
  --gray-200: #e7e5e4;
  --gray-300: #d6d3d1;
  --gray-400: #a8a29e;
  --gray-500: #78716c;
  --gray-600: #57534e;
  --gray-700: #44403c;
  --gray-800: #292524;
  --gray-900: #1c1917;
  --gray-950: #0c0a09;

  /* Background (dark mode) - Warm undertones */
  --bg-primary: #0c0a09;
  --bg-secondary: #1c1917;
  --bg-tertiary: #292524;
  --bg-card: #1c1917;
  
  /* Background (light mode) */
  --bg-light-primary: #fafaf9;
  --bg-light-secondary: #f5f5f4;
  --bg-light-card: #ffffff;
}
```

### Gradient Suggestions

```css
/* Hero gradient - warm glow */
.hero-gradient {
  background: radial-gradient(
    ellipse at top,
    rgba(249, 115, 22, 0.15) 0%,
    rgba(12, 10, 9, 0) 50%
  );
}

/* Button gradient */
.btn-primary {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

/* Card hover glow */
.card:hover {
  box-shadow: 0 0 40px rgba(249, 115, 22, 0.1);
}

/* Accent border */
.accent-border {
  border-color: rgba(249, 115, 22, 0.3);
}
```

### Typography

```css
/* Fonts */
--font-heading: 'Inter', 'SF Pro Display', system-ui, sans-serif;
--font-body: 'Inter', 'SF Pro Text', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

---

## Landing Page Sections

### 1. Navigation Header

**Layout:** Sticky, transparent background with blur on scroll

**Elements:**
- Logo (left): ArtemisKit wordmark + icon (orange accent)
- Nav links (center): Features | Docs | GitHub | Pricing
- CTA (right): "Get Started" button (orange) + "Join Waitlist" button (outline)

**Mobile:** Hamburger menu with slide-out drawer

```html
<!-- Example structure -->
<header class="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-950/80 border-b border-orange-500/10">
  <nav class="container mx-auto flex items-center justify-between py-4 px-6">
    <Logo />
    <NavLinks />
    <CTAButtons />
  </nav>
</header>
```

---

### 2. Hero Section

**Layout:** Full viewport height, centered content

**Background:** 
- Subtle grid pattern with warm gray lines
- Orange gradient orb at top (animated, subtle pulse)
- Optional: Terminal window with animated typing

**Content:**

```markdown
# Evaluate Your LLM Applications with Confidence

The open-source toolkit for testing prompt quality, 
security vulnerabilities, and performance at scale.

Built for developers and research teams.

[Get Started] [View on GitHub] [Join Cloud Waitlist]
```

**Below CTA:** Trust badges / social proof
- "Built for developers, researchers, and ML teams"
- Or: GitHub stars count + "Apache-2.0 Licensed"

**Terminal Animation (Hero Visual):**
```bash
$ akit run scenarios/qa-bot.yaml

ArtemisKit v0.1.0 - LLM Evaluation Toolkit

Running: qa-bot-evaluation
Provider: openai (gpt-4)

Scenario 1/5: Basic Q&A ........................ PASS
Scenario 2/5: Edge Cases ....................... PASS  
Scenario 3/5: Context Handling ................. PASS
Scenario 4/5: Error Recovery ................... PASS
Scenario 5/5: Performance Check ................ PASS

Results: 5/5 passed (100%)
Report: artemis-output/report-2024-01-15.html
```

---

### 3. Problem Statement Section

**Headline:** "LLM Applications Are Unpredictable"

**Layout:** Two columns - problem (left) vs solution (right)

**Problem Cards:**
1. **Inconsistent Outputs**
   - "Your chatbot gives different answers to the same question"
   - Icon: Shuffle/random icon

2. **Security Blind Spots**
   - "Prompt injection attacks go undetected until production"
   - Icon: Shield with X

3. **Unknown Limits**
   - "No idea how your app performs under load"
   - Icon: Chart declining

4. **Manual Testing**
   - "Testing prompts by hand doesn't scale"
   - Icon: Clock/manual

**Solution Statement:**
```markdown
## ArtemisKit Brings Order to Chaos

Systematic evaluation of your LLM applications with 
automated testing, security scanning, and performance analysis.
```

---

### 4. Features Section

**Headline:** "Everything You Need to Evaluate LLMs"

**Layout:** 3-column grid on desktop, stacked on mobile

**Feature Cards (with orange accent on hover):**

#### Card 1: Scenario Testing
```markdown
### Scenario-Based Testing
Define test cases in YAML, run them across providers, 
and get consistent, reproducible results.

- Multi-turn conversation support
- Variable injection & templating
- Custom evaluation criteria
```
**Icon:** Checklist/clipboard (orange)
**Code Preview:**
```yaml
name: customer-support-bot
scenarios:
  - name: greeting
    turns:
      - role: user
        content: "Hello!"
      - role: assistant
        expect:
          contains: ["Hi", "Hello", "Welcome"]
```

#### Card 2: Security Testing (Red Team)
```markdown
### Security Red Teaming
Automatically test for prompt injection, jailbreaks, 
and data extraction vulnerabilities.

- 50+ built-in attack patterns
- Custom attack definitions
- Vulnerability reports
```
**Icon:** Shield/security (orange)
**Code Preview:**
```bash
$ artemiskit redteam --target "your-prompt" \
    --categories injection,jailbreak

Red Team Results:
- Injection Attacks: 2/10 bypassed
- Jailbreak Attempts: 0/10 bypassed
- Data Extraction: 1/10 succeeded

Vulnerability Report: artemis-output/redteam-*.html
```

#### Card 3: Stress Testing
```markdown
### Load & Stress Testing
Understand your LLM's behavior under pressure 
with concurrent request testing.

- Configurable concurrency
- Latency percentiles (p50, p95, p99)
- Rate limiting detection
```
**Icon:** Lightning bolt/speed (orange)
**Code Preview:**
```bash
$ akit stress --prompt "Summarize this" \
    --concurrency 50 --iterations 500

Stress Test Results:
- Total Requests: 500
- Success Rate: 98.4%
- Avg Latency: 245ms
- P99 Latency: 892ms
```

#### Card 4: Multi-Provider Support
```markdown
### Works With Your Stack
Native support for major LLM providers with 
unified configuration and results.

- OpenAI, Azure, Anthropic, Google
- Custom/self-hosted models via Ollama
- Consistent API across providers
```
**Icon:** Puzzle pieces/integration (orange)
**Provider Logos:** OpenAI, Azure, Anthropic, Google, Ollama

#### Card 5: Rich Reports
```markdown
### Beautiful, Actionable Reports
HTML and JSON reports with detailed metrics, 
pass/fail breakdowns, and configuration traceability.

- Interactive HTML dashboards
- Machine-readable JSON export
- CI/CD integration ready
```
**Icon:** Chart/report (orange)
**Screenshot:** Report preview image

#### Card 6: Developer Experience
```markdown
### Built for Developers
CLI-first design, YAML configuration, 
and seamless integration with your workflow.

- Zero-config defaults
- Extensive customization
- TypeScript/Node.js native
```
**Icon:** Terminal/code (orange)
**Code Preview:**
```bash
# Install
npm install -g @artemiskit/cli

# Run your first evaluation
artemiskit run scenarios/example.yaml
```

---

### 5. How It Works Section

**Headline:** "Get Started in 3 Steps"

**Layout:** Horizontal timeline/steps on desktop, vertical on mobile
**Accent:** Orange connecting line between steps

**Step 1: Install**
```bash
npm install -g @artemiskit/cli
# or
bunx artemiskit --help
```
**Description:** "Install globally with npm, yarn, pnpm, or bun"

**Step 2: Define**
```yaml
# artemis.config.yaml
provider: openai
model: gpt-4

# scenarios/my-test.yaml
name: chatbot-test
scenarios:
  - name: basic-qa
    turns:
      - role: user
        content: "What is 2+2?"
      - role: assistant
        expect:
          contains: ["4"]
```
**Description:** "Define your test scenarios in simple YAML"

**Step 3: Run**
```bash
$ artemiskit run scenarios/my-test.yaml --save

Running chatbot-test...
Results: 5/5 passed
Report saved: artemis-output/report.html
```
**Description:** "Run tests and get beautiful reports"

---

### 6. Use Cases Section

**Headline:** "Trusted Across the LLM Lifecycle"

**Layout:** Tab-based or accordion, each with specific use case

**Use Case 1: QA Engineers**
```markdown
### Quality Assurance
Catch regressions before they reach production. 
Run comprehensive test suites on every deployment.

- Pre-deploy validation
- Regression detection
- Automated test suites
```

**Use Case 2: Security Teams**
```markdown
### Security Auditing
Identify vulnerabilities before attackers do. 
Comprehensive red team testing for LLM applications.

- Prompt injection detection
- Jailbreak resistance testing
- Data leakage prevention
```

**Use Case 3: Research Teams**
```markdown
### Research & Experimentation
Systematically evaluate model performance across 
benchmarks with reproducible results.

- Model comparison studies
- Benchmark suite execution
- Reproducible evaluation pipelines
```

**Use Case 4: Platform Teams**
```markdown
### Performance Engineering
Understand latency, throughput, and failure modes 
under realistic load conditions.

- Capacity planning
- SLA validation
- Bottleneck identification
```

**Use Case 5: DevOps/MLOps**
```markdown
### CI/CD Integration
Automate evaluation as part of your pipeline. 
Fail builds on quality regressions.

- GitHub Actions integration
- Jenkins/GitLab CI support
- Exit codes for automation
```

---

### 7. Cloud Waitlist Section

**Headline:** "ArtemisKit Cloud is Coming"

**Subheadline:** "The power of ArtemisKit with managed infrastructure, team collaboration, and advanced analytics."

**Layout:** Split - Left side description, right side form
**Background:** Subtle orange gradient glow

**Cloud Features Preview:**
- **Team Workspaces** - Collaborate on evaluation suites
- **Scheduled Runs** - Automated periodic testing
- **Historical Analytics** - Track quality over time
- **Managed Infrastructure** - No setup required
- **API Access** - Programmatic control
- **Integrations** - Slack, PagerDuty, Jira

**Waitlist Form:**
```html
<form id="waitlist-form" class="space-y-4">
  <input 
    type="email" 
    placeholder="Enter your work email" 
    required 
    class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:ring-orange-500"
  />
  <select name="company_size" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
    <option>Team size</option>
    <option>Just me</option>
    <option>2-10</option>
    <option>11-50</option>
    <option>51-200</option>
    <option>200+</option>
  </select>
  <select name="use_case" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
    <option>Primary use case</option>
    <option>Quality Assurance</option>
    <option>Security Testing</option>
    <option>Performance Testing</option>
    <option>Research & Benchmarking</option>
    <option>All of the above</option>
  </select>
  <button 
    type="submit" 
    class="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
  >
    Join Waitlist
  </button>
</form>
```

**Social Proof:** "Join 500+ developers on the waitlist" (update dynamically)

**Privacy Note:** "We'll only email you about ArtemisKit Cloud launch. No spam."

---

### 8. Open Source Section

**Headline:** "Open Source at Heart"

**Content:**
```markdown
ArtemisKit is Apache-2.0 licensed and open source. 
Contribute, customize, and build on a foundation you control.

- View the source on GitHub
- Report issues and request features
- Contribute code and documentation
- Join our community
```

**GitHub Stats Widget (orange accent):**
- Stars count
- Fork count
- Contributors count
- Latest release version

**CTA:** [Star on GitHub] [View Roadmap] [Contribute]

---

### 9. Footer

**Layout:** 4-column grid

**Column 1: Brand**
- ArtemisKit logo (with orange accent)
- "Open-source LLM evaluation toolkit"
- Social links (GitHub, Twitter/X, Discord)

**Column 2: Product**
- Features
- Documentation
- Changelog
- Roadmap

**Column 3: Resources**
- Getting Started
- Examples
- Blog
- Community

**Column 4: Legal**
- Apache-2.0 License
- Privacy Policy
- Terms of Service

**Bottom Bar:**
- Copyright: "© 2026 ArtemisKit. Apache-2.0 License."
- "Built with care for the developer community"

---

## Waitlist Backend Implementation

### Supabase Setup

**Table Schema:**
```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  company_size TEXT,
  use_case TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token UUID DEFAULT gen_random_uuid()
);

-- Index for lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created ON waitlist(created_at);
```

**Row Level Security:**
```sql
-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Only allow inserts (no reads/updates/deletes from client)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Frontend Integration

```typescript
// src/lib/waitlist.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)

export async function joinWaitlist(data: {
  email: string
  company_size?: string
  use_case?: string
}) {
  const { error } = await supabase
    .from('waitlist')
    .insert({
      email: data.email,
      company_size: data.company_size,
      use_case: data.use_case,
      referral_source: document.referrer || 'direct'
    })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Email already registered')
    }
    throw error
  }

  return { success: true }
}
```

---

## Documentation Site (Starlight)

### Starlight Configuration

Documentation is organized by package with a top-level switcher between CLI and API docs.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'ArtemisKit',
      logo: {
        src: './src/assets/artemiskit-logo.svg',
      },
      social: {
        github: 'https://github.com/code-sensei/artemiskit',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Home',
          items: [
            { label: 'Introduction', link: '/docs/' },
            { label: 'Which Package?', link: '/docs/which-package/' },
          ],
        },
        // CLI Documentation (@artemiskit/cli)
        {
          label: 'CLI (@artemiskit/cli)',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/docs/cli/' },
            { label: 'Installation', link: '/docs/cli/installation/' },
            { label: 'Quick Start', link: '/docs/cli/getting-started/' },
            {
              label: 'Commands',
              collapsed: true,
              items: [
                { label: 'run', link: '/docs/cli/commands/run/' },
                { label: 'redteam', link: '/docs/cli/commands/redteam/' },
                { label: 'stress', link: '/docs/cli/commands/stress/' },
                { label: 'report', link: '/docs/cli/commands/report/' },
                { label: 'history', link: '/docs/cli/commands/history/' },
                { label: 'compare', link: '/docs/cli/commands/compare/' },
              ],
            },
            {
              label: 'Scenarios',
              collapsed: true,
              items: [
                { label: 'Format', link: '/docs/cli/scenarios/format/' },
                { label: 'Turns & Conversations', link: '/docs/cli/scenarios/turns/' },
                { label: 'Expectations', link: '/docs/cli/scenarios/expectations/' },
                { label: 'Variables', link: '/docs/cli/scenarios/variables/' },
              ],
            },
            {
              label: 'Configuration',
              collapsed: true,
              items: [
                { label: 'Config File', link: '/docs/cli/configuration/config-file/' },
                { label: 'Environment Variables', link: '/docs/cli/configuration/environment/' },
              ],
            },
            {
              label: 'Providers',
              collapsed: true,
              items: [
                { label: 'OpenAI', link: '/docs/cli/providers/openai/' },
                { label: 'Azure OpenAI', link: '/docs/cli/providers/azure/' },
                { label: 'Anthropic', link: '/docs/cli/providers/anthropic/' },
                { label: 'Google AI (coming soon)', link: '/docs/cli/providers/google/' },
                { label: 'Ollama (coming soon)', link: '/docs/cli/providers/ollama/' },
              ],
            },
            { label: 'CI/CD Integration', link: '/docs/cli/ci-cd/' },
          ],
        },
        // Programmatic API (@artemiskit/core) - Coming in v0.2.0
        {
          label: 'API (@artemiskit/core)',
          collapsed: true,
          badge: { text: 'Coming Soon', variant: 'caution' },
          items: [
            { label: 'Overview', link: '/docs/api/' },
            { label: 'Getting Started', link: '/docs/api/getting-started/' },
            { label: 'API Reference', link: '/docs/api/reference/' },
            {
              label: 'Integrations',
              collapsed: true,
              items: [
                { label: 'Jest', link: '/docs/api/integrations/jest/' },
                { label: 'Vitest', link: '/docs/api/integrations/vitest/' },
              ],
            },
            { label: 'Examples', link: '/docs/api/examples/' },
          ],
        },
      ],
    }),
  ],
});
```

### Custom Starlight Theme (Orange Accent)

```css
/* src/styles/custom.css */
:root {
  --sl-color-accent-low: #431407;
  --sl-color-accent: #f97316;
  --sl-color-accent-high: #fed7aa;
  --sl-color-white: #fafaf9;
  --sl-color-gray-1: #e7e5e4;
  --sl-color-gray-2: #a8a29e;
  --sl-color-gray-3: #57534e;
  --sl-color-gray-4: #292524;
  --sl-color-gray-5: #1c1917;
  --sl-color-gray-6: #0c0a09;
  --sl-color-black: #0c0a09;
}

:root[data-theme='light'] {
  --sl-color-accent-low: #ffedd5;
  --sl-color-accent: #ea580c;
  --sl-color-accent-high: #7c2d12;
}
```

---

## Documentation Content Structure

### /docs/index.md (Introduction)
```markdown
---
title: Introduction to ArtemisKit
description: Learn about ArtemisKit, the open-source LLM evaluation toolkit
---

# Welcome to ArtemisKit

ArtemisKit is an open-source toolkit for evaluating LLM applications. 
It provides systematic testing for:

- **Quality Assurance** - Test prompts and responses with scenario-based testing
- **Security** - Red team your LLM for vulnerabilities
- **Performance** - Stress test under load

## Packages

ArtemisKit is available as multiple packages:

| Package | Description | Use Case |
|---------|-------------|----------|
| `@artemiskit/cli` | Command-line interface | Run evaluations from terminal |
| `@artemiskit/core` | Core library | Programmatic API (coming soon) |

## Which Should I Use?

- **CLI (`@artemiskit/cli`)** - Best for most users. Run evaluations from the command line, integrate with CI/CD, and generate reports.
- **Core API (`@artemiskit/core`)** - For embedding evaluations in your own code, test frameworks (Jest, Vitest), or custom tooling. Coming in v0.2.0.

## Quick Example (CLI)

\`\`\`bash
# Install
npm install -g @artemiskit/cli

# Run a scenario
akit run scenarios/hello-world.yaml
\`\`\`

## Next Steps

- [CLI Documentation](/docs/cli/) - Get started with the CLI
- [API Documentation](/docs/api/) - Programmatic usage (coming soon)
```

### /docs/cli/index.md (CLI Overview)
```markdown
---
title: CLI Overview
description: ArtemisKit command-line interface documentation
---

# ArtemisKit CLI

The ArtemisKit CLI (`@artemiskit/cli`) is the primary way to run LLM evaluations.

## Installation

\`\`\`bash
npm install -g @artemiskit/cli
\`\`\`

## Commands

| Command | Description |
|---------|-------------|
| `artemiskit run` | Run scenario-based evaluations |
| `artemiskit redteam` | Security red team testing |
| `artemiskit stress` | Load and stress testing |
| `artemiskit report` | Regenerate reports from saved data |
| `artemiskit history` | View run history |
| `artemiskit compare` | Compare two runs |

You can use `akit` as a shorter alias for `artemiskit`.

## Quick Start

\`\`\`bash
# Set your API key
export OPENAI_API_KEY="your-key"

# Run a scenario
akit run scenarios/my-test.yaml

# Save results
akit run scenarios/my-test.yaml --save
\`\`\`

## Next Steps

- [Installation Guide](/docs/cli/installation/)
- [Getting Started](/docs/cli/getting-started/)
- [Command Reference](/docs/cli/commands/run/)
```

### /docs/cli/getting-started.md
```markdown
---
title: Getting Started
description: Get up and running with ArtemisKit CLI in 5 minutes
---

# Getting Started

Get ArtemisKit CLI running in under 5 minutes.

## Prerequisites

- Node.js 18+ or Bun 1.0+
- An API key for your LLM provider (OpenAI, Azure, etc.)

## Step 1: Install

\`\`\`bash
npm install -g @artemiskit/cli
# or
pnpm add -g @artemiskit/cli
# or
bun add -g @artemiskit/cli
\`\`\`

Verify installation:

\`\`\`bash
artemiskit --version
# or
akit --version
\`\`\`

## Step 2: Set Up API Key

\`\`\`bash
export OPENAI_API_KEY="your-api-key"
\`\`\`

## Step 3: Create Your First Scenario

Create `scenarios/first-test.yaml`:

\`\`\`yaml
name: first-test
description: My first ArtemisKit test

config:
  provider: openai
  model: gpt-4

scenarios:
  - name: basic-math
    turns:
      - role: user
        content: "What is 2 + 2?"
      - role: assistant
        expect:
          contains: ["4"]
\`\`\`

## Step 4: Run the Test

\`\`\`bash
akit run scenarios/first-test.yaml
\`\`\`

## Step 5: View Results

For a detailed HTML report:

\`\`\`bash
akit run scenarios/first-test.yaml --save
\`\`\`

Open `artemis-output/run_*.html` in your browser.

## Next Steps

- [Scenario Format](/docs/cli/scenarios/format/)
- [Security Testing](/docs/cli/commands/redteam/)
- [CI/CD Integration](/docs/cli/ci-cd/)
```

### /docs/cli/commands/run.md
```markdown
---
title: artemiskit run
description: Run scenario-based evaluations
---

# artemiskit run

Run scenario-based evaluations against your LLM.

## Synopsis

\`\`\`bash
artemiskit run <scenario-file> [options]
akit run <scenario-file> [options]
\`\`\`

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--provider, -p` | LLM provider | From config |
| `--model, -m` | Model name | Provider default |
| `--save` | Save results to disk | false |
| `--output, -o` | Output directory | artemis-output |
| `--format` | Report format (html, json) | html |
| `--timeout` | Request timeout (ms) | 30000 |
| `--verbose, -v` | Verbose output | false |

## Examples

### Basic Run

\`\`\`bash
akit run scenarios/qa-test.yaml
\`\`\`

### With Provider Override

\`\`\`bash
akit run scenarios/qa-test.yaml -p anthropic -m claude-3-opus-20240229
\`\`\`

### Save Results

\`\`\`bash
akit run scenarios/qa-test.yaml --save -o ./reports
\`\`\`

### JSON Output

\`\`\`bash
akit run scenarios/qa-test.yaml --save --format json
\`\`\`

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All scenarios passed |
| 1 | One or more scenarios failed |
| 2 | Configuration or runtime error |
```

### /docs/cli/commands/redteam.md
```markdown
---
title: artemiskit redteam
description: Security testing for LLM applications
---

# artemiskit redteam

Test your LLM for security vulnerabilities using automated red team attacks.

## Synopsis

\`\`\`bash
artemiskit redteam [options]
akit redteam [options]
\`\`\`

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--target, -t` | Target system prompt | Required |
| `--categories, -c` | Attack categories | all |
| `--iterations, -i` | Attacks per category | 10 |
| `--provider, -p` | LLM provider | From config |
| `--model, -m` | Model name | Provider default |
| `--save` | Save results | false |
| `--output, -o` | Output directory | artemis-output |

## Attack Categories

- `injection` - Prompt injection attacks
- `jailbreak` - Jailbreak attempts
- `extraction` - Data extraction probes
- `hallucination` - Hallucination triggers
- `pii` - PII disclosure tests

## Examples

### Basic Red Team

\`\`\`bash
akit redteam -t "You are a helpful assistant"
\`\`\`

### Specific Categories

\`\`\`bash
akit redteam -t "You are a customer service bot" \
  -c injection,jailbreak
\`\`\`

### Extended Testing

\`\`\`bash
akit redteam -t "You are a coding assistant" \
  -i 50 --save
\`\`\`

## Understanding Results

The red team report shows:

- **Vulnerability Score** - Overall security rating
- **Category Breakdown** - Results per attack type
- **Successful Attacks** - Attacks that bypassed protections
- **Recommendations** - Suggested mitigations
```

### /docs/cli/commands/stress.md
```markdown
---
title: artemiskit stress
description: Load and stress testing for LLM endpoints
---

# artemiskit stress

Test your LLM's performance under load.

## Synopsis

\`\`\`bash
artemiskit stress [options]
akit stress [options]
\`\`\`

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--prompt` | Test prompt | Required |
| `--concurrency, -c` | Concurrent requests | 10 |
| `--iterations, -n` | Total requests | 100 |
| `--provider, -p` | LLM provider | From config |
| `--model, -m` | Model name | Provider default |
| `--save` | Save results | false |
| `--output, -o` | Output directory | artemis-output |

## Examples

### Basic Stress Test

\`\`\`bash
akit stress --prompt "Hello, how are you?"
\`\`\`

### High Concurrency

\`\`\`bash
akit stress --prompt "Summarize this text" \
  -c 50 -n 500
\`\`\`

### With Report

\`\`\`bash
akit stress --prompt "Translate to Spanish" \
  -c 25 -n 250 --save
\`\`\`

## Metrics

The stress test measures:

- **Throughput** - Requests per second
- **Latency** - Response time (avg, p50, p95, p99)
- **Success Rate** - Percentage of successful requests
- **Error Rate** - Failures and rate limiting
```

---

## Package Structure Reference

For documentation accuracy, here are the actual ArtemisKit packages:

| Package | npm Name | Description |
|---------|----------|-------------|
| CLI | `@artemiskit/cli` | Command-line interface (`artemiskit`, `akit`) |
| Core | `@artemiskit/core` | Core runtime, runner, types, artifacts |
| Reports | `@artemiskit/reports` | HTML/JSON report generation |
| Red Team | `@artemiskit/redteam` | Security testing module |
| OpenAI Adapter | `@artemiskit/adapter-openai` | OpenAI provider |
| Vercel AI Adapter | `@artemiskit/adapter-vercel-ai` | Azure, Anthropic, Google, Ollama via Vercel AI SDK |

---

## Assets Required

### Logo
- `artemiskit-logo.svg` - Primary logo with orange accent (horizontal)
- `artemiskit-icon.svg` - Icon only (square, orange)
- `artemiskit-logo-white.svg` - White version for dark backgrounds
- `artemiskit-logo-dark.svg` - Dark version for light backgrounds

### Images
- `hero-terminal.png` - Terminal screenshot for hero (dark theme with orange accents)
- `report-preview.png` - HTML report screenshot
- `feature-security.svg` - Security feature illustration (orange accent)
- `feature-performance.svg` - Performance feature illustration (orange accent)
- `feature-testing.svg` - Testing feature illustration (orange accent)

### Provider Logos
- `openai.svg`
- `azure.svg`
- `anthropic.svg`
- `google.svg`
- `ollama.svg`

---

## SEO & Metadata

### Landing Page
```html
<title>ArtemisKit - Open Source LLM Evaluation Toolkit</title>
<meta name="description" content="Test your LLM applications for quality, security, and performance. Open source toolkit for developers and research teams. Apache-2.0 licensed.">
<meta property="og:title" content="ArtemisKit - LLM Evaluation Toolkit">
<meta property="og:description" content="Test your LLM applications for quality, security, and performance.">
<meta property="og:image" content="/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### Documentation Pages
Each doc page should have unique title and description reflecting the content.

---

## Performance Requirements

- **Lighthouse Score:** 95+ on all metrics
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Total Blocking Time:** < 200ms
- **Cumulative Layout Shift:** < 0.1

### Optimization Strategies
- Use Astro's partial hydration (islands)
- Lazy load images below the fold
- Use modern image formats (WebP, AVIF)
- Minimize JavaScript on landing page
- Use system fonts where possible

---

## Environment Variables

```bash
# .env
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=xxx
PUBLIC_SITE_URL=https://artemiskit.dev
PUBLIC_GITHUB_REPO=artemiskit/artemiskit
```

---

## Deployment Checklist

- [ ] Domain configured (artemiskit.dev)
- [ ] SSL certificate active
- [ ] Supabase project created
- [ ] Waitlist table and RLS configured
- [ ] Environment variables set
- [ ] Analytics configured
- [ ] OG images generated (with orange branding)
- [ ] Favicon set (orange themed)
- [ ] 404 page created
- [ ] Sitemap generated
- [ ] robots.txt configured

---

*Last Updated: January 2024*
