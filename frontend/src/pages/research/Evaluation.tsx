import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  FlaskConical,
  ShieldAlert,
  Target,
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

export default function Evaluation() {
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [auditLogs, setauditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEvaluationData() {
      try {
        const [riskResponse, auditResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/risk`),
          fetch(`${API_BASE_URL}/api/audit`),
        ]);

        if (!riskResponse.ok || !auditResponse.ok) {
          throw new Error("Failed to load evaluation data");
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
              : "Unable to load evaluation data",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEvaluationData();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const total = riskEvents.length;

    const low = riskEvents.filter(
      (event) => event.risk_classification?.toLowerCase() === "low",
    ).length;

    const critical = riskEvents.filter(
      (event) => event.risk_classification?.toLowerCase() === "critical",
    ).length;

    const successfulAudit = auditLogs.filter(
      (event) => event.status?.toLowerCase() === "success",
    ).length;

    const averageRisk =
      total > 0
        ? Math.round(
            riskEvents.reduce(
              (sum, event) => sum + event.risk_score,
              0,
            ) / total,
          )
        : 0;

    const successfulAuditRate =
      auditLogs.length > 0
        ? Math.round((successfulAudit / auditLogs.length) * 100)
        : 0;

    return {
      total,
      low,
      critical,
      averageRisk,
      successfulAuditRate,
    };
  }, [riskEvents, auditLogs]);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Research
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Evaluation
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Evaluation of current experimental risk classifications, audit
          outcomes and trust-infrastructure behaviour.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
        <div className="flex gap-3">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

          <p className="text-xs leading-5 text-amber-800">
            <span className="font-semibold">Prototype evaluation:</span>{" "}
            These metrics evaluate the current BATI event and risk data. They
            should not be interpreted as formal machine-learning benchmark
            metrics until labelled datasets and model-evaluation endpoints are
            connected.
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
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Risk Events</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : metrics.total}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Current evaluation sample
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Target className="h-5 w-5 text-violet-600" />
          <p className="mt-4 text-sm text-slate-500">Average Risk</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : metrics.averageRisk}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Mean risk score
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">Low Risk</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : metrics.low}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Low-risk classifications
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <p className="mt-4 text-sm text-slate-500">Critical</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : metrics.critical}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Critical classifications
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-600" />

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Audit Outcome
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Successful audit records within the current sample
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-4xl font-bold text-slate-950">
              {loading ? "—" : `${metrics.successfulAuditRate}%`}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Successful audit-event rate
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-violet-600" />

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Evaluation Interpretation
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current research interpretation
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-700">
                Risk engine
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Producing classified risk observations for evaluation.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-700">
                Audit layer
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Providing traceability for system actions and outcomes.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-700">
                ML benchmark
              </p>

              <p className="mt-1 text-xs text-amber-600">
                Pending labelled evaluation dataset/API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

