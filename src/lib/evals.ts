/**
 * Public evaluation data for the leaderboard, benchmark and report pages.
 *
 * Each file in src/data/evaluations is one published evaluation: aggregate results only, exported
 * from the evaluation workspace. Pages read it at build time, so every number on the site is
 * server-rendered and traceable to a single dataset file.
 */
export type Condition = 'thinking-on' | 'thinking-off';

export interface Model { id: string; name: string; provider: string; providerName: string; access: string }
export interface Benchmark {
  id: string; name: string; short: string; cases: number; packCases?: number; groups?: number; tests: string;
  graders: string; status: 'stable' | 'draft-unreviewed'; availability: string; runsPerCase: number | string;
  conditions: Condition[];
}
export interface Rate { passed: number | null; total: number; rate: number | null }
export interface Result extends Rate {
  benchmark: string; model: string; condition: Condition; note?: string;
  groups?: Array<Rate & { id: string; label: string }>;
}
export interface Operational {
  model: string; condition: Condition; requests: number; p50Ms: number; p95Ms: number;
  meanCompletionTokens: number; meanReasoningTokens: number; firstTryTransportErrorRate: number;
  reasoningInContent: number;
}
export interface Fidelity { model: string; condition: Condition; value: string; channel: string; trials: number; exact: number; masked: number }
export interface Finding { id: string; severity: 'high' | 'medium'; title: string; summary: string; baseline: string; candidate: string }
export interface Evaluation {
  schemaVersion: 1;
  evaluation: {
    id: string; reportSlug: string; title: string; published: string; testedOn: string; subject: string;
    baseline: string; settings: string; requests: number; pdf: string; limitations: string[];
  };
  models: Model[]; benchmarks: Benchmark[]; results: Result[]; operational: Operational[];
  contactDataFidelity: Fidelity[]; confirmations: Array<{ case: string; label: string; condition: Condition; baseline: Rate; candidate: Rate }>;
  findings: Finding[]; pairedPackComparison: { better: number; worse: number; tie: number };
  packOverall: { cases: number; rates: Record<string, number> };
}

const files = import.meta.glob<Evaluation>('../data/evaluations/*.json', { eager: true, import: 'default' });

/** Every published evaluation, newest first. */
export const evaluations: Evaluation[] = Object.values(files).sort((a, b) =>
  b.evaluation.published.localeCompare(a.evaluation.published)
);

export const models: Model[] = dedupe(evaluations.flatMap((e) => e.models));
export const benchmarks: Benchmark[] = dedupe(evaluations.flatMap((e) => e.benchmarks));
export const results: Result[] = evaluations.flatMap((e) => e.results);
export const operational: Operational[] = evaluations.flatMap((e) => e.operational);

function dedupe<T extends { id: string }>(items: T[]): T[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

/** Series slot per model, assigned in publication order so a model keeps its colour everywhere. */
export function seriesSlot(modelId: string): number {
  return (models.findIndex((m) => m.id === modelId) % 3) + 1;
}

export function modelName(modelId: string): string {
  return models.find((m) => m.id === modelId)?.name ?? modelId;
}

export function result(benchmark: string, model: string, condition: Condition): Result | undefined {
  return results.find((r) => r.benchmark === benchmark && r.model === model && r.condition === condition);
}

export function ops(model: string, condition: Condition): Operational | undefined {
  return operational.find((o) => o.model === model && o.condition === condition);
}

export const pct = (value: number | null | undefined, digits = 1) =>
  value == null ? '–' : `${(value * 100).toFixed(digits)}%`;
export const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
export const conditionLabel = (c: Condition) => (c === 'thinking-on' ? 'Thinking on' : 'Thinking off');
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
