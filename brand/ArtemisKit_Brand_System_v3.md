# ArtemisKit — Brand System v3

Proposed implementation: 24 October 2026. Prepared for Babangida Tsowa / Vorbtech Innovative Solutions. This evolves the approved 9–15 October identity; it preserves the official logo, colour palette and Owl Inspector. Individual publication approval remains separate.

## Brand foundation

**Product:** ArtemisKit, an open-source AI assurance toolkit.

**Attribution:** An open-source project by Vorbtech Innovative Solutions.

**Positioning:** For builders and reviewers who need to understand AI behaviour in a real workflow, ArtemisKit makes requirements testable and evidence inspectable through scenarios, controlled execution and explicit outcome checks.

**Purpose:** Help people make better decisions about AI by exposing what was tested, what happened and what remains unknown.

**Promise:** Clear requirements. Inspectable evidence. Visible limitations. This is an editorial promise about how we work, not a guarantee of model behaviour.

**Website lead:** “Your AI has a job. Test it for that job.”

**Descriptive sentence:** “Test models and agents against real workflows, clear rules and outcomes you can inspect.”

The project should be relevant internationally while demonstrating the value of transparent, responsible engineering from Nigeria. Show that through useful work, documentation and open participation. Avoid generic geographic superiority claims or agency endorsements.

## Brand architecture

ArtemisKit retains its own developer identity. VIS is the organisation behind the project and the provider of separately scoped assessment and implementation services. The personal founder identity can appear on the About page and credited work, not as the default voice of every product page.

Use the standard attribution in the homepage and footer. Use “AI Assurance by Vorbtech” on the service path. Do not rebrand the toolkit in VIS blue. Do not imply that buying a VIS service is necessary to use the open-source toolkit. Do not bundle or describe Loki as part of ArtemisKit.

Use Apache-2.0 as recorded in the core repository. Do not apply that software licence indiscriminately to third-party fonts, trademarks or artwork; retain their applicable notices.

## Audience and navigation

1. Developers: install, author a scenario, inspect results, integrate in CI.
2. Evaluation and research teams: controlled workflows, provider setup, reproducibility and evidence semantics.
3. Security and technical reviewers: scoped boundary testing, traces, valid/invalid outcomes and limitations.
4. Governance and domain stakeholders: plain-language scope, findings, exclusions and human review.
5. Contributors: source, issues, contribution and security guidance.
6. Organisations seeking an assessment: high-level request, authorised data and access, agreed scope.

Primary adoption path: Home → Getting started → Relevant guide → Source/contribution.
Service path: Home → AI Assurance/use case → Apply → Agreed private scoping.

## Personality

A **sharp-eyed builder**: observant, precise, practical, warm, quietly opinionated and occasionally dryly funny. It notices the awkward case and explains why it matters. It is willing to say a measurement is unavailable. It neither performs expertise nor talks down to a beginner.

- Competence without posturing.
- Candour without alarmism.
- Warmth without childishness.
- Confidence proportional to evidence.
- Curiosity with a concrete next check.

## Voice and tone

The voice stays consistent; tone changes with the reader's task.

| Context | Tone | Writing example |
| --- | --- | --- |
| Homepage | Direct, concrete, inviting | Your AI has a job. Test it for that job. |
| Tutorial | Patient, sequential, exact | Install Bun before running the CLI. npm installs the package; Bun executes it. |
| CLI error | Specific and actionable | Validation failed at `target.provider`. Select a supported provider, then validate again. (Example microcopy; not a claim of current CLI output.) |
| Finding | Neutral, scoped | The task failed this criterion. Review the linked execution evidence. |
| Missing evidence | Honest, explanatory | The measurement is unavailable and is excluded from the success rate. |
| Release | Factual, useful | Offline reports can now export saved workflow evidence without another model call. |
| Community | Friendly, practical | Found the awkward case? Bring a small reproduction. |
| Social | Conversational, observant | A polished answer can still miss the job. What does the final state show? |
| Service proposal | Outcome-led, plain | We will agree the workflow and checks, run controlled tests, and explain the findings and gaps. |

Start with a concrete situation, observation or useful question. Explain one mechanism before adding more. Contractions are welcome in editorial copy; use unambiguous wording for instructions. Humour comes from a shared debugging frustration, never from mocking users, vulnerable groups or a developer's skill.

Avoid forced three-part slogans, repeated rhetorical rhythms, motivational padding, fear-based urgency, “revolutionary,” “bulletproof,” “safest,” generic engagement bait and invented team experiences. Do not end every social post with a question or product pitch. Preserve empty lines between LinkedIn paragraphs.

## Terminology and factual discipline

- “Scenario-based AI assurance” describes the organising approach.
- “Prompt-response evaluation” and “agent-workflow evaluation” are different test contracts.
- “Runtime completed” does not mean “task passed.”
- “Report generated” does not mean the tested system passed.
- Valid eligible pass/fail outcomes have a defined denominator. Invalid, unavailable and unsupported evidence stays visible outside it.
- A saved record and its digests are not a cryptographic attestation of the external world.
- A milestone number may differ from individual package versions.
- Planned work is explicitly marked as planned. Public model rankings require published eligible evidence.
- No legal certification, guaranteed safety or universal “best model” claims.
- Never invent customers, numbers, test output, testimonials, badges or endorsements.
- Label illustrative scope beside the example. Do not visually simulate a live passing run as proof.

## Visual concept

The new website direction is an **evidence notebook**: warm editorial clarity around a precise technical core. It extends the approved Proof Gate and Trace Ribbon into page composition. A visitor should remember a crisp orange boundary framing something worth inspecting, supported by excellent typography rather than decorative clutter.

