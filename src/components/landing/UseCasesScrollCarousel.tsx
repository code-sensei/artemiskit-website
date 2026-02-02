import { useState } from "react";

interface UseCase {
  id: string;
  label: string;
  shortLabel: string;
  title: string;
  hook: string;
  pain: string;
  features: string[];
  command: string;
  accent: string;
  accentRgb: string;
}

/**
 * Use cases aligned with Content Strategy ICP prioritization:
 * Tier 1: Security Engineers, ML Engineers, AI Researchers
 * Tier 2: Compliance/GRC, DevOps/SRE
 */
const useCases: UseCase[] = [
  {
    id: "security",
    label: "Security Teams",
    shortLabel: "Security",
    title: "Red Team Your LLM",
    hook: "Break it before attackers do",
    pain: "Traditional security tools don't cover LLM attack surfaces. Prompt injection is OWASP #1, but most teams don't test for it.",
    command: "akit redteam scenario.yaml",
    features: [
      "Prompt injection detection (direct & indirect)",
      "Jailbreak resistance testing",
      "Data extraction prevention",
      "CVSS-like vulnerability scoring",
    ],
    accent: "#ef4444",
    accentRgb: "239, 68, 68",
  },
  {
    id: "ml-engineers",
    label: "ML Engineers",
    shortLabel: "ML",
    title: "Quality Gates That Scale",
    hook: "Stop spot-checking. Start proving.",
    pain: "Manual testing doesn't scale beyond a few dozen examples. LLM outputs are non-deterministic—traditional testing doesn't work.",
    command: "akit run scenarios/",
    features: [
      "12 evaluator types (semantic, LLM-judge, schema)",
      "Automated regression detection",
      "CI/CD integration with pass/fail gates",
      "Reproducible test scenarios",
    ],
    accent: "#3b82f6",
    accentRgb: "59, 130, 246",
  },
  {
    id: "researchers",
    label: "AI Researchers",
    shortLabel: "AI",
    title: "Reproducible Evaluation",
    hook: "Rigorous methodology for rigorous research",
    pain: "Evaluation methodology varies wildly across papers. Peer reviewers question evaluation rigor, and reproducibility is a constant challenge.",
    command: "akit run benchmark.yaml --seed 42",
    features: [
      "Standardized benchmarking framework",
      "Reproducible evaluation pipelines",
      "Statistical analysis and comparisons",
      "Open source and extensible",
    ],
    accent: "#a855f7",
    accentRgb: "168, 85, 247",
  },
  {
    id: "devops",
    label: "DevOps / Platform",
    shortLabel: "DevOps",
    title: "Know Your Limits",
    hook: "Discover latency limits in staging, not production",
    pain: "LLM performance is unpredictable under load. Staging doesn't reflect production patterns, and latency spikes are discovered by users.",
    command: "akit stress scenario.yaml -c 50 -d 60",
    features: [
      "p50/p95/p99 latency metrics",
      "Throughput and capacity analysis",
      "Token cost estimation",
      "SLA validation and alerts",
    ],
    accent: "#f59e0b",
    accentRgb: "245, 158, 11",
  },
  {
    id: "compliance",
    label: "Compliance / GRC",
    shortLabel: "Compliance",
    title: "Audit-Ready AI Validation",
    hook: "Documentation that satisfies regulators",
    pain: 'EU AI Act (Aug 2026) requires documented testing. Auditors ask "how do you validate AI outputs?" and there\'s no good answer.',
    command: "akit report <run-id> -f html -o ./reports",
    features: [
      "EU AI Act compliance documentation",
      "Automated audit trails",
      "Risk scoring and reports",
      "HIPAA, SOX, NIST AI RMF ready",
    ],
    accent: "#10b981",
    accentRgb: "16, 185, 129",
  },
];

