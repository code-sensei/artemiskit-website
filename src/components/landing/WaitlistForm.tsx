import { useState } from 'react';
import { joinWaitlist } from '../../lib/supabase';

const companySizes = [
  { value: '', label: 'Team size' },
  { value: 'just-me', label: 'Just me' },
  { value: '2-10', label: '2-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '200+', label: '200+' },
];

const useCases = [
  { value: '', label: 'Primary use case' },
  { value: 'quality-assurance', label: 'Quality Assurance' },
  { value: 'security-testing', label: 'Security Testing' },
  { value: 'performance-testing', label: 'Performance Testing' },
  { value: 'research-benchmarking', label: 'Research & Benchmarking' },
  { value: 'all', label: 'All of the above' },
];

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [useCase, setUseCase] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setFormState('loading');
    setErrorMessage('');

    const result = await joinWaitlist({
      email,
      company_size: companySize || undefined,
      use_case: useCase || undefined,
    });

    if (result.success) {
      setFormState('success');
      setEmail('');
      setCompanySize('');
      setUseCase('');
    } else {
      setFormState('error');
      setErrorMessage(result.error || 'Something went wrong');
    }
  };

  if (formState === 'success') {
    return (
      <div className="text-center p-8 rounded-2xl bg-green-500/10 border border-green-500/30">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-stone-50 mb-2">You're on the list!</h3>
        <p className="text-stone-400">
          We'll email you when ArtemisKit Cloud is ready. No spam, promise.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          required
          disabled={formState === 'loading'}
          className="input"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <select
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          disabled={formState === 'loading'}
          className="select"
        >
          {companySizes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          disabled={formState === 'loading'}
          className="select"
        >
          {useCases.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {formState === 'error' && errorMessage && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === 'loading' || !email}
        className="btn btn-primary w-full justify-center"
      >
        {formState === 'loading' ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Joining...
          </>
        ) : (
          'Join Waitlist'
        )}
      </button>

      <p className="text-xs text-stone-600 text-center">
        We'll only email you about ArtemisKit Cloud launch. No spam.
      </p>
    </form>
  );
}
