import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Beaker,
  CheckCircle2,
  Clock3,
  FlaskConical,
  ShieldAlert,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface RiskEvent {
  id: number;
  event_reference: string;
  event_type: string;
  risk_classification: string;
  status: string;
  risk_score: number;
  explanation: string;
}

interface AuditEvent {
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
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
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

          setAuditEvents(Array.isArray(auditData) ? auditData : []);
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
      auditEvents.filter((event) =>
        event.event_type?.includes("VERIF"),
      ),
    [auditEvents],
  );

  const riskExperiments = useMemo(
    () =>
      riskEvents
        .slice()
        .sort((a, b) => b.risk_score - a.risk_score),
    [riskEvents],
  );

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Research
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Experiments
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Experimental observations supporting evaluation of BATI identity,
          verification and AI-assisted risk workflows.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">Prototype experiment view:</span>{" "}
            The current backend exposes risk and audit observations rather than
            a separate experiment-management API. This page therefore reports
            actual experimental observations without fabricating experiment
            records.
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
          <Beaker className="h-5 w-5 text-violet-600" />
          <p className="mt-4 text-sm text-slate-500">Risk Observations</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : riskEvents.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Experimental observations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">Verification Events</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : verificationEvents.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Verification observations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <p className="mt-4 text-sm text-slate-500">Highest Risk</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading
              ? "—"
              : riskEvents.length > 0
                ? Math.max(...riskEvents.map((event) => event.risk_score))
                : 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Highest observed risk score
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Activity className="h-5 w-5 text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Audit Activity</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : auditEvents.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Traceable experiment-related activity
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Experimental Risk Runs
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Current risk observations ordered by score
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            Live
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading experiments...
          </div>
        ) : riskExperiments.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No experimental risk observations available.
          </div>
        ) : (
          <div className="space-y-3">
            {riskExperiments.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {event.event_reference}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {event.event_type.replaceAll("_", " ")}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {event.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">
                    {event.risk_classification}
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    {event.risk_score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}