export default function UseCasesScrollCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCase = useCases[activeIndex];

  return (
    <section className="relative bg-[var(--theme-bg-primary)] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <svg
              className="w-4 h-4 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-sm font-semibold text-orange-400">
              Use Cases
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--theme-text-primary)] mb-4 tracking-tight">
            Built for Every Team
          </h2>

          <p className="text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto">
            From security audits to compliance documentation, ArtemisKit adapts
            to your workflow.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {useCases.map((useCase, index) => (
            <button
              key={useCase.id}
              onClick={() => setActiveIndex(index)}
              className="relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  activeIndex === index
                    ? `rgba(${useCase.accentRgb}, 0.15)`
                    : "transparent",
                color:
                  activeIndex === index
                    ? useCase.accent
                    : "var(--theme-text-muted)",
                border:
                  activeIndex === index
                    ? `1px solid rgba(${useCase.accentRgb}, 0.3)`
                    : "1px solid transparent",
              }}
            >
              <span className="hidden sm:inline">{useCase.label}</span>
              <span className="sm:hidden">{useCase.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Card Content */}
        <div
          className="relative rounded-2xl overflow-hidden border transition-all duration-500"
          style={{
            backgroundColor: "var(--theme-bg-elevated)",
            borderColor: `rgba(${activeCase.accentRgb}, 0.25)`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(${activeCase.accentRgb}, 0.1)`,
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${activeCase.accent}, transparent)`,
            }}
          />

          {/* Content */}
          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-3">
                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                  {/* Label badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300"
                    style={{
                      backgroundColor: `rgba(${activeCase.accentRgb}, 0.1)`,
                      borderColor: `rgba(${activeCase.accentRgb}, 0.3)`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: activeCase.accent }}
                    />
                    <span
                      className="text-sm font-medium transition-colors duration-300"
                      style={{ color: activeCase.accent }}
                    >
                      {activeCase.label}
                    </span>
                  </div>

                  {/* Card number */}
                  <span className="text-sm font-mono text-[var(--theme-text-muted)]">
                    {String(activeIndex + 1).padStart(2, "0")}/
                    {String(useCases.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--theme-text-primary)] mb-3 tracking-tight">
                  {activeCase.title}
                </h3>

                {/* Hook */}
                <p className="text-lg md:text-xl text-[var(--theme-text-secondary)] mb-4 font-medium">
                  {activeCase.hook}
                </p>

                {/* Pain point */}
                <p className="text-[var(--theme-text-tertiary)] mb-6 leading-relaxed text-sm md:text-base">
                  {activeCase.pain}
                </p>

                {/* Command */}
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--theme-bg-primary)] border border-[var(--theme-border)]">
                  <span
                    className="font-mono text-sm transition-colors duration-300"
                    style={{ color: activeCase.accent }}
                  >
                    $
                  </span>
                  <code className="text-sm text-[var(--theme-text-secondary)] font-mono">
                    {activeCase.command}
                  </code>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="lg:col-span-2">
                <div className="space-y-3">
                  {activeCase.features.map((feature, idx) => (
                    <div
                      key={`${activeCase.id}-${idx}`}
                      className="flex items-start gap-3 animate-fade-in"
                      style={{
                        animationDelay: `${idx * 80}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300"
                        style={{
                          backgroundColor: `rgba(${activeCase.accentRgb}, 0.15)`,
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={activeCase.accent}
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-[var(--theme-text-tertiary)] text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <a
                    href="/docs/cli/getting-started/"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3"
                    style={{ color: activeCase.accent }}
                  >
                    <span>Learn more</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation dots (mobile-friendly) */}
          <div className="flex justify-center gap-2 pb-6">
            {useCases.map((useCase, index) => (
              <button
                key={`dot-${useCase.id}`}
                onClick={() => setActiveIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    activeIndex === index
                      ? useCase.accent
                      : "var(--theme-border)",
                  transform: activeIndex === index ? "scale(1.25)" : "scale(1)",
                }}
                aria-label={`Go to ${useCase.label}`}
              />
            ))}
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-center mt-6 text-xs text-[var(--theme-text-muted)]">
          Click tabs or dots to explore different use cases
        </p>
      </div>

      {/* CSS for fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
