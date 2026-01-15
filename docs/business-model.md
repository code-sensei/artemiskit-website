# ArtemisKit Business Model

## Overview

ArtemisKit follows an **open-core business model** where the core CLI toolkit is fully open source (Apache-2.0), while premium cloud features and enterprise capabilities are offered as paid services.

---

## Open Source (Apache-2.0)

### What's Included

Everything needed for individual developers and teams to evaluate LLM applications locally:

#### Core CLI (`@artemiskit/cli`)
- `artemiskit run` / `akit run` - Scenario-based evaluation
- `artemiskit redteam` / `akit redteam` - Security testing
- `artemiskit stress` / `akit stress` - Load testing
- `artemiskit report` / `akit report` - Report regeneration

#### Packages
| Package | Description | License |
|---------|-------------|---------|
| `@artemiskit/cli` | Command-line interface | Apache-2.0 |
| `@artemiskit/core` | Core runtime and types | Apache-2.0 |
| `@artemiskit/reports` | HTML/JSON report generation | Apache-2.0 |
| `@artemiskit/redteam` | Security testing module | Apache-2.0 |
| `@artemiskit/adapter-openai` | OpenAI provider | Apache-2.0 |
| `@artemiskit/adapter-vercel-ai` | Multi-provider adapter | Apache-2.0 |

#### Features
- **Scenario Testing**
  - YAML-based scenario definition
  - Multi-turn conversation support
  - Expectation matching (contains, equals, regex, not_contains)
  - Variable injection and templating
  - Provider/model configuration per scenario

- **Security Testing (Red Team)**
  - Built-in attack categories (injection, jailbreak, extraction, hallucination, pii)
  - Configurable iterations per category
  - Vulnerability detection and scoring
  - Attack success/failure tracking

- **Stress Testing**
  - Concurrent request testing
  - Configurable concurrency and iterations
  - Latency metrics (avg, min, max, p50, p95, p99)
  - Success/failure rate tracking
  - Throughput measurement

- **Reports**
  - Interactive HTML reports
  - JSON manifest export
  - Configuration traceability (resolved_config with source tracking)
  - Report regeneration from saved manifests

- **Multi-Provider Support**
  - OpenAI (direct)
  - Azure OpenAI
  - Anthropic Claude
  - Google AI (Gemini) - coming soon
  - Ollama (local models) - coming soon

- **Configuration**
  - `artemis.config.yaml` file support
  - Environment variable configuration
  - CLI flag overrides
  - Clear precedence (CLI > Scenario > Config > Env > Default)

- **Developer Experience**
  - Zero-config defaults
  - Verbose mode for debugging
  - Exit codes for CI/CD integration
  - Beautiful terminal output

#### Future Open Source Features (Roadmap)
- Directory scanning for scenarios
- Advanced expectations (similarity, llm_judge, json_schema etc.)
- Local SQLite storage for run history
- `artemiskit history` commands
- Model comparison (`artemiskit compare`)
- Additional providers (OpenRouter, LiteLLM)
- GitHub Actions for CI/CD

---

## Monetized (Cloud & Enterprise)

### ArtemisKit Cloud (SaaS)

A hosted platform that extends the open source CLI with collaboration, automation, and analytics.

#### Cloud Features

| Feature | Description | Tier |
|---------|-------------|------|
| **Cloud Sync** | Push/pull results to cloud | Free |
| **Team Workspaces** | Collaborate on evaluation suites | Pro |
| **Scheduled Runs** | Automated periodic testing (cron) | Pro |
| **Historical Analytics** | Track quality/security over time | Pro |
| **Trend Dashboards** | Visualize metrics and regressions | Pro |
| **Email Notifications** | Alert on failures/regressions | Pro |
| **Slack Integration** | Notifications and bot commands | Team |
| **API Access** | REST API for automation | Team |
| **Webhook Triggers** | Trigger runs from external systems | Team |
| **Custom Dashboards** | Build custom analytics views | Team |
| **SSO/SAML** | Enterprise identity provider | Enterprise |
| **Audit Logging** | Compliance and security logs | Enterprise |
| **Data Residency** | Regional data storage options | Enterprise |
| **SLA Guarantees** | Uptime and support SLAs | Enterprise |
| **Dedicated Support** | Priority support channel | Enterprise |

