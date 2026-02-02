import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  type:
    | "command"
    | "blank"
    | "header"
    | "info"
    | "test"
    | "result"
    | "output"
    | "warning"
    | "critical"
    | "metric"
    | "divider"
    | "success";
  text: string;
  result?: "PASS" | "FAIL";
}

// Demo sequence showing all three ArtemisKit capabilities
const DEMO_SEQUENCES: TerminalLine[][] = [
  // Sequence 1: Security Red-teaming
  [
    { type: "command", text: "artemiskit redteam config.yaml" },
    { type: "blank", text: "" },
    { type: "header", text: "ArtemisKit v0.1.0 — Security Red-Team" },
    { type: "blank", text: "" },
    { type: "info", text: "Target: customer-support-bot" },
    { type: "info", text: "Attack vectors: 15 enabled" },
    { type: "blank", text: "" },
    { type: "test", text: "Prompt Injection (direct)", result: "FAIL" },
    { type: "test", text: "Prompt Injection (indirect)", result: "FAIL" },
    { type: "test", text: "Jailbreak (roleplay)", result: "PASS" },
    { type: "test", text: "Jailbreak (DAN)", result: "FAIL" },
    { type: "test", text: "Data Extraction (PII)", result: "PASS" },
    { type: "test", text: "Role Spoofing", result: "FAIL" },
    { type: "blank", text: "" },
    { type: "critical", text: "✗ 4 vulnerabilities detected" },
    { type: "warning", text: "⚠ Prompt injection via user input" },
    { type: "blank", text: "" },
    { type: "result", text: "Security Score: 42/100" },
    { type: "output", text: "→ artemis-output/redteam-report.html" },
  ],
  // Sequence 2: Quality Evaluation
  [
    { type: "command", text: "artemiskit run scenarios/" },
    { type: "blank", text: "" },
    { type: "header", text: "ArtemisKit v0.1.0 — Quality Evaluation" },
    { type: "blank", text: "" },
    { type: "info", text: "Provider: openai (gpt-4o)" },
    { type: "info", text: "Scenarios: 24 loaded" },
    { type: "blank", text: "" },
    { type: "test", text: "Semantic similarity check", result: "PASS" },
    { type: "test", text: "JSON schema validation", result: "PASS" },
    { type: "test", text: "Regex pattern matching", result: "PASS" },
    { type: "test", text: "LLM-as-judge evaluation", result: "PASS" },
    { type: "test", text: "Hallucination detection", result: "FAIL" },
    { type: "test", text: "Toxicity filter", result: "PASS" },
    { type: "blank", text: "" },
    { type: "success", text: "✓ 22/24 tests passed (91.6%)" },
    { type: "warning", text: "⚠ 2 hallucinations in RAG responses" },
    { type: "blank", text: "" },
    { type: "output", text: "→ artemis-output/eval-report.html" },
  ],
  // Sequence 3: Stress Testing
  [
    { type: "command", text: "artemiskit stress --rps 100 --duration 60s" },
    { type: "blank", text: "" },
    { type: "header", text: "ArtemisKit v0.1.0 — Stress Test" },
    { type: "blank", text: "" },
    { type: "info", text: "Target: api.example.com/v1/chat" },
    { type: "info", text: "Load: 100 requests/second for 60s" },
    { type: "blank", text: "" },
    { type: "divider", text: "───────────────────────────────────────" },
    { type: "blank", text: "" },
    { type: "metric", text: "p50     245ms    ████████░░░░░░░░" },
    { type: "metric", text: "p95     892ms    ██████████████░░" },
    { type: "metric", text: "p99   1,247ms    ████████████████" },
    { type: "blank", text: "" },
    { type: "info", text: "Throughput:   94.2 req/s" },
    { type: "info", text: "Success:      99.1%" },
    { type: "info", text: "Cost:         $12.40/1k req" },
    { type: "blank", text: "" },
    { type: "success", text: "✓ Stress test completed" },
    { type: "output", text: "→ artemis-output/stress-report.html" },
  ],
];

// Calculate the max number of lines across all sequences for consistent height
const MAX_LINES = Math.max(...DEMO_SEQUENCES.map((seq) => seq.length));

