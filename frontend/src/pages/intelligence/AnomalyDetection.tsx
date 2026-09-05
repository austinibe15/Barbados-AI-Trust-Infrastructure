import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ShieldAlert,
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

function classificationClass(value: string) {
  switch (value?.toLowerCase()) {
    case "critical":
      return "bg-red-50 text-red-700";

    case "high":
      return "bg-orange-50 text-orange-700";

    case "medium":
    case "review":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-emerald-50 text-emerald-700";
  }
}

export default function AnomalyDetection() {
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
          throw new Error(
            `Failed to load anomaly observations (${response.status})`,
          );
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
              : "Unable to load anomaly observations",
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

  const observations = useMemo(() => {
    return events
      .filter((event) => event.risk_score >= 50)
      .sort((a, b) => b.risk_score - a.risk_score);
  }, [events]);

  const critical = useMemo(() => {
    return events.filter(
      (event) =>
        event.risk_classification?.toLowerCase() === "critical",
    ).length;
  }, [events]);

  const averageRisk = useMemo(() => {
    if (events.length === 0) {
      return 0;
    }

    return Math.round(
      events.reduce(
        (sum, event) => sum + event.risk_score,
        0,
      ) / events.length,
    );
  }, [events]);

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          AI Intelligence
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Anomaly Detection
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Identification and review of elevated-risk observations produced by
          the BATI risk intelligence layer.
        </p>
      </div>

      {/* Research Mode Notice */}
      <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

          <p className="min-w-0 text-xs leading-5 text-violet-800">
            <span className="font-semibold">Research mode:</span>{" "}
            Observations are derived from the existing BATI risk-event
            service. Dedicated trained anomaly-detection model output will be
            connected when that service is exposed through the backend API.
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
          <Activity className="h-5 w-5 text-slate-700" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Risk Observations
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : events.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Events currently available
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <AlertTriangle className="h-5 w-5 text-amber-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Elevated
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : observations.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Risk score ≥ 50
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <ShieldAlert className="h-5 w-5 text-red-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Critical
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : critical}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Critical classifications
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Average Risk
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : averageRisk}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Mean risk score
          </p>
        </div>
      </div>

      {/* Elevated Risk Observations */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Elevated-Risk Observations
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Events currently warranting anomaly or risk review
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400 sm:py-12">
            <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
            Loading observations...
          </div>
        ) : observations.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400 sm:py-12">
            No elevated-risk observations detected.
          </div>
        ) : (
          <div className="space-y-3">
            {observations.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-slate-100 p-3 sm:p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  {/* Event Information */}
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="break-all text-sm font-semibold text-slate-800">
                        {event.event_reference}
                      </span>

                      <span
                        className={`min-h-7 rounded-full px-2 py-1 text-[10px] font-semibold uppercase leading-5 ${classificationClass(
                          event.risk_classification,
                        )}`}
                      >
                        {event.risk_classification}
                      </span>
                    </div>

                    <p className="mt-1 break-words text-xs capitalize leading-5 text-slate-500">
                      {event.event_type.replaceAll("_", " ")}
                    </p>
                  </div>

                  {/* Risk Score */}
                  <div className="shrink-0 border-t border-slate-100 pt-3 text-left lg:border-0 lg:pt-0 lg:text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {event.risk_score}
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Risk score
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="break-words text-xs leading-5 text-slate-500">
                    {event.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}