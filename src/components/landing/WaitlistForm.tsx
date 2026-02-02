import { useState } from "react";
import { joinWaitlist, type WaitlistType } from "../../lib/supabase";

const companySizes = [
  { value: "", label: "Team size" },
  { value: "just-me", label: "Just me" },
  { value: "2-10", label: "2-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "200+", label: "200+" },
];

const cloudUseCases = [
  { value: "", label: "Primary use case" },
  { value: "quality-assurance", label: "Quality Assurance" },
  { value: "security-testing", label: "Security Testing" },
  { value: "performance-testing", label: "Performance Testing" },
  { value: "research-benchmarking", label: "Research & Benchmarking" },
  { value: "all", label: "All of the above" },
];

const apiUseCases = [
  { value: "", label: "Integration type" },
  { value: "test-framework", label: "Test Framework (Jest, Vitest, etc.)" },
  { value: "ci-cd", label: "CI/CD Pipeline" },
  { value: "custom-tooling", label: "Custom Tooling" },
  { value: "sdk-integration", label: "SDK / Library Integration" },
  { value: "other", label: "Other" },
];

type FormState = "idle" | "loading" | "success" | "error";

interface WaitlistFormProps {
  type: WaitlistType;
  successTitle?: string;
  successMessage?: string;
}

export default function WaitlistForm({
  type,
  successTitle = "You're on the list!",
  successMessage = "We'll email you when it's ready.",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const useCases = type === "cloud" ? cloudUseCases : apiUseCases;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setFormState("loading");
    setErrorMessage("");

    const result = await joinWaitlist({
      email,
      waitlist_type: type,
      company_size: companySize || undefined,
      use_case: useCase || undefined,
    });

    if (result.success) {
      setFormState("success");
      setEmail("");
      setCompanySize("");
      setUseCase("");
    } else {
      setFormState("error");
      setErrorMessage(result.error || "Something went wrong");
    }
  };

  if (formState === "success") {
    return (
      <div className="text-center py-8 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-1">
          {successTitle}
        </h3>
        <p className="text-sm text-[var(--theme-text-tertiary)]">
          {successMessage}
        </p>
      </div>
    );
  }

  const inputClasses = `
    w-full px-4 py-3 rounded-xl
    bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)]
    text-[var(--theme-text-primary)] text-sm
    placeholder:text-[var(--theme-text-muted)]
    focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-muted)]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  const selectClasses = `
    w-full px-4 py-3 rounded-xl
    bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)]
    text-[var(--theme-text-tertiary)] text-sm
    focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-muted)]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    appearance-none cursor-pointer
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          required
          disabled={formState === "loading"}
          className={inputClasses}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="relative">
          <select
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            disabled={formState === "loading"}
            className={selectClasses}
          >
            {companySizes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)] pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="relative">
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            disabled={formState === "loading"}
            className={selectClasses}
          >
            {useCases.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)] pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {formState === "error" && errorMessage && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "loading" || !email}
        className="
          w-full flex items-center justify-center gap-2
          px-5 py-3.5 rounded-xl
          bg-gradient-to-b from-orange-500 to-orange-600
          text-white text-sm font-semibold
          shadow-lg shadow-orange-500/25
          hover:from-orange-400 hover:to-orange-500
          hover:shadow-orange-500/35
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        {formState === "loading" ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Joining...</span>
          </>
        ) : (
          "Join Waitlist"
        )}
      </button>

      <p className="text-xs text-[var(--theme-text-muted)] text-center">
        {type === "cloud"
          ? "We'll only email you about ArtemisKit Cloud launch."
          : "We'll notify you when the programmatic API is available."}
      </p>
    </form>
  );
}
