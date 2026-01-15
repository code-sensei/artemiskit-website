import { useState, useEffect } from 'react';

const terminalLines = [
  { type: 'command', text: '$ akit run scenarios/qa-bot.yaml' },
  { type: 'blank', text: '' },
  { type: 'header', text: 'ArtemisKit v0.1.0 — LLM Evaluation Toolkit' },
  { type: 'blank', text: '' },
  { type: 'info', text: 'Running: qa-bot-evaluation' },
  { type: 'info', text: 'Provider: openai (gpt-4)' },
  { type: 'info', text: 'Seed: 42' },
  { type: 'blank', text: '' },
  { type: 'test', text: 'Scenario 1/5: Basic Q&A', result: 'PASS' },
  { type: 'test', text: 'Scenario 2/5: Edge Cases', result: 'PASS' },
  { type: 'test', text: 'Scenario 3/5: Context Handling', result: 'PASS' },
  { type: 'test', text: 'Scenario 4/5: Error Recovery', result: 'PASS' },
  { type: 'test', text: 'Scenario 5/5: Performance Check', result: 'PASS' },
  { type: 'blank', text: '' },
  { type: 'result', text: 'Results: 5/5 passed (100%)' },
  { type: 'output', text: 'Report: artemis-output/report-2026-01-15.html' },
];

interface TerminalLineProps {
  line: typeof terminalLines[number];
  isVisible: boolean;
}

function TerminalLine({ line, isVisible }: TerminalLineProps) {
  if (!isVisible) return null;

  if (line.type === 'blank') {
    return <div className="h-5" />;
  }

  if (line.type === 'command') {
    return (
      <div className="flex items-center">
        <span className="text-primary-500">$</span>
        <span className="ml-2 text-stone-100">{line.text.slice(2)}</span>
      </div>
    );
  }

  if (line.type === 'header') {
    return <div className="text-primary-400 font-medium">{line.text}</div>;
  }

  if (line.type === 'info') {
    return <div className="text-stone-500">{line.text}</div>;
  }

  if (line.type === 'test') {
    const dots = '.'.repeat(Math.max(0, 40 - line.text.length));
    return (
      <div className="flex items-center gap-2">
        <span className="text-stone-300">{line.text}</span>
        <span className="text-stone-600">{dots}</span>
        <span className={line.result === 'PASS' ? 'text-green-500' : 'text-red-500'}>
          {line.result}
        </span>
      </div>
    );
  }

  if (line.type === 'result') {
    return (
      <div className="text-green-400 font-medium">{line.text}</div>
    );
  }

  if (line.type === 'output') {
    return <div className="text-stone-400">{line.text}</div>;
  }

  return <div className="text-stone-300">{line.text}</div>;
}

export default function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const delay = terminalLines[visibleLines]?.type === 'blank' ? 100 :
                    terminalLines[visibleLines]?.type === 'test' ? 400 : 200;

      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Reset after completion
      const resetTimer = setTimeout(() => {
        setVisibleLines(0);
      }, 4000);

      return () => clearTimeout(resetTimer);
    }
  }, [visibleLines]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="terminal w-full max-w-2xl mx-auto shadow-2xl">
      {/* Terminal Header */}
      <div className="terminal-header">
        <span className="code-block-dot code-block-dot-red" />
        <span className="code-block-dot code-block-dot-yellow" />
        <span className="code-block-dot code-block-dot-green" />
        <span className="ml-3 text-stone-500 text-sm">Terminal</span>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body font-mono text-sm leading-relaxed">
        {terminalLines.map((line, index) => (
          <TerminalLine
            key={index}
            line={line}
            isVisible={index < visibleLines}
          />
        ))}

        {/* Cursor */}
        {visibleLines >= terminalLines.length && (
          <div className="flex items-center mt-2">
            <span className="text-primary-500">$</span>
            <span
              className={`ml-2 w-2 h-5 bg-primary-500 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 0.1s' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
