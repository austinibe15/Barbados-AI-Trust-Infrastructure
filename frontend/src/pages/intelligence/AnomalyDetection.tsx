
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
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          AI Intelligence
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Anomaly Detection
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Identification and review of elevated-risk observations produced by
          the BATI risk intelligence layer.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
        <div className="flex gap-3">
          <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

          <p className="text-xs leading-5 text-violet-800">
            <span className="font-semibold">Research mode:</span>{" "}
            Observations are derived from the existing BATI risk-event
            service. Dedicated trained anomaly-detection model output will be
            connected when that service is exposed through the backend API.
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
          <Activity className="h-5 w-5 text-slate-700" />

          <p className="mt-4 text-sm text-slate-500">
            Risk Observations
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : events.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Events currently available
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600" />

          <p className="mt-4 text-sm text-slate-500">
            Elevated
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : observations.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Risk score ≥ 50
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-red-600" />

          <p className="mt-4 text-sm text-slate-500">
            Critical
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : critical}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Critical classifications
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
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

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Elevated-Risk Observations
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Events currently warranting anomaly or risk review
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading observations...
          </div>
        ) : observations.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No elevated-risk observations detected.
          </div>
        ) : (
          <div className="space-y-3">
            {observations.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {event.event_reference}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${classificationClass(
                          event.risk_classification,
                        )}`}
                      >
                        {event.risk_classification}
                      </span>
                    </div>

                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {event.event_type.replaceAll("_", " ")}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {event.risk_score}
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Risk score
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {event.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