### Pricing Tiers

#### Free Tier
- **Price:** $0/month
- **Limits:**
  - Unlimited local CLI usage
  - 100 cloud runs/month
  - 1 project
  - 7-day history retention
  - Community support

#### Pro Tier
- **Price:** $49/month (per user)
- **Includes:**
  - Everything in Free
  - Unlimited cloud runs
  - 10 projects
  - 90-day history retention
  - Scheduled runs (up to 10/day)
  - Email notifications
  - Priority email support

#### Team Tier
- **Price:** $149/month (up to 10 seats)
- **Includes:**
  - Everything in Pro
  - Unlimited projects
  - 1-year history retention
  - Team collaboration features
  - Slack integration
  - API access
  - Webhook triggers
  - Custom dashboards
  - Phone support

#### Enterprise Tier
- **Price:** Custom (contact sales)
- **Includes:**
  - Everything in Team
  - Unlimited seats
  - Unlimited history retention
  - SSO/SAML integration
  - Audit logging
  - Data residency options
  - SLA guarantees (99.9% uptime)
  - Dedicated support engineer
  - Self-hosted deployment option
  - Custom integrations
  - Training and onboarding

---

## Boundary Definitions

### What Stays Open Source

**Principle:** Core evaluation capabilities should always be free and open.

| Capability | Rationale |
|------------|-----------|
| CLI commands | Core product value |
| Scenario execution | Fundamental feature |
| Report generation | Essential output |
| Provider adapters | Ecosystem integration |
| Local storage | Self-hosted capability |
| CI/CD integration | Developer workflow |

### What's Monetized

**Principle:** Collaboration, automation, and enterprise features are premium.

| Capability | Rationale |
|------------|-----------|
| Cloud storage/sync | Infrastructure cost |
| Scheduled automation | Operational overhead |
| Team management | Collaboration value |
| Advanced analytics | Added insight value |
| Enterprise security | Compliance requirements |
| Dedicated support | Service cost |

---

## Revenue Projections (Reference)

### Year 1 Goals
- **Free users:** 5,000+
- **Pro subscribers:** 100+
- **Team subscribers:** 20+
- **Enterprise contracts:** 2-5
- **Target ARR:** $100K-$200K

### Year 2 Goals
- **Free users:** 20,000+
- **Pro subscribers:** 500+
- **Team subscribers:** 100+
- **Enterprise contracts:** 10-20
- **Target ARR:** $500K-$1M

---

## Go-to-Market Strategy

### Phase 1: Open Source Traction
- Launch open source CLI
- Build community on GitHub
- Content marketing (blog, tutorials)
- Developer advocacy
- Conference talks

### Phase 2: Cloud Launch
- Private beta with waitlist
- Public launch with Free tier
- Product Hunt launch
- Partnership with LLM providers

### Phase 3: Enterprise
- Sales team hiring
- Enterprise feature development
- SOC 2 certification
- Case studies and testimonials

---

## Competitive Positioning

### vs. Building In-House
- **ArtemisKit:** Ready-to-use, maintained, community-driven
- **In-house:** Custom but maintenance burden

### vs. Generic Testing Tools
- **ArtemisKit:** LLM-specific assertions, multi-turn support, security focus
- **Generic:** Not designed for LLM non-determinism

### vs. Closed-Source Alternatives
- **ArtemisKit:** Open source core, no vendor lock-in, transparent
- **Closed:** Proprietary, limited customization

---

## Success Metrics

### Open Source Health
- GitHub stars
- npm downloads
- Contributors
- Issues resolved
- Community engagement

### Cloud Business
- Waitlist signups
- Conversion rate (Free → Pro)
- Monthly recurring revenue (MRR)
- Customer retention
- Net promoter score (NPS)

---

*Last Updated: January 2026*
