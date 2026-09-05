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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
      </div>
    );
  }

  if (eventType.includes("REVOK")) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      </div>
    );
  }

  if (eventType.includes("VERIF")) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
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
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          Governance
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Accountability
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Traceable accountability records connecting identity activity,
          credential operations, verification decisions and governance actions.
        </p>
      </div>

      {/* Research Notice */}
      <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="min-w-0 text-xs leading-5 text-blue-800">
            <span className="font-semibold">Live research data:</span>{" "}
            Accountability records are loaded directly from the BATI audit
            service.
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
            Total Audit Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.total}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Recorded accountability events
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Successful Actions
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.successful}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Successfully recorded operations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <FileCheck2 className="h-5 w-5 text-blue-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Verification Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.verifications}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Credential verification activity
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <AlertTriangle className="h-5 w-5 text-amber-600" />

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Failed / Revoked
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {statistics.failed + statistics.revocations}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Events requiring attention
          </p>
        </div>
      </div>

      {/* Accountability Events */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              Accountability Events
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Live records from the BATI audit trail
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5 shrink-0" />
            Live API
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400 sm:py-12">
            <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
            Loading accountability events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400 sm:py-12">
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="break-words text-sm font-semibold text-slate-800">
                      {event.event_type.replaceAll("_", " ")}
                    </p>

                    <span
                      className={`min-h-7 w-fit shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase leading-5 ${
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

                  <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                    {event.description}
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-1 text-[10px] leading-5 text-slate-400 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
                    <span className="break-all">{event.event_id}</span>
                    <span className="break-all">{event.entity_id}</span>
                    <span className="break-words">{event.action}</span>
                    <span className="break-words">
                      {formatDate(event.created_at)}
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