const sequenceConfig = [
  {
    label: "Security",
    icon: "🛡️",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    label: "Quality",
    icon: "✓",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Stress",
    icon: "⚡",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

function TerminalLineComponent({
  line,
  index,
}: {
  line: TerminalLine;
  index: number;
}) {
  const baseDelay = index * 0.02;

  const variants = {
    hidden: { opacity: 0, x: -4 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.15,
        delay: baseDelay,
        ease: "easeOut",
      },
    },
  };

  const content = (() => {
    switch (line.type) {
      case "blank":
        return <div className="h-[1.4em]" />;

      case "command":
        return (
          <div className="flex items-center group">
            <span className="text-orange-500 select-none">❯</span>
            <span className="ml-2 text-zinc-100 font-medium">{line.text}</span>
          </div>
        );

      case "header":
        return (
          <div className="text-orange-400/90 font-semibold tracking-tight">
            {line.text}
          </div>
        );

      case "info":
        return <div className="text-zinc-500">{line.text}</div>;

      case "divider":
        return <div className="text-zinc-700/50">{line.text}</div>;

      case "metric":
        return (
          <div className="text-cyan-400/90 font-mono tracking-tight">
            {line.text}
          </div>
        );

      case "test": {
        const dots = "·".repeat(Math.max(0, 32 - line.text.length));
        const isPassed = line.result === "PASS";
        return (
          <div className="flex items-center gap-1">
            <span className="text-zinc-400">{line.text}</span>
            <span className="text-zinc-700 tracking-tighter">{dots}</span>
            <span
              className={`font-medium ${
                isPassed ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPassed ? "PASS" : "FAIL"}
            </span>
          </div>
        );
      }

      case "critical":
        return (
          <div className="text-red-400 font-medium flex items-center gap-1.5">
            {line.text}
          </div>
        );

      case "warning":
        return (
          <div className="text-amber-400/90 flex items-center gap-1.5">
            {line.text}
          </div>
        );

      case "success":
        return (
          <div className="text-emerald-400 font-medium flex items-center gap-1.5">
            {line.text}
          </div>
        );

      case "result":
        return <div className="text-zinc-300 font-medium">{line.text}</div>;

      case "output":
        return (
          <div className="text-zinc-500 flex items-center gap-1">
            {line.text}
          </div>
        );

      default:
        return <div className="text-zinc-400">{line.text}</div>;
    }
  })();

  if (line.type === "blank") {
    return content;
  }

  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      {content}
    </motion.div>
  );
}

export default function AnimatedTerminal() {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStarted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentContent = DEMO_SEQUENCES[currentSequence];
  const currentConfig = sequenceConfig[currentSequence];

  useEffect(() => {
    // Reset visible count when sequence changes
    setVisibleCount(0);
    hasStarted.current = false;
  }, [currentSequence]);

  useEffect(() => {
    // Prevent double execution in strict mode
    if (hasStarted.current) return;
    hasStarted.current = true;

    const animateLine = (index: number) => {
      if (index >= currentContent.length) {
        // Animation complete for this sequence, pause then move to next
        pauseTimeoutRef.current = setTimeout(() => {
          setCurrentSequence((prev) => (prev + 1) % DEMO_SEQUENCES.length);
        }, 4000); // 4 second pause between sequences
        return;
      }

      setVisibleCount(index + 1);

      // Determine delay for next line
      const currentLine = currentContent[index];
      let delay = 80;
      if (currentLine.type === "blank") delay = 40;
      if (currentLine.type === "test") delay = 220;
      if (currentLine.type === "command") delay = 150;
      if (currentLine.type === "result" || currentLine.type === "success")
        delay = 100;
      if (currentLine.type === "metric") delay = 180;
      if (currentLine.type === "critical" || currentLine.type === "warning")
        delay = 200;

      timeoutRef.current = setTimeout(() => {
        animateLine(index + 1);
      }, delay);
    };

    // Start animation after mount
    const startDelay = setTimeout(() => {
      animateLine(0);
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [currentContent, currentSequence]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const isComplete = visibleCount >= currentContent.length;

  const handleSequenceChange = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    hasStarted.current = false;
    setCurrentSequence(idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Terminal Container */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-zinc-700/50 via-zinc-800/50 to-zinc-900/50 rounded-xl" />

        {/* Inner container */}
        <div className="relative bg-[#0c0c0e] rounded-xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              {/* Window controls */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700 hover:bg-red-500/80 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-zinc-700 hover:bg-yellow-500/80 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-zinc-700 hover:bg-green-500/80 transition-colors cursor-pointer" />
              </div>

              {/* Terminal title */}
              <div className="flex items-center gap-2 ml-2">
                <span className="text-zinc-600 text-xs font-medium tracking-wide uppercase">
                  ArtemisKit
                </span>
              </div>
            </div>

            {/* Sequence Indicators */}
            <div className="flex items-center gap-1">
              {sequenceConfig.map((config, idx) => (
                <button
                  key={config.label}
                  onClick={() => handleSequenceChange(idx)}
                  className={`
                    px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200
                    ${
                      currentSequence === idx
                        ? `${config.bg} ${config.color} ${config.border} border`
                        : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Body */}
          <div
            className="p-4 md:p-5 font-mono text-[13px] leading-[1.6] overflow-x-auto"
            style={{
              minHeight: `calc(${MAX_LINES + 2} * 1.6em + 3rem)`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSequence}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {currentContent.slice(0, visibleCount).map((line, index) => (
                  <TerminalLineComponent
                    key={`${currentSequence}-${index}`}
                    line={line}
                    index={index}
                  />
                ))}

                {/* Blinking cursor after completion */}
                {isComplete && (
                  <motion.div
                    className="flex items-center mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-orange-500 select-none">❯</span>
                    <motion.span
                      className="ml-2 w-2 h-[18px] bg-orange-500/80 rounded-[1px]"
                      animate={{ opacity: cursorVisible ? 1 : 0 }}
                      transition={{ duration: 0.1 }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0c0c0e] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {DEMO_SEQUENCES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSequenceChange(idx)}
            className={`
              h-1 rounded-full transition-all duration-300
              ${
                currentSequence === idx
                  ? "w-6 bg-orange-500"
                  : "w-1.5 bg-zinc-700 hover:bg-zinc-600"
              }
            `}
            aria-label={`Go to ${sequenceConfig[idx].label} demo`}
          />
        ))}
      </div>
    </div>
  );
}
