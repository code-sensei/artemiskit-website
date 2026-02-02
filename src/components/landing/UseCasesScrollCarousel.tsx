import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface UseCase {
  id: string;
  label: string;
  title: string;
  hook: string;
  pain: string;
  features: string[];
  command: string;
  accent: string;
  accentLight: string;
}

// Use cases aligned with Content Strategy ICP prioritization
const useCases: UseCase[] = [
  {
    id: "security",
    label: "Security Teams",
    title: "Red Team Your LLM",
    hook: "Break it before attackers do",
    pain: "Traditional security tools don't cover LLM attack surfaces. Prompt injection is OWASP #1, but most teams don't test for it.",
    command: "artemiskit redteam config.yaml",
    features: [
      "Prompt injection detection (direct & indirect)",
      "Jailbreak resistance testing",
      "Data extraction prevention",
      "CVSS-like vulnerability scoring",
    ],
    accent: "#ef4444",
    accentLight: "rgba(239, 68, 68, 0.1)",
  },
  {
    id: "ml-engineers",
    label: "ML Engineers",
    title: "Quality Gates That Scale",
    hook: "Stop spot-checking. Start proving.",
    pain: "Manual testing doesn't scale beyond a few dozen examples. LLM outputs are non-deterministic—traditional testing doesn't work.",
    command: "artemiskit run scenarios/",
    features: [
      "10+ evaluator types (semantic, LLM-judge, schema)",
      "Automated regression detection",
      "CI/CD integration with pass/fail gates",
      "Reproducible test scenarios",
    ],
    accent: "#3b82f6",
    accentLight: "rgba(59, 130, 246, 0.1)",
  },
  {
    id: "researchers",
    label: "AI Researchers",
    title: "Reproducible Evaluation",
    hook: "Rigorous methodology for rigorous research",
    pain: "Evaluation methodology varies wildly across papers. Peer reviewers question evaluation rigor, and reproducibility is a constant challenge.",
    command: "artemiskit run --seed 42 benchmark.yaml",
    features: [
      "Standardized benchmarking framework",
      "Reproducible evaluation pipelines",
      "Statistical analysis and comparisons",
      "Open source and extensible",
    ],
    accent: "#a855f7",
    accentLight: "rgba(168, 85, 247, 0.1)",
  },
  {
    id: "devops",
    label: "DevOps / Platform",
    title: "Know Your Limits",
    hook: "Discover latency limits in staging, not production",
    pain: "LLM performance is unpredictable under load. Staging doesn't reflect production patterns, and latency spikes are discovered by users.",
    command: "artemiskit stress --rps 100 --duration 60s",
    features: [
      "p50/p95/p99 latency metrics",
      "Throughput and capacity analysis",
      "Token cost estimation",
      "SLA validation and alerts",
    ],
    accent: "#f59e0b",
    accentLight: "rgba(245, 158, 11, 0.1)",
  },
  {
    id: "compliance",
    label: "Compliance / GRC",
    title: "Audit-Ready AI Validation",
    hook: "Documentation that satisfies regulators",
    pain: 'EU AI Act (Aug 2026) requires documented testing. Auditors ask "how do you validate AI outputs?" and there\'s no good answer.',
    command: "artemiskit report --format compliance",
    features: [
      "EU AI Act compliance documentation",
      "Automated audit trails",
      "Risk scoring and reports",
      "HIPAA, SOX, NIST AI RMF ready",
    ],
    accent: "#10b981",
    accentLight: "rgba(16, 185, 129, 0.1)",
  },
];

interface CardProps {
  useCase: UseCase;
  index: number;
  activeIndex: number;
  totalCards: number;
  prefersReducedMotion: boolean;
}

