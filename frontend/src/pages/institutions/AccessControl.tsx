
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

interface Identity {
  id: number;
  identity_id: string;
  full_name: string;
  email: string;
  institution: string;
  role: string;
  status: string;
  trust_level?: string;
  biometric_verified?: boolean;
}

export default function AccessControl() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadIdentities() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/identities`);

        if (!response.ok) {
          throw new Error("Failed to load access-control data");
        }

        const data = await response.json();

        if (mounted) {
          setIdentities(Array.isArray(data?.items) ? data.items : []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load access-control data",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadIdentities();

    return () => {
      mounted = false;
    };
  }, []);

  const roles = useMemo(() => {
    const counts = new Map<string, number>();

    for (const identity of identities) {
      const role = identity.role?.trim() || "Unassigned";
      counts.set(role, (counts.get(role) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [identities]);

  const active = identities.filter(
    (identity) => identity.status?.toLowerCase() === "active",
  ).length;

  const verified = identities.filter(
    (identity) =>
      identity.status?.toLowerCase() === "verified" ||
      identity.biometric_verified === true,
  ).length;

  const highTrust = identities.filter(
    (identity) => identity.trust_level?.toLowerCase() === "high",
  ).length;

  const restricted = identities.filter((identity) => {
    const status = identity.status?.toLowerCase();

    return (
      status === "revoked" ||
      status === "suspended" ||
      status === "blocked" ||
      status === "inactive"
    );
  }).length;

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          Institutions
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Access Control
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Identity-based access posture and institutional role visibility
          within the BATI research environment.
        </p>
      </div>

      {/* Research Prototype Notice */}
      <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

          <p className="min-w-0 text-xs leading-5 text-amber-800">
            <span className="font-semibold">Research prototype:</span>{" "}
            Current access indicators are derived from identity status, role
            and trust attributes. A dedicated authorization policy API has not
            been introduced yet.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm leading-5 text-red-700 sm:mb-6 sm:px-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <Users className="h-5 w-5 text-slate-700" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Identities
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : identities.length}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Identity records under management
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Active Access
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : active}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Active identity status
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <ShieldCheck className="h-5 w-5 text-blue-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            High Trust
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : highTrust}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Identities with high trust level
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <ShieldAlert className="h-5 w-5 text-red-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Restricted
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : restricted}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Suspended, revoked or inactive
          </p>
        </div>
      </div>

      {/* Role Distribution / Access Posture */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 xl:grid-cols-2">
        {/* Role Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Role Distribution
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Roles currently represented in the identity service
          </p>

          <div className="mt-4 space-y-3 sm:mt-5">
            {roles.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No role data available.
              </p>
            ) : (
              roles.map(([role, count]) => (
                <div
                  key={role}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <span className="min-w-0 break-words text-sm font-medium text-slate-700">
                    {role}
                  </span>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Access Posture */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Access Posture
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Current identity status distribution
          </p>

          <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
            <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 sm:bg-transparent sm:px-0 sm:py-0">
              <span className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                Verified
              </span>

              <span className="shrink-0 font-semibold text-slate-800">
                {verified}
              </span>
            </div>

            <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 sm:bg-transparent sm:px-0 sm:py-0">
              <span className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                High trust
              </span>

              <span className="shrink-0 font-semibold text-slate-800">
                {highTrust}
              </span>
            </div>

            <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 sm:bg-transparent sm:px-0 sm:py-0">
              <span className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                <XCircle className="h-4 w-4 shrink-0 text-red-600" />
                Restricted
              </span>

              <span className="shrink-0 font-semibold text-slate-800">
                {restricted}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

