import { useState } from 'react';

const useCases = [
  {
    id: 'qa',
    label: 'QA Engineers',
    title: 'Quality Assurance',
    description: 'Catch regressions before they reach production. Run comprehensive test suites on every deployment.',
    features: [
      'Pre-deploy validation',
      'Regression detection',
      'Automated test suites',
      'Pass/fail CI gates',
    ],
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 'security',
    label: 'Security Teams',
    title: 'Security Auditing',
    description: 'Identify vulnerabilities before attackers do. Comprehensive red team testing for LLM applications.',
    features: [
      'Prompt injection detection',
      'Jailbreak resistance testing',
      'Data leakage prevention',
      'Vulnerability reports',
    ],
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'research',
    label: 'Research Teams',
    title: 'Research & Experimentation',
    description: 'Systematically evaluate model performance across benchmarks with reproducible results.',
    features: [
      'Model comparison studies',
      'Benchmark suite execution',
      'Reproducible pipelines',
      'Statistical analysis',
    ],
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 'platform',
    label: 'Platform Teams',
    title: 'Performance Engineering',
    description: 'Understand latency, throughput, and failure modes under realistic load conditions.',
    features: [
      'Capacity planning',
      'SLA validation',
      'Bottleneck identification',
      'Cost optimization',
    ],
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'devops',
    label: 'DevOps',
    title: 'CI/CD Integration',
    description: 'Automate evaluation as part of your pipeline. Fail builds on quality regressions.',
    features: [
      'GitHub Actions ready',
      'Jenkins/GitLab CI support',
      'Exit codes for automation',
      'Artifact storage',
    ],
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function UseCaseTabs() {
  const [activeTab, setActiveTab] = useState('qa');
  const activeUseCase = useCases.find((uc) => uc.id === activeTab) || useCases[0];

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {useCases.map((useCase) => (
          <button
            key={useCase.id}
            onClick={() => setActiveTab(useCase.id)}
            className={`
              px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === useCase.id
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-stone-800/50 text-stone-400 border border-stone-700 hover:border-stone-600 hover:text-stone-300'
              }
            `}
          >
            {useCase.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left - Icon & Title */}
        <div className="text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mb-6 mx-auto md:mx-0 text-primary-500">
            {activeUseCase.icon}
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-stone-50 mb-4">
            {activeUseCase.title}
          </h3>
          <p className="text-lg text-stone-400 mb-6">
            {activeUseCase.description}
          </p>
        </div>

        {/* Right - Features */}
        <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
          <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            Key Capabilities
          </h4>
          <ul className="space-y-4">
            {activeUseCase.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-stone-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
