import { useState, useEffect } from "react";

interface WaitlistEntry {
  id: string;
  email: string;
  waitlist_type: "cloud" | "api";
  company_size: string | null;
  use_case: string | null;
  referral_source: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  cloud: number;
  api: number;
  today: number;
  thisWeek: number;
}

type AuthState = "loading" | "unauthenticated" | "authenticated";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;

export default function AdminDashboard() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "cloud" | "api">("all");

  // Check for existing session
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authenticated");
    const storedKey = sessionStorage.getItem("admin_key");
    if (stored === "true" && storedKey) {
      setAuthState("authenticated");
      fetchData(storedKey);
    } else {
      setAuthState("unauthenticated");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await fetchData(password);
      if (success) {
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_key", password);
        setAuthState("authenticated");
      } else {
        setError("Invalid password or access denied");
      }
    } catch {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_key");
    setAuthState("unauthenticated");
    setEntries([]);
    setStats(null);
    setPassword("");
  };

  const fetchData = async (adminKey?: string): Promise<boolean> => {
    const key = adminKey || sessionStorage.getItem("admin_key");
    if (!key) {
      setError("No admin key");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/admin-waitlist`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": key,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          return false;
        }
        throw new Error("Failed to fetch data");
      }

      const { data } = await response.json();
      setEntries(data || []);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const calculatedStats: Stats = {
        total: data?.length || 0,
        cloud:
          data?.filter((e: WaitlistEntry) => e.waitlist_type === "cloud")
            .length || 0,
        api:
          data?.filter((e: WaitlistEntry) => e.waitlist_type === "api")
            .length || 0,
        today:
          data?.filter((e: WaitlistEntry) => new Date(e.created_at) >= today)
            .length || 0,
        thisWeek:
          data?.filter((e: WaitlistEntry) => new Date(e.created_at) >= weekAgo)
            .length || 0,
      };
      setStats(calculatedStats);
      return true;
    } catch (err) {
      setError("Failed to fetch data");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Email",
      "Type",
      "Company Size",
      "Use Case",
      "Referral",
      "Signed Up",
    ];
    const rows = entries.map((e) => [
      e.email,
      e.waitlist_type,
      e.company_size || "",
      e.use_case || "",
      e.referral_source || "",
      new Date(e.created_at).toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `artemiskit-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((e) => e.waitlist_type === filter);

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-stone-100 mb-2">
              Admin Access
            </h1>
            <p className="text-stone-400 text-sm">
              ArtemisKit Waitlist Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <p className="text-center text-stone-600 text-xs mt-8">
            <a href="/" className="hover:text-stone-400">
              ← Back to site
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-stone-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/artemiskit-icon.svg"
              alt="ArtemisKit"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-semibold">Waitlist Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="px-4 py-2 text-sm text-stone-400 hover:text-stone-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-stone-400 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Signups" value={stats.total} />
            <StatCard
              label="Cloud Waitlist"
              value={stats.cloud}
              color="orange"
            />
            <StatCard label="API Waitlist" value={stats.api} color="blue" />
            <StatCard label="Today" value={stats.today} color="green" />
            <StatCard label="This Week" value={stats.thisWeek} />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-400">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All</option>
              <option value="cloud">Cloud</option>
              <option value="api">API</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            disabled={entries.length === 0}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Company Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Use Case
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Referral
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-stone-500"
                    >
                      {loading ? "Loading..." : "No signups yet"}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-stone-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-stone-100">
                        {entry.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            entry.waitlist_type === "cloud"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {entry.waitlist_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-400">
                        {entry.company_size || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-400">
                        {entry.use_case || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-400">
                        {entry.referral_source || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-400">
                        {new Date(entry.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-stone-600 text-sm mt-8">
          Showing {filteredEntries.length} of {entries.length} entries
        </p>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  const colorClasses = {
    orange: "text-orange-400",
    blue: "text-blue-400",
    green: "text-green-400",
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
      <p className="text-sm text-stone-400 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${color ? colorClasses[color as keyof typeof colorClasses] : "text-stone-100"}`}
      >
        {value}
      </p>
    </div>
  );
}
