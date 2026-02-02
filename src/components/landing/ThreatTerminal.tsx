import { useState, useEffect, useRef } from "react";

/**
 * ThreatTerminal - Animated terminal showing attack detection
 *
 * Aligned with USP Analysis:
 * - Lead with fear/security messaging
 * - Show ArtemisKit detecting and blocking threats
 * - Visual proof of security capabilities
 */

interface TerminalLine {
  type:
    | "prompt"
    | "command"
    | "output"
    | "success"
    | "error"
    | "warning"
    | "info";
  text: string;
  delay?: number;
}

const attackSequence: TerminalLine[] = [
  { type: "prompt", text: "$ ", delay: 0 },
  { type: "command", text: "akit redteam chatbot.yaml --count 10", delay: 100 },
  { type: "output", text: "", delay: 600 },
  { type: "info", text: "◆ ArtemisKit Red Team v1.2.0", delay: 100 },
  { type: "output", text: "  Scenario: chatbot.yaml", delay: 100 },
  { type: "output", text: "  Running 6 mutation types...", delay: 200 },
  { type: "output", text: "", delay: 800 },
  { type: "warning", text: "⚠ THREAT DETECTED", delay: 100 },
  { type: "error", text: "  → Prompt Injection: VULNERABLE", delay: 150 },
  {
    type: "output",
    text: '    Payload: "Ignore previous instructions..."',
    delay: 100,
  },
  { type: "output", text: "    Severity: CRITICAL (CVSS 9.1)", delay: 100 },
  { type: "output", text: "", delay: 400 },
  { type: "warning", text: "⚠ THREAT DETECTED", delay: 100 },
  { type: "error", text: "  → Jailbreak Attempt: VULNERABLE", delay: 150 },
  { type: "output", text: '    Payload: "DAN mode enabled..."', delay: 100 },
  { type: "output", text: "    Severity: HIGH (CVSS 7.5)", delay: 100 },
  { type: "output", text: "", delay: 400 },
  { type: "success", text: "✓ Data Extraction: BLOCKED", delay: 150 },
  { type: "success", text: "✓ Role Spoofing: BLOCKED", delay: 100 },
  { type: "success", text: "✓ Encoding Attack: BLOCKED", delay: 100 },
  { type: "output", text: "", delay: 300 },
  { type: "output", text: "─────────────────────────────────────", delay: 100 },
  { type: "info", text: "◆ Results: 2 vulnerabilities, 3 blocked", delay: 100 },
  {
    type: "output",
    text: "  Report: ./artemis-output/security.html",
    delay: 100,
  },
  { type: "output", text: "", delay: 200 },
  { type: "prompt", text: "$ ", delay: 100 },
];

export default function ThreatTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= attackSequence.length) {
      setIsTyping(false);
      // Restart animation after pause
      const restartTimeout = setTimeout(() => {
        setLines([]);
        setCurrentIndex(0);
        setIsTyping(true);
      }, 5000);
      return () => clearTimeout(restartTimeout);
    }

    const currentLine = attackSequence[currentIndex];
    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, currentLine]);
      setCurrentIndex((prev) => prev + 1);

      // Auto-scroll
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, currentLine.delay || 100);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const getLineClass = (type: TerminalLine["type"]) => {
    switch (type) {
      case "prompt":
        return "text-orange-400";
      case "command":
        return "text-zinc-100";
      case "success":
        return "text-emerald-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-amber-400 font-semibold";
      case "info":
        return "text-orange-400";
      default:
        return "text-zinc-500";
    }
  };

  return (
    <div className="terminal rounded-2xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] shadow-2xl shadow-black/20">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3.5 bg-[var(--theme-bg-tertiary)] border-b border-[var(--theme-border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-medium text-[var(--theme-text-muted)] font-mono">
            artemiskit — security scan
          </span>
        </div>
        <div className="w-16" /> {/* Spacer for symmetry */}
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="p-5 font-mono text-[13px] leading-relaxed h-[340px] overflow-y-auto scrollbar-hide"
      >
        {lines.map((line, index) => (
          <div key={index} className="flex">
            <span className={getLineClass(line.type)}>{line.text}</span>
            {/* Show cursor on last prompt line */}
            {line.type === "prompt" &&
              index === lines.length - 1 &&
              isTyping && (
                <span className="inline-block w-2 h-[18px] bg-orange-400 ml-0.5 animate-blink" />
              )}
          </div>
        ))}

        {/* Blinking cursor when not typing */}
        {!isTyping && lines.length > 0 && (
          <div className="flex items-center mt-1">
            <span className="text-orange-400">$ </span>
            <span className="inline-block w-2 h-[18px] bg-orange-400 ml-0.5 animate-blink" />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--theme-bg-tertiary)] border-t border-[var(--theme-border)] text-[11px] font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            2 Critical
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />3
            Blocked
          </span>
        </div>
        <span className="text-[var(--theme-text-muted)]">6 mutation types</span>
      </div>
    </div>
  );
}
