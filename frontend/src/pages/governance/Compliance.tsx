import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

interface RiskEvent {
  id: number;
  event_reference: string;
  event_type: string;
  risk_classification: string;
  status: string;
  risk_score: number;
  explanation: string;
}

function classificationStyle(classification: string) {
  const value = classification.toLowerCase();

  if (value === "critical") {
    return "bg-red-50 text-red-700";
  }

  if (value === "high") {
    return "bg-orange-50 text-orange-700";
  }

  if (value === "medium" || value === "review") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
}

function classificationIcon(classification: string) {
  const value = classification.toLowerCase();

  if (value === "critical" || value === "high") {
    return <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />;
  }

  if (value === "medium" || value === "review") {
    return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />;
  }

  return <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />;
}

export default function Compliance() {
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadRiskEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/risk`);

        if (!response.ok) {
          throw new Error("Failed to load compliance risk data");
        }

        const data = await response.json();

        if (mounted) {
          setEvents(Array.isArray(data?.items) ? data.items : []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load compliance data",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRiskEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const statistics = useMemo(() => {
    const critical = events.filter(
      (event) => event.risk_classification?.toLowerCase() === "critical",
    ).length;

    const high = events.filter(
      (event) => event.risk_classification?.toLowerCase() === "high",
    ).length;

    const review = events.filter((event) => {
      const classification = event.risk_classification?.toLowerCase();

      return classification === "medium" || classification === "review";
    }).length;

    const low = events.filter(
      (event) => event.risk_classification?.toLowerCase() === "low",
    ).length;

    const open = events.filter(
      (event) => event.status?.toLowerCase() === "open",
    ).length;

    return {
      total: events.length,
      critical,
      high,
      review,
      low,
      open,
    };
  }, [events]);

  const complianceRate =
    statistics.total > 0
      ? Math.round(
          ((statistics.low + statistics.review) / statistics.total) * 100,
        )
      : 0;

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          Governance
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Compliance
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Research compliance monitoring based on live BATI risk assessments,
          credential events and governance observations.
        </p>
      </div>

      {/* Research Compliance Notice */}
      <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

          <p className="min-w-0 text-xs leading-5 text-violet-800">
            <span className="font-semibold">
              Research compliance view:
            </span>{" "}
            Compliance indicators are derived from the current experimental
            risk-event data. They are not production regulatory determinations.
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
          <ShieldCheck className="h-5 w-5 text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Research Compliance
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : `${complianceRate}%`}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Derived from current risk profile
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Low Risk
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : statistics.low}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Low-risk observations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <AlertTriangle className="h-5 w-5 text-amber-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Review / High
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : statistics.review + statistics.high}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Events requiring review
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <XCircle className="h-5 w-5 text-red-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Critical
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : statistics.critical}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Priority governance events
          </p>
        </div>
      </div>

      {/* Compliance Risk Register */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Compliance Risk Register
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Live risk classifications generated by the BATI risk engine
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400 sm:py-12">
            <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
            Loading compliance data...
          </div>
        ) : events.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400 sm:py-12">
            No compliance risk events recorded.
          </div>
        ) : (
          <>
            {/* Mobile Risk Cards */}
            <div className="space-y-3 sm:hidden">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-100 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold text-slate-800">
                        {event.event_reference}
                      </p>

                      <p className="mt-1 break-words text-xs capitalize leading-5 text-slate-500">
                        {event.event_type.replaceAll("_", " ")}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-bold text-slate-800">
                      {event.risk_score}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {classificationIcon(event.risk_classification)}

                    <span
                      className={`min-h-7 rounded-full px-2 py-1 text-[10px] font-semibold uppercase leading-5 ${classificationStyle(
                        event.risk_classification,
                      )}`}
                    >
                      {event.risk_classification}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold capitalize text-slate-600">
                      {event.status}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Explanation
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                      {event.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet / Desktop Table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-3 font-semibold">
                      Reference
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Event
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Classification
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Score
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Status
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Explanation
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="px-3 py-4">
                        <span className="break-all text-xs font-semibold text-slate-800">
                          {event.event_reference}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="break-words text-xs capitalize text-slate-600">
                          {event.event_type.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          {classificationIcon(
                            event.risk_classification,
                          )}

                          <span
                            className={`min-h-7 rounded-full px-2 py-1 text-[10px] font-semibold uppercase leading-5 ${classificationStyle(
                              event.risk_classification,
                            )}`}
                          >
                            {event.risk_classification}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-xs font-bold text-slate-800">
                          {event.risk_score}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-xs capitalize text-slate-600">
                          {event.status}
                        </span>
                      </td>

                      <td className="max-w-md px-3 py-4">
                        <span className="break-words text-xs leading-5 text-slate-500">
                          {event.explanation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}