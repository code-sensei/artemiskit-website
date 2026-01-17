import { useState, useEffect } from "react";

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface Stats {
  stars: number;
  forks: number;
  issues: number;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function HeroGitHubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/code-sensei/artemiskit",
        );
        if (response.ok) {
          const data: GitHubRepo = await response.json();
          setStats({
            stars: data.stargazers_count,
            forks: data.forks_count,
            issues: data.open_issues_count,
          });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const displayStats = stats || { stars: 0, forks: 0, issues: 0 };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
      <a
        href="https://github.com/code-sensei/artemiskit"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-stone-400 hover:text-primary-400 transition-colors group"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        {loading ? (
          <span className="inline-block h-5 w-8 rounded bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        ) : (
          <span className="font-semibold text-stone-200 group-hover:text-primary-400 transition-colors">
            {formatNumber(displayStats.stars)}
          </span>
        )}
        <span className="text-sm">stars</span>
      </a>

      <a
        href="https://github.com/code-sensei/artemiskit/fork"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-stone-400 hover:text-primary-400 transition-colors group"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
          <path d="M12 12v3" />
        </svg>
        {loading ? (
          <span className="inline-block h-5 w-8 rounded bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        ) : (
          <span className="font-semibold text-stone-200 group-hover:text-primary-400 transition-colors">
            {formatNumber(displayStats.forks)}
          </span>
        )}
        <span className="text-sm">forks</span>
      </a>

      <div className="flex items-center gap-2 text-stone-500">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-sm">Apache-2.0</span>
      </div>
    </div>
  );
}