### Palette

| Role | Value | Use |
| --- | --- | --- |
| Brand orange | `#FF7A18` | Primary emphasis, boundary traces, highlights and action surfaces |
| Charcoal | `#0D1115` | Text on light surfaces, technical panels, dark sections |
| Warm white | `#F5F3EC` | Main reading surface, text on charcoal |
| Muted text | `#5B5E60` | Supporting text on warm white |
| Rule | `#D7D6CE` | Light surface separators |
| Accessible text orange | `#A23E00` / `#B84600` | Text/link treatment on light backgrounds, never logo recolouring |

Neutral utility shades may support hierarchy. Green signals only an actually passing measured check, never decoration or a presumed result. Illustrative examples do not get a green pass badge. Status uses words and icon/shape as well as colour.

### Logo

Use original supplied logo and icon files. The wordmark's original internal colour values remain untouched even when they differ from UI tokens. Preserve proportions; no filters, redrawing, stretching or overlap. Choose the light/dark variant to match its surface. Keep clear space at least one quarter of the icon height around the mark. Use the full wordmark when space permits; use the original icon for favicon/app-icon applications. Do not invent a secondary logo from a gate, ribbon or owl wing.

### Typography

Geist for headings and body, Geist Mono for actual code and necessary metadata. Fonts are bundled locally. Display headings use medium weight, tight tracking and deliberate line breaks. Body text stays readable; monospace is never the default for paragraphs.

- Desktop display: approximately 70–82 px; mobile approximately 46–58 px.
- Section heading: approximately 32–48 px.
- Body: 16–19 px, 1.6–1.75 line height.
- Metadata: approximately 11–12 px; no essential information in illegible microtext.
- Docs preserve code overflow within the code block and readable tables.

### Composition

Use a 1248 px maximum content width, generous margins and a clear progression. Main grid breaks into one column on mobile. Use thin rules, square-corner evidence panels, mostly flat surfaces and restrained depth. Avoid a page made of identical rounded cards. Every section must add information.

Homepage progression: specific promise → illustrative scope → test capabilities → readable scenario → context-sensitive use cases → service path → open-source participation → useful FAQs.

### Motifs

**Proof Gate:** layered rectangular frames, clipped upper-right corner and deliberate right-upright gap. Orange front, charcoal depth, restrained edges. On the web, a flat clipped frame can focus an evidence panel. Never obstruct code or imply certification.

**Trace Ribbon:** a broad stepped orange path with right-angle folds, angled ends and a charcoal inset. Use to guide an editorial relationship. Never imply quantitative progress or growth without actual data.

**Owl Inspector:** preserve the canonical geometric owl: charcoal feather plates, warm-white face/chest, orange-ringed eyes, angular ear tufts and clipped orange wing detail. Calm, observant and capable. Use the approved atlas plus closest pose for any new image or animation. No plush, childish or alternate owl designs. The owl clarifies a lesson; the official logo stays separate and visible.

Canonical reference remains `/ArtemisKit/ArtemisKit_Owl_Mascot_Reference_Pack.zip`, especially `reference/Owl_Mascot_9_Pose_Atlas.png`. Retain existing social rules and references. This site does not need a mascot on every section.

### Motion and interactions

Use short entrance transitions and functional feedback. Tabs must be keyboard-operable and expose selection state. Respect reduced-motion preferences. No endless terminal animation, fake live metrics or auto-playing sound. Honour a user's focus and scroll position.

## Documentation standards

Keep docs under `/docs/` on the same hostname. Retain searchable, static HTML and stable section paths. Cover installation, scenarios, providers, evaluators, CLI, SDK, adapters, storage, CI/CD, workflows, outcome checks, recovery, reporting and reproducibility.

Correct runtime instructions: the CLI requires Bun even with npm installation. The current recorded milestone is 0.6.4; CLI/SDK package version is 0.6.3. Package maps, qualification boundaries and source snapshots must remain explicit. Link source-backed references and update them through a reproducible sync process.

Code must come from current source. Sample output must be labelled illustrative. Do not publish private evaluation records, customer material, checkpoints or credentials. State limitations near the relevant claim.

## Domain and hosting

Canonical recommendation: `artemiskit.vorbtech.com.ng`.

Redirect `akit.vorbtech.com.ng` to the same full path on the canonical host. The full product name aids recognition, spelling and provenance; the short alias is useful for spoken or typed convenience. Keep documentation at `/docs/`, not a separate service requiring duplicate maintenance.

Static Astro output, served by the existing VPS web stack, avoids a long-running app process or database for a documentation/marketing site. Use TLS and an explicit release/rollback directory. Confirm the existing server stack before enabling any supplied configuration. Do not change existing sites or point DNS before the exact target is known.

## Review before release

Check product claims against the exact core snapshot, mobile/desktop layout, keyboard and reduced-motion behaviour, source links, canonical metadata, search and docs routes, download assets, CSP/header compatibility and the deployment health check. Remove unused waitlist/admin collection surfaces from the static release. A complete build does not verify DNS, TLS or the VPS until the live environment is tested.

## Sources

- Current approved `ArtemisKit_Brand_Direction.md`, version 5, updated 15 October 2026.
- `code-sensei/artemiskit` core snapshot `e58778bef40bf77b4294805e47f2d16c89cece0a`.
- Core `docs/website-ai-assurance-brief.md`, `AI_ASSURANCE.md`, workflow guides and 0.6.4 release records.
- Existing official website logo files, retained without redesign.
