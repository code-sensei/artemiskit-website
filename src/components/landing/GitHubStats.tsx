import { useState, useEffect } from "react";

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
}

interface Stats {
  stars: number;
  forks: number;
  watchers: number;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function GitHubStats() {
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
            watchers: data.subscribers_count,
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

  const displayStats = stats || { stars: 0, forks: 0, watchers: 0 };

  const statItems = [
    {
      label: "Stars",
      value: displayStats.stars,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: "Forks",
      value: displayStats.forks,
      icon: (
        <svg
          className="w-4 h-4"
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
      ),
    },
    {
      label: "Watchers",
      value: displayStats.watchers,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60"
        >
          <span className={`text-orange-400 ${loading ? "opacity-50" : ""}`}>
            {item.icon}
          </span>
          <div>
            {loading ? (
              <div className="space-y-1">
                <div className="h-6 w-10 rounded bg-zinc-800 animate-pulse" />
                <div className="h-3 w-14 rounded bg-zinc-800/50" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold text-zinc-100">
                  {formatNumber(item.value)}
                </div>
                <div className="text-xs text-zinc-600 uppercase tracking-wider">
                  {item.label}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
