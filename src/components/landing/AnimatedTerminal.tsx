import { useState, useEffect, useRef } from "react";

interface TerminalLine {
  type: "command" | "blank" | "header" | "info" | "test" | "result" | "output";
  text: string;
  result?: "PASS" | "FAIL";
}

const TERMINAL_CONTENT: TerminalLine[] = [
  { type: "command", text: "akit run scenarios/qa-bot.yaml" },
  { type: "blank", text: "" },
  { type: "header", text: "ArtemisKit v0.1.0 — LLM Evaluation Toolkit" },
  { type: "blank", text: "" },
  { type: "info", text: "Running: qa-bot-evaluation" },
  { type: "info", text: "Provider: openai (gpt-4)" },
  { type: "info", text: "Seed: 42" },
  { type: "blank", text: "" },
  { type: "test", text: "Scenario 1/5: Basic Q&A", result: "PASS" },
  { type: "test", text: "Scenario 2/5: Edge Cases", result: "PASS" },
  { type: "test", text: "Scenario 3/5: Context Handling", result: "PASS" },
  { type: "test", text: "Scenario 4/5: Error Recovery", result: "PASS" },
  { type: "test", text: "Scenario 5/5: Performance Check", result: "PASS" },
  { type: "blank", text: "" },
  { type: "result", text: "Results: 5/5 passed (100%)" },
  { type: "output", text: "Report: artemis-output/report-2026-01-15.html" },
];

function TerminalLineComponent({ line }: { line: TerminalLine }) {
  switch (line.type) {
    case "blank":
      return <div className="h-4" />;

    case "command":
      return (
        <div className="flex items-center">
          <span className="text-orange-500">$</span>
          <span className="ml-2 text-stone-100">{line.text}</span>
        </div>
      );

    case "header":
      return <div className="text-orange-400 font-medium">{line.text}</div>;

    case "info":
      return <div className="text-stone-500">{line.text}</div>;

    case "test": {
      const dots = ".".repeat(Math.max(0, 40 - line.text.length));
      return (
        <div className="flex items-center gap-2">
          <span className="text-stone-300">{line.text}</span>
          <span className="text-stone-700">{dots}</span>
          <span
            className={
              line.result === "PASS" ? "text-green-500" : "text-red-500"
            }
          >
            {line.result}
          </span>
        </div>
      );
    }

    case "result":
      return <div className="text-green-400 font-medium">{line.text}</div>;

    case "output":
      return <div className="text-stone-400">{line.text}</div>;

    default:
      return <div className="text-stone-300">{line.text}</div>;
  }
}

export default function AnimatedTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStarted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Prevent double execution in strict mode
    if (hasStarted.current) return;
    hasStarted.current = true;

    const animateLine = (index: number) => {
      if (index >= TERMINAL_CONTENT.length) {
        return; // Animation complete, stop here
      }

      setVisibleCount(index + 1);

      // Determine delay for next line
      const currentLine = TERMINAL_CONTENT[index];
      let delay = 120;
      if (currentLine.type === "blank") delay = 60;
      if (currentLine.type === "test") delay = 300;
      if (currentLine.type === "command") delay = 200;
      if (currentLine.type === "result") delay = 150;

      timeoutRef.current = setTimeout(() => {
        animateLine(index + 1);
      }, delay);
    };

    // Start animation after mount
    const startDelay = setTimeout(() => {
      animateLine(0);
    }, 400);

    return () => {
      clearTimeout(startDelay);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const isComplete = visibleCount >= TERMINAL_CONTENT.length;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-stone-800 bg-stone-950 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 bg-stone-900/80 border-b border-stone-800">
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-stone-500 text-xs md:text-sm">Terminal</span>
      </div>

      {/* Terminal Body */}
      <div className="p-3 md:p-5 font-mono text-xs md:text-sm leading-relaxed min-h-[320px] md:min-h-[420px] overflow-x-auto">
        {TERMINAL_CONTENT.slice(0, visibleCount).map((line, index) => (
          <TerminalLineComponent key={index} line={line} />
        ))}

        {/* Blinking cursor after completion */}
        {isComplete && (
          <div className="flex items-center mt-3">
            <span className="text-orange-500">$</span>
            <span
              className={`ml-2 w-2 h-4 md:h-5 bg-orange-500 ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
