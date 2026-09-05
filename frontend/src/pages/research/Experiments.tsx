
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Beaker,
  CheckCircle2,
  Clock3,
  FlaskConical,
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

interface AuditLog {
  id: number;
  event_id: string;
  event_type: string;
  entity_id: string;
  action: string;
  status: string;
  description: string;
}

export default function Experiments() {
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [auditLogs, setauditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadExperimentActivity() {
      try {
        const [riskResponse, auditResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/risk`),
          fetch(`${API_BASE_URL}/api/audit`),
        ]);

        if (!riskResponse.ok || !auditResponse.ok) {
          throw new Error("Failed to load experiment activity");
        }

        const riskData = await riskResponse.json();
        const auditData = await auditResponse.json();

        if (mounted) {
          setRiskEvents(
            Array.isArray(riskData?.items) ? riskData.items : [],
          );

          setauditLogs(Array.isArray(auditData) ? auditData : []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load experiment activity",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadExperimentActivity();

    return () => {
      mounted = false;
    };
  }, []);

  const verificationEvents = useMemo(
    () =>
      auditLogs.filter((event) =>
        event.event_type?.includes("VERIF"),
      ),
    [auditLogs],
  );

  const riskExperiments = useMemo(
    () =>
      riskEvents
        .slice()
        .sort((a, b) => b.risk_score - a.risk_score),
    [riskEvents],
  );

  const highestRisk = useMemo(
    () =>
      riskEvents.length > 0
        ? Math.max(...riskEvents.map((event) => event.risk_score))
        : 0,
    [riskEvents],
  );

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          Research
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Experiments
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Experimental observations supporting evaluation of BATI identity,
          verification and AI-assisted risk workflows.
        </p>
      </div>

      {/* Research Notice */}
      <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="min-w-0 text-xs leading-5 text-blue-800">
            <span className="font-semibold">Prototype experiment view:</span>{" "}
            The current backend exposes risk and audit observations rather than
            a separate experiment-management API. This page therefore reports
            actual experimental observations without fabricating experiment
            records.
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
        {/* Risk Observations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <Beaker className="h-5 w-5 text-violet-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Risk Observations
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : riskEvents.length}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Experimental observations
          </p>
        </div>

        {/* Verification Events */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Verification Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : verificationEvents.length}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Verification observations
          </p>
        </div>

        {/* Highest Risk */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <ShieldAlert className="h-5 w-5 text-red-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Highest Risk
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : highestRisk}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Highest observed risk score
          </p>
        </div>

        {/* Audit Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <Activity className="h-5 w-5 text-blue-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Audit Activity
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : auditLogs.length}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Traceable experiment-related activity
          </p>
        </div>
      </div>

      {/* Experimental Risk Runs */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              Experimental Risk Runs
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Current risk observations ordered by score
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            Live
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center py-10 text-center text-sm text-slate-400">
            Loading experiments...
          </div>
        ) : riskExperiments.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center py-10 text-center text-sm text-slate-400">
            No experimental risk observations available.
          </div>
        ) : (
          <div className="space-y-3">
            {riskExperiments.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-slate-100 p-3 sm:p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  {/* Event Information */}
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-slate-800">
                      {event.event_reference}
                    </p>

                    <p className="mt-1 break-words text-xs text-slate-500">
                      {event.event_type.replaceAll("_", " ")}
                    </p>

                    <p className="mt-2 break-words text-xs leading-5 text-slate-400">
                      {event.explanation}
                    </p>
                  </div>

                  {/* Risk Information */}
                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <span className="inline-flex min-h-7 max-w-full items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase leading-4 text-slate-600">
                      {event.risk_classification}
                    </span>

                    <span className="shrink-0 text-lg font-bold text-slate-900">
                      {event.risk_score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

