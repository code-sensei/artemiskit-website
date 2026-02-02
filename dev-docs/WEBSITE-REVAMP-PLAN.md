# ArtemisKit Website Revamp Plan

## Overview

This document outlines the comprehensive plan to revamp the ArtemisKit landing page, aligning with our USP Analysis and Content Strategy while implementing modern, interactive design patterns.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Theme System](#2-theme-system)
3. [Hero Section Revamp](#3-hero-section-revamp)
4. [Use Cases Section Revamp](#4-use-cases-section-revamp)
5. [Component Architecture](#5-component-architecture)
6. [Implementation Phases](#6-implementation-phases)
7. [Technical Specifications](#7-technical-specifications)
8. [Skills Reference](#8-skills-reference)

---

## 1. Design Philosophy

### Alignment with USP Analysis

Based on **Option D: "The Open Source LLM Reliability Toolkit"** with **Option A (Security) as the spear**:

| Principle | Implementation |
|-----------|----------------|
| **Security-First Lead** | Hero emphasizes security/fear messaging, then expands to full toolkit |
| **Open Standard Positioning** | Highlight "one tool vs 3+" value proposition prominently |
| **Fear-Based Hook** | Dramatic, attention-grabbing headlines that address real pain points |
| **Technical Credibility** | Code examples, terminal demos, real metrics |

### Brand Voice (from Content Strategy)

- **Confident**: Bold statements, no hedging
- **Direct**: Short sentences, clear claims
- **Technical**: Engineer-to-engineer communication
- **Honest**: Acknowledge limitations, don't oversell
- **Urgent**: The problem is real, the solution is now

### Visual Identity

```
Theme: "Terminal Brutalism meets Warm Precision"
- Dark, professional aesthetic
- Warm orange (#f97316) as primary accent
- High contrast for readability
- Code/terminal aesthetics throughout
- Subtle animations that enhance, not distract
```

---

## 2. Theme System

### 2.1 Theme Modes

Implement four theme modes with a persistent theme switcher:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Light** | Light background, dark text | Daytime/bright environments |
| **Dark** | Dark background (current default), light text | Default, developer preference |
| **System** | Follows OS preference | Automatic adaptation |
| **High Contrast** | WCAG AAA compliant, maximum contrast | Accessibility, visual impairment |

### 2.2 Theme Switcher Component

Create `ThemeSwitcher.tsx` as a React component:

```
Location: src/components/ui/ThemeSwitcher.tsx
Features:
- Dropdown/segmented control with 4 options
- Icons for each mode (sun, moon, monitor, contrast)
- Persists to localStorage
- SSR-safe (no flash on load)
- Accessible (keyboard nav, screen reader labels)
```

**Placement:**
- Desktop: Header navbar (right side, before CTA buttons)
- Mobile: Mobile menu (prominent position)
- Docs: Starlight header (alongside existing controls)

### 2.3 Color Tokens by Theme

```css
/* Light Theme */
--color-bg-primary: #fafaf9;
--color-bg-secondary: #f5f5f4;
--color-text-primary: #1c1917;
--color-text-secondary: #57534e;

/* Dark Theme (current) */
--color-bg-primary: #0c0a09;
--color-bg-secondary: #1c1917;
--color-text-primary: #fafaf9;
--color-text-secondary: #a8a29e;

/* High Contrast */
--color-bg-primary: #000000;
--color-bg-secondary: #1a1a1a;
--color-text-primary: #ffffff;
--color-text-secondary: #e5e5e5;
--color-primary-500: #ff8c00; /* Higher saturation orange */
```

### 2.4 Implementation Tasks

- [ ] Create CSS custom properties for all theme tokens
- [ ] Create `ThemeSwitcher.tsx` component
- [ ] Add theme initialization script to `<head>` (prevent flash)
- [ ] Update `global.css` with theme-specific overrides
- [ ] Add theme switcher to `Header.astro`
- [ ] Add theme switcher to Starlight docs configuration
- [ ] Test all themes across all pages

---

## 3. Hero Section Revamp

### 3.1 Current Issues

| Issue | Problem |
|-------|---------|
| Generic headline | "Ship AI Products That Actually Work" doesn't differentiate |
| Weak value proposition | Doesn't communicate the "3+ tools in one" message |
| Missing fear/urgency | Doesn't leverage security-first wedge |
| Unclear ICP targeting | Doesn't speak directly to our primary audiences |

### 3.2 New Hero Content

#### Primary Headline (Security Wedge)

```
Option A (Fear-based):
"Your LLM is One Prompt Away from Disaster"

Option B (Solution-based):
"Stop Hoping Your AI is Secure. Start Proving It."

Option C (Unified tool):
"Most Teams Use 3+ Tools. You Need One."
```

**Recommended**: Option B as primary, with Option C as supporting message.

#### Supporting Text

```
Current (weak):
"Catch broken prompts before your users do."

New (stronger):
"Security red-teaming. Quality evaluation. Performance benchmarking.
One CLI. Complete LLM reliability. Open source."
```

#### Value Props Badges (Updated)

```
Current:
- 5-minute setup
- 50+ attack patterns
- GitHub Actions ready

New (more specific, fear-driven):
- 15+ attack vectors for red-teaming
- 10+ evaluator types for quality
- p50/p95/p99 performance metrics
- Apache 2.0 | Self-hosted | Your data stays yours
```

#### CTAs (Updated)

```
Primary CTA: "Get Started Free" → "Start Testing Now"
Secondary CTA: "Star on GitHub" → "View on GitHub"

Add tertiary: "Join Early Access" (for waitlist)
```

### 3.3 Hero Visual Updates

#### Terminal Demo Updates

Update `AnimatedTerminal.tsx` to showcase the three capabilities in sequence:

```
Sequence 1: Security Red-Team
$ artemiskit redteam config.yaml
Running 15 attack vectors...
[CRITICAL] Prompt injection vulnerability detected
[HIGH] Data extraction possible via role spoofing
Security Score: 42/100 (FAIL)

Sequence 2: Quality Evaluation
$ artemiskit run scenarios/
Running 24 test scenarios...
[PASS] Semantic similarity: 0.94
[PASS] Schema validation: 100%
[FAIL] Hallucination check: 2 failures
Quality Score: 91.6%

Sequence 3: Stress Test
$ artemiskit stress --rps 100
Load testing with 100 requests/second...
p50: 245ms | p95: 890ms | p99: 1,240ms
Throughput: 94.2 req/s
Cost estimate: $12.40/1000 requests
```

#### Background Enhancement

- Add subtle animated particles or grid that responds to scroll
- Implement gradient mesh that shifts based on mouse position (subtle)
- Keep performance-first (use CSS animations, avoid heavy JS)

### 3.4 Implementation Tasks

- [ ] Update headline copy based on USP analysis
- [ ] Rewrite supporting text with security-first messaging
- [ ] Update value prop badges with specific metrics
- [ ] Update CTA text and add waitlist CTA
- [ ] Redesign terminal demo sequence to show all 3 capabilities
- [ ] Add subtle background animations
- [ ] Test with target ICP personas for message clarity

---

## 4. Use Cases Section Revamp

### 4.1 Current Issues

| Issue | Problem |
|-------|---------|
| Static tabs | Click-only interaction, not engaging |
| Generic descriptions | Don't map to specific ICP pain points |
| No scroll-based engagement | Users may skip the section |
| Missing visual hierarchy | All use cases appear equal priority |

### 4.2 Scroll-Triggered Card Carousel

#### Interaction Design

```
Desktop:
- Cards are stacked/overlapped initially
- As user scrolls, cards animate into view one by one
- Active card is highlighted, others are dimmed
- Scroll position controls which card is active
- Parallax depth effect on cards

Mobile:
- Horizontal swipeable carousel
- Snap-to-card behavior
- Progress indicators (dots)
- Touch-friendly swipe gestures
```

#### Animation Specifications

```
Entry Animation:
- Cards slide in from right with stagger delay
- Fade in from 0 to 1 opacity
- Scale from 0.95 to 1
- Duration: 600ms with ease-out-expo

Scroll-Linked Behavior:
- Use Intersection Observer for trigger points
- Each card has 20vh scroll range for full visibility
- Active card: full opacity, scale(1), z-index highest
- Inactive cards: opacity 0.3, scale(0.95), z-index lower

Exit Animation:
- Cards slide out to left as user scrolls past
- Fade out with parallax offset
```

#### New Use Case Cards (Aligned with ICP Prioritization)

Based on Content Strategy Section 2.7 (Audience Prioritization for Launch):

**Priority 1 - Technical Practitioners (Week 1-2):**

```
1. Security Engineers / Red Team
   Icon: Shield with exclamation
   Title: "Red Team Your LLM"
   Hook: "Break it before attackers do"
   Pain: "Traditional security tools don't cover LLM attack surfaces"
   Features:
   - Prompt injection detection
   - Jailbreak resistance testing
   - Data leakage prevention
   - CVSS-like vulnerability scoring

2. ML Engineers / AI Engineers
   Icon: Brain/neural network
   Title: "Quality Gates That Scale"
   Hook: "Stop spot-checking. Start proving."
   Pain: "Manual testing doesn't scale beyond a few dozen examples"
   Features:
   - 10+ evaluator types
   - Semantic similarity checks
   - Regression detection
   - CI/CD integration

3. AI/ML Researchers
   Icon: Microscope/beaker
   Title: "Reproducible Evaluation"
   Hook: "Rigorous methodology for rigorous research"
   Pain: "Evaluation methodology varies wildly across papers"
   Features:
   - Standardized benchmarking
   - Reproducible pipelines
   - Statistical analysis
   - Open source extensibility
```

**Priority 2 - Technical + Process (Week 3):**

```
4. DevOps / Platform Engineers
   Icon: Server/gauge
   Title: "Know Your Limits"
   Hook: "Discover latency limits in staging, not production"
   Pain: "LLM performance is unpredictable under load"
   Features:
   - p50/p95/p99 latency metrics
   - Throughput analysis
   - Cost optimization
   - Capacity planning

5. Compliance / GRC Teams
   Icon: Clipboard with checkmark
   Title: "Audit-Ready AI Validation"
   Hook: "Documentation that satisfies regulators"
   Pain: "Auditors asking 'how do you validate AI?' with no good answer"
   Features:
   - EU AI Act ready
   - Automated audit trails
   - Risk scoring
   - Compliance reports
```

### 4.3 Component Architecture

Create new component: `UseCasesScrollCarousel.tsx`

```typescript
// Key features:
- useIntersectionObserver for scroll detection
- useScrollPosition for parallax calculations
- Framer Motion for smooth animations
- Responsive breakpoints (desktop scroll, mobile swipe)
- Reduced motion support (prefers-reduced-motion)
- Keyboard navigation support
```

### 4.4 Visual Design

```
Card Design:
- Glass morphism effect (backdrop-blur)
- Subtle border glow on active
- Icon with gradient background
- Hierarchy: Icon → Title → Hook → Features

Layout (Desktop):
- Cards in a 3D stacked arrangement
- Perspective transform for depth
- 60% viewport width for card container
- 40% for supporting content/metrics

Layout (Mobile):
- Full-width cards
- Horizontal scroll with snap
- Peek of next card visible (10%)
```

### 4.5 Implementation Tasks

- [ ] Create `UseCasesScrollCarousel.tsx` component
- [ ] Implement scroll-linked animations with Intersection Observer
- [ ] Add Framer Motion for smooth transitions
- [ ] Design and implement card glass morphism styles
- [ ] Add mobile swipe carousel with snap behavior
- [ ] Update use case content to match ICP pain points
- [ ] Add reduced motion fallback
- [ ] Performance optimize (will-change, GPU acceleration)
- [ ] Add analytics tracking for card engagement

---

## 5. Component Architecture

### 5.1 New Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `ThemeSwitcher.tsx` | `src/components/ui/` | Theme mode selector |
| `UseCasesScrollCarousel.tsx` | `src/components/landing/` | Interactive use cases |
| `ScrollProgress.tsx` | `src/components/ui/` | Scroll progress indicator |
| `AnimatedCounter.tsx` | `src/components/ui/` | Animated number counters |
| `ParallaxContainer.tsx` | `src/components/ui/` | Reusable parallax wrapper |

### 5.2 Components to Update

| Component | Updates |
|-----------|---------|
| `Hero.astro` | New copy, updated terminal demo, background effects |
| `Header.astro` | Add theme switcher, update mobile menu |
| `Layout.astro` | Add theme class handling |
| `AnimatedTerminal.tsx` | New demo sequence showing 3 capabilities |
| `global.css` | Theme variables, new animations |

### 5.3 Shared Hooks

```typescript
// src/hooks/useScrollProgress.ts
// Returns normalized scroll progress (0-1) for animations

// src/hooks/useIntersectionObserver.ts
// Reusable intersection observer with threshold options

// src/hooks/useReducedMotion.ts
// Detects prefers-reduced-motion preference

// src/hooks/useTheme.ts
// Theme state management with localStorage persistence
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Theme System)
**Duration: 1 session**

1. Create theme CSS custom properties
2. Build `ThemeSwitcher.tsx` component
3. Add theme initialization to prevent flash
4. Integrate into Header and docs
5. Test all themes

**Deliverables:**
- Working theme switcher on all pages
- Light, dark, system, high-contrast modes
- Persistent theme preference

### Phase 2: Hero Revamp
**Duration: 1-2 sessions**

1. Update hero copy (headlines, CTAs)
2. Redesign terminal demo sequence
3. Add background enhancements
4. Update value prop badges
5. Mobile optimization

**Deliverables:**
- New hero aligned with USP analysis
- Interactive terminal showing all 3 capabilities
- Improved conversion-focused CTAs

### Phase 3: Use Cases Revamp
**Duration: 2-3 sessions**

1. Create scroll carousel component
2. Implement animations and interactions
3. Update use case content
4. Mobile swipe implementation
5. Performance optimization

**Deliverables:**
- Interactive scroll-linked use cases section
- ICP-aligned content
- Mobile-friendly swipe carousel

### Phase 4: Polish & Integration
**Duration: 1 session**

1. Cross-browser testing
2. Performance audit (Lighthouse)
3. Accessibility audit (WCAG)
4. SEO optimization
5. Analytics integration

**Deliverables:**
- Production-ready revamped landing page
- Performance score > 90
- Accessibility score > 95

---

## 7. Technical Specifications

### 7.1 Animation Library

**Recommended: Framer Motion**

```bash
npm install framer-motion
```

Features needed:
- `useScroll` for scroll-linked animations
- `useInView` for intersection triggers
- `AnimatePresence` for enter/exit animations
- `motion` components for declarative animations

### 7.2 Performance Guidelines

```
Critical:
- Use CSS transforms (not layout properties) for animations
- Add will-change hints sparingly
- Debounce scroll handlers (or use requestAnimationFrame)
- Lazy load below-fold components
- Use content-visibility for off-screen sections

Targets:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 200ms
```

### 7.3 Accessibility Requirements

```
WCAG 2.1 AA Compliance:
- Color contrast ratios (4.5:1 for text, 3:1 for UI)
- Keyboard navigation for all interactive elements
- Screen reader labels and announcements
- Reduced motion support
- Focus visible indicators
- Skip links for navigation

High Contrast Mode (WCAG AAA):
- 7:1 contrast ratio for all text
- No information conveyed by color alone
- Enhanced focus indicators
```

### 7.4 Browser Support

```
Modern browsers (ES2020+):
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

Graceful degradation:
- Static content for older browsers
- No JavaScript fallback for critical content
```

---

## 8. Skills Reference

The following skills have been installed to guide implementation:

### Installed Skills

| Skill | Purpose | Key Guidance |
|-------|---------|--------------|
| `frontend-design` | Production-grade UI | Creative, polished code avoiding generic AI aesthetics |
| `web-design-guidelines` | Design standards | Comprehensive patterns for professional design |
| `ui-ux-pro-max` | UX best practices | Professional UI/UX patterns |
| `tailwind-design-system` | Tailwind patterns | Cohesive design system with Tailwind |
| `shadcn-ui` | Component patterns | Modern component library approaches |
| `seo-audit` | SEO optimization | Search engine optimization |
| `fixing-motion-performance` | Animation performance | Smooth animations with performance |
| `accessibility-compliance` | WCAG compliance | Accessibility standards |

### How to Use Skills

When implementing each phase, reference the relevant skills:

```
Phase 1 (Themes):
→ tailwind-design-system (design tokens)
→ accessibility-compliance (high contrast mode)

Phase 2 (Hero):
→ frontend-design (distinctive UI)
→ web-design-guidelines (visual hierarchy)
→ seo-audit (meta tags, structured data)

Phase 3 (Use Cases):
→ fixing-motion-performance (scroll animations)
→ ui-ux-pro-max (interaction patterns)
→ shadcn-ui (component architecture)

Phase 4 (Polish):
→ All skills for comprehensive review
```

---

## Appendix A: Content Mapping

### Hero Messaging Hierarchy

| Audience | Primary Hook | Secondary Message |
|----------|--------------|-------------------|
| Security Engineers | "Break it before others do" | Systematic red teaming |
| ML Engineers | "Ship models you trust" | Quality gates that scale |
| Compliance Teams | "Audit-ready AI validation" | Documentation that satisfies regulators |
| DevOps/SRE | "Know your limits before users find them" | Performance clarity |

### Value Proposition Matrix

| Capability | Functional Value | Emotional Value | Economic Value |
|------------|------------------|-----------------|----------------|
| Security Red-teaming | Prevent breaches | Peace of mind | Avoid incident costs |
| Quality Evaluation | Catch regressions | Professional credibility | Reduce manual testing |
| Stress Testing | Capacity planning | Control | Optimize infrastructure costs |
| Unified CLI | One workflow | Simplicity | No tool sprawl |

---

## Appendix B: File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── ThemeSwitcher.tsx      [NEW]
│   │   ├── ScrollProgress.tsx     [NEW]
│   │   ├── AnimatedCounter.tsx    [NEW]
│   │   └── ParallaxContainer.tsx  [NEW]
│   ├── landing/
│   │   ├── Hero.astro             [UPDATE]
│   │   ├── UseCases.astro         [UPDATE]
│   │   ├── UseCasesScrollCarousel.tsx [NEW - replaces UseCaseTabs.tsx]
│   │   └── AnimatedTerminal.tsx   [UPDATE]
│   ├── Header.astro               [UPDATE]
│   └── Footer.astro
├── hooks/
│   ├── useScrollProgress.ts       [NEW]
│   ├── useIntersectionObserver.ts [NEW]
│   ├── useReducedMotion.ts        [NEW]
│   └── useTheme.ts                [NEW]
├── styles/
│   └── global.css                 [UPDATE]
└── layouts/
    └── Layout.astro               [UPDATE]
```

---

## Appendix C: Success Metrics

### Quantitative

| Metric | Current | Target |
|--------|---------|--------|
| Bounce Rate | TBD | < 40% |
| Time on Page | TBD | > 2 min |
| Scroll Depth | TBD | > 75% |
| CTA Click Rate | TBD | > 5% |
| Lighthouse Performance | TBD | > 90 |
| Lighthouse Accessibility | TBD | > 95 |

### Qualitative

- Hero clearly communicates USP within 5 seconds
- Use cases resonate with target ICPs
- Theme preferences persist correctly
- Animations enhance, don't distract
- Mobile experience is polished

---

*Document Version: 1.0*
*Last Updated: February 2, 2026*
*Author: AI Assistant*
