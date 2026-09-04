import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

interface AuditLog {
  id: number;
  event_id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  actor_identity_id?: number | null;
  action: string;
  status: string;
  description: string;
  created_at?: string;
}

function getEventIcon(status: string, eventType: string) {
  if (status === "failed") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
      </div>
    );
  }

  if (eventType.includes("REVOK")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      </div>
    );
  }

  if (eventType.includes("VERIF")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
      <Activity className="h-4 w-4 text-blue-600" />
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "Time unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function Accountability() {
  const [events, setEvents] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAuditLogs() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/audit`);

        if (!response.ok) {
          throw new Error("Failed to load accountability events");
        }

        const data = await response.json();

        if (mounted) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load accountability data",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAuditLogs();

    return () => {
      mounted = false;
    };
  }, []);

  const statistics = useMemo(() => {
    const successful = events.filter(
      (event) => event.status?.toLowerCase() === "success",
    ).length;

    const failed = events.filter(
      (event) => event.status?.toLowerCase() === "failed",
    ).length;

    const verifications = events.filter((event) =>
      event.event_type?.includes("VERIF"),
    ).length;

    const revocations = events.filter((event) =>
      event.event_type?.includes("REVOK"),
    ).length;

    return {
      total: events.length,
      successful,
      failed,
      verifications,
      revocations,
    };
  }, [events]);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Governance
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Accountability
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Traceable accountability records connecting identity activity,
          credential operations, verification decisions and governance actions.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">Live research data:</span>{" "}
            Accountability records are loaded directly from the BATI audit
            service.
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
            Total Audit Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.total}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Recorded accountability events
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-4 text-sm text-slate-500">
            Successful Actions
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.successful}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Successfully recorded operations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FileCheck2 className="h-5 w-5 text-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Verification Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.verifications}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Credential verification activity
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600" />

          <p className="mt-4 text-sm text-slate-500">
            Failed / Revoked
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.failed + statistics.revocations}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Events requiring attention
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Accountability Events
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Live records from the BATI audit trail
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            Live API
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading accountability events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No accountability events recorded.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex gap-3 py-4 first:pt-0 last:pb-0"
              >
                {getEventIcon(event.status, event.event_type)}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <p className="text-sm font-semibold text-slate-800">
                      {event.event_type.replaceAll("_", " ")}
                    </p>

                    <span
                      className={`w-fit rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                        event.status === "success"
                          ? "bg-emerald-50 text-emerald-700"
                          : event.status === "failed"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {event.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
                    <span>{event.event_id}</span>
                    <span>{event.entity_id}</span>
                    <span>{event.action}</span>
                    <span>{formatDate(event.created_at)}</span>
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

