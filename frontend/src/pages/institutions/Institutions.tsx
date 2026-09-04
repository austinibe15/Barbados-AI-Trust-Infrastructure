import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Users,
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
  notes?: string;
}

interface InstitutionSummary {
  name: string;
  identities: number;
  active: number;
  verified: number;
  highTrust: number;
}

export default function Institutions() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadIdentities() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/identities`);

        if (!response.ok) {
          throw new Error("Failed to load institutional identities");
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
              : "Unable to load institutional data",
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

  const institutions = useMemo<InstitutionSummary[]>(() => {
    const groups = new Map<string, Identity[]>();

    for (const identity of identities) {
      const institution =
        identity.institution?.trim() || "Unspecified Institution";

      const existing = groups.get(institution) ?? [];
      existing.push(identity);
      groups.set(institution, existing);
    }

    return Array.from(groups.entries())
      .map(([name, members]) => ({
        name,
        identities: members.length,
        active: members.filter(
          (item) => item.status?.toLowerCase() === "active",
        ).length,
        verified: members.filter(
          (item) =>
            item.status?.toLowerCase() === "verified" ||
            item.biometric_verified === true,
        ).length,
        highTrust: members.filter(
          (item) => item.trust_level?.toLowerCase() === "high",
        ).length,
      }))
      .sort((a, b) => b.identities - a.identities);
  }, [identities]);

  const activeIdentities = identities.filter(
    (identity) => identity.status?.toLowerCase() === "active",
  ).length;

  const verifiedIdentities = identities.filter(
    (identity) =>
      identity.status?.toLowerCase() === "verified" ||
      identity.biometric_verified === true,
  ).length;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Institutions
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Institutions
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Institutional participation and identity distribution within the
          BATI research infrastructure.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">Live identity data:</span>{" "}
            Institutional summaries are derived from identities currently
            registered through the BATI identity service.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Building2 className="h-5 w-5 text-slate-700" />
          <p className="mt-4 text-sm text-slate-500">Institutions</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : institutions.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Distinct institutions represented
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Users className="h-5 w-5 text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Identities</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : identities.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Registered institutional identities
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">Active</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : activeIdentities}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Active identity records
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-violet-600" />
          <p className="mt-4 text-sm text-slate-500">Verified</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : verifiedIdentities}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Verified identity records
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Institutional Directory
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Institutions inferred from live identity records
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading institutions...
          </div>
        ) : institutions.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No institutional identity records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-3 font-semibold">Institution</th>
                  <th className="px-3 py-3 font-semibold">Identities</th>
                  <th className="px-3 py-3 font-semibold">Active</th>
                  <th className="px-3 py-3 font-semibold">Verified</th>
                  <th className="px-3 py-3 font-semibold">High Trust</th>
                </tr>
              </thead>

              <tbody>
                {institutions.map((institution) => (
                  <tr
                    key={institution.name}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                          <Building2 className="h-4 w-4 text-slate-600" />
                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          {institution.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {institution.identities}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {institution.active}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {institution.verified}
                    </td>

                    <td className="px-3 py-4">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        {institution.highTrust}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}