
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileSearch,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

interface AuditLog {
  id: number;
  event_id?: string | null;
  event_reference?: string | null;
  event_type?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_identity_id?: number | null;
  actor_reference?: string | null;
  action?: string | null;
  description?: string | null;
  status?: string | null;
  metadata_json?: string | null;
  created_at?: string | null;
  timestamp?: string | null;
}

interface AuditResponse {
  count?: number;
  items?: AuditLog[];
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function timestamp(value?: string | null): number {
  if (!value) {
    return 0;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
}

function eventTimestamp(event: AuditLog): string | null {
  return event.created_at ?? event.timestamp ?? null;
}

function displayReference(event: AuditLog): string {
  return (
    event.event_id ??
    event.event_reference ??
    `AUDIT-${event.id}`
  );
}

function displayActor(event: AuditLog): string {
  if (event.actor_reference) {
    return event.actor_reference;
  }

  if (
    event.actor_identity_id !== null &&
    event.actor_identity_id !== undefined
  ) {
    return `Identity ${event.actor_identity_id}`;
  }

  return "System";
}

function displayAction(event: AuditLog): string {
  return event.action
    ? event.action.replaceAll("_", " ")
    : "AUDIT EVENT";
}

function displayEventType(event: AuditLog): string {
  return event.event_type
    ? event.event_type.replaceAll("_", " ")
    : "Unknown event";
}

function actionClass(action?: string | null): string {
  const value = action?.toLowerCase() ?? "";

  if (
    value.includes("fail") ||
    value.includes("reject") ||
    value.includes("deny") ||
    value.includes("delete")
  ) {
    return "bg-red-50 text-red-700";
  }

  if (
    value.includes("verify") ||
    value.includes("approve") ||
    value.includes("create")
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    value.includes("update") ||
    value.includes("modify") ||
    value.includes("review")
  ) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

async function fetchAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch(`${API_BASE_URL}/api/audit`);

  if (!response.ok) {
    throw new Error(
      `Audit API request failed (${response.status})`,
    );
  }

  const data: AuditLog[] | AuditResponse = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  throw new Error("Audit API returned an invalid response");
}

export default function AuditTrail() {
  const [events, setEvents] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadAuditLogs(showRefreshState = false) {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const auditLogs = await fetchAuditLogs();

      setEvents(auditLogs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load audit events",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const recentEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        timestamp(eventTimestamp(b)) -
        timestamp(eventTimestamp(a)),
    );
  }, [events]);

  const verifiedEvents = useMemo(
    () =>
      events.filter((event) => {
        const eventType = event.event_type?.toLowerCase() ?? "";
        const action = event.action?.toLowerCase() ?? "";

        return (
          eventType.includes("verify") ||
          eventType.includes("verified") ||
          action.includes("verify")
        );
      }).length,
    [events],
  );

  const failedEvents = useMemo(
    () =>
      events.filter((event) => {
        const action = event.action?.toLowerCase() ?? "";
        const status = event.status?.toLowerCase() ?? "";

        return (
          action.includes("fail") ||
          action.includes("reject") ||
          action.includes("deny") ||
          status.includes("fail") ||
          status.includes("rejected") ||
          status.includes("denied")
        );
      }).length,
    [events],
  );

  const uniqueActors = useMemo(() => {
    const actors = new Set(
      events.map((event) => displayActor(event)),
    );

    return actors.size;
  }, [events]);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
            Governance
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Audit Trail
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Traceable record of governance, identity, credential and
            risk-related activity across the BATI infrastructure.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadAuditLogs(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">
              Live audit infrastructure:
            </span>{" "}
            Events displayed below are retrieved directly from the BATI
            backend audit service.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="font-semibold">
              Unable to load audit data
            </p>

            <p className="mt-1 text-xs">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Activity className="h-5 w-5 text-slate-700" />

          <p className="mt-4 text-sm text-slate-500">
            Audit Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : events.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Events returned by backend
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-4 text-sm text-slate-500">
            Verification Events
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : verifiedEvents}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Credential or identity verification activity
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600" />

          <p className="mt-4 text-sm text-slate-500">
            Exceptions
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : failedEvents}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Failed, rejected or denied actions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FileSearch className="h-5 w-5 text-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Active Actors
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {loading ? "—" : uniqueActors}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Distinct audit actors represented
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-500" />

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Audit Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Chronological audit events retrieved from the live API
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading audit activity...
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            No audit events are currently available.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="px-5 py-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {displayReference(event)}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${actionClass(
                          event.action,
                        )}`}
                      >
                        {displayAction(event)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      {displayEventType(event)}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {event.description ??
                        "No description available."}
                    </p>
                  </div>

                  <div className="shrink-0 text-left lg:text-right">
                    <p className="text-xs font-medium text-slate-500">
                      {formatDate(eventTimestamp(event))}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                      {displayActor(event)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400">
                  {event.entity_type && (
                    <span>
                      Entity:{" "}
                      <span className="font-medium text-slate-500">
                        {event.entity_type}
                      </span>
                    </span>
                  )}

                  {event.entity_id && (
                    <span>
                      Entity ID:{" "}
                      <span className="font-medium text-slate-500">
                        {event.entity_id}
                      </span>
                    </span>
                  )}

                  <span>
                    Event ID:{" "}
                    <span className="font-medium text-slate-500">
                      {event.id}
                    </span>
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