function Card({
  useCase,
  index,
  activeIndex,
  totalCards,
  prefersReducedMotion,
}: CardProps) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  const isFuture = index > activeIndex;
  const distance = index - activeIndex;

  // Calculate visual properties based on position
  const getTransform = () => {
    if (prefersReducedMotion) return {};

    if (isPast) {
      return {
        y: -60,
        scale: 0.95,
        opacity: 0,
        rotateX: 5,
      };
    }

    if (isFuture) {
      return {
        y: distance * 24,
        scale: 1 - distance * 0.03,
        opacity: Math.max(0.2, 1 - distance * 0.25),
        rotateX: 0,
      };
    }

    return {
      y: 0,
      scale: 1,
      opacity: 1,
      rotateX: 0,
    };
  };

  return (
    <motion.div
      className="absolute inset-x-0 w-full"
      initial={false}
      animate={{
        ...getTransform(),
        zIndex: totalCards - index,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 0.8,
      }}
      style={{
        transformOrigin: "center top",
        perspective: 1000,
      }}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm"
        style={{
          boxShadow: isActive
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px ${useCase.accent}20`
            : "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${useCase.accent}, transparent)`,
          }}
        />

        {/* Content */}
        <div className="relative p-6 md:p-8 lg:p-10">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
            {/* Left Column - Main Content (3 cols) */}
            <div className="lg:col-span-3">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                {/* Label badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: useCase.accentLight,
                    borderColor: `${useCase.accent}30`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: useCase.accent }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: useCase.accent }}
                  >
                    {useCase.label}
                  </span>
                </div>

                {/* Card number */}
                <span className="text-sm font-mono text-zinc-600">
                  {String(index + 1).padStart(2, "0")}/
                  {String(totalCards).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-3 tracking-tight">
                {useCase.title}
              </h3>

              {/* Hook */}
              <p className="text-lg md:text-xl text-zinc-400 mb-4 font-medium">
                {useCase.hook}
              </p>

              {/* Pain point */}
              <p className="text-zinc-500 mb-6 leading-relaxed text-sm md:text-base">
                {useCase.pain}
              </p>

              {/* Command */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0c0c0e] border border-zinc-800">
                <span className="text-orange-500 font-mono text-sm">$</span>
                <code className="text-sm text-zinc-300 font-mono">
                  {useCase.command}
                </code>
              </div>
            </div>

            {/* Right Column - Features (2 cols) */}
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {useCase.features.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    className="flex items-start gap-3"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: 12 }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            opacity: isActive ? 1 : 0.4,
                            x: isActive ? 0 : 8,
                          }
                    }
                    transition={{
                      delay: isActive ? idx * 0.08 : 0,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: useCase.accentLight }}
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={useCase.accent}
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-zinc-400 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <a
                      href="/docs/cli/getting-started/"
                      className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: useCase.accent }}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function UseCasesScrollCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to active index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (prefersReducedMotion) return;

    const newIndex = Math.min(
      useCases.length - 1,
      Math.floor(latest * useCases.length),
    );

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  // Calculate scroll height - each card gets viewport height worth of scroll
  const scrollHeight = useCases.length * 100;

  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
    if (containerRef.current) {
      const scrollTarget =
        (index / useCases.length) * containerRef.current.scrollHeight;
      window.scrollTo({
        top: containerRef.current.offsetTop + scrollTarget,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-[#09090b]">
      {/* Section header - outside scroll container */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Use Cases
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-100 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Built for Every Team
          </motion.h2>

          <motion.p
            className="text-lg text-zinc-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From security audits to compliance documentation, ArtemisKit adapts
            to your workflow.
          </motion.p>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${scrollHeight}vh` }}
      >
        {/* Sticky container */}
        <div className="sticky top-0 h-screen flex items-center py-16 overflow-hidden">
          <div className="w-full max-w-5xl mx-auto px-4">
            {/* Navigation pills */}
            <div className="flex justify-center gap-2 mb-8">
              {useCases.map((useCase, index) => (
                <button
                  key={useCase.id}
                  onClick={() => handleIndicatorClick(index)}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      activeIndex === index
                        ? "text-zinc-100"
                        : "text-zinc-600 hover:text-zinc-400"
                    }
                  `}
                >
                  {activeIndex === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full border"
                      style={{
                        backgroundColor: useCase.accentLight,
                        borderColor: `${useCase.accent}30`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {useCase.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Cards container */}
            <div className="relative mx-auto" style={{ height: "420px" }}>
              {useCases.map((useCase, index) => (
                <Card
                  key={useCase.id}
                  useCase={useCase}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={useCases.length}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Scroll indicator */}
            <motion.div
              className="flex justify-center mt-8"
              animate={{
                opacity: activeIndex < useCases.length - 1 ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-600 tracking-wide">
                  Scroll to explore
                </span>
                <motion.div
                  className="w-5 h-8 rounded-full border border-zinc-800 flex justify-center pt-1.5"
                  initial={false}
                >
                  <motion.div
                    className="w-1 h-1.5 rounded-full bg-zinc-600"
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
