import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Info,
  ShieldAlert,
} from "lucide-react"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

interface RiskEvent {
  id: number
  event_reference: string
  event_type: string
  risk_score: number
  risk_classification: string
  status: string
  explanation: string
  created_at?: string
}

interface RiskResponse {
  count: number
  items: RiskEvent[]
}

function classificationLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function classificationClasses(value: string) {
  const classification = value.toLowerCase()

  if (classification === "critical") {
    return "bg-red-50 text-red-700 border-red-100"
  }

  if (classification === "high") {
    return "bg-orange-50 text-orange-700 border-orange-100"
  }

  if (classification === "medium") {
    return "bg-amber-50 text-amber-700 border-amber-100"
  }

  return "bg-emerald-50 text-emerald-700 border-emerald-100"
}

function ExplanationIcon({
  classification,
}: {
  classification: string
}) {
  const value = classification.toLowerCase()

  if (value === "critical" || value === "high") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
        <ShieldAlert className="h-5 w-5 text-red-600" />
      </div>
    )
  }

  if (value === "medium") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    </div>
  )
}

export default function ExplainableAI() {
  const [events, setEvents] = useState<RiskEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadRiskEvents() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`${API_BASE_URL}/api/risk`)

        if (!response.ok) {
          throw new Error("Failed to load risk events")
        }

        const data: RiskResponse = await response.json()
        setEvents(data.items ?? [])
      } catch (err) {
        console.error("Explainable AI:", err)
        setError("Unable to load live risk intelligence.")
      } finally {
        setLoading(false)
      }
    }

    loadRiskEvents()
  }, [])

  const criticalCount = useMemo(
    () =>
      events.filter(
        (event) =>
          event.risk_classification.toLowerCase() === "critical",
      ).length,
    [events],
  )

  const highCount = useMemo(
    () =>
      events.filter(
        (event) =>
          event.risk_classification.toLowerCase() === "high",
      ).length,
    [events],
  )

  const averageScore = useMemo(() => {
    if (events.length === 0) return 0

    return (
      events.reduce(
        (total, event) =>
          total + Number(event.risk_score || 0),
        0,
      ) / events.length
    ).toFixed(1)
  }, [events])

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          AI Intelligence
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Explainable AI
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Interpretation of AI-assisted risk assessments and
          decision-support outputs using live BATI risk
          intelligence.
        </p>
      </div>

      {/* Research Prototype Notice */}
      <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="min-w-0 text-xs leading-5 text-blue-800">
            <span className="font-semibold">
              Research prototype:
            </span>{" "}
            Explanations shown here are generated from the
            current BATI risk event records. They provide
            interpretable evidence for research-stage risk
            decisions.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Risk Events
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {loading ? "—" : events.length}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Live events from BATI risk engine
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Critical Events
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {loading ? "—" : criticalCount}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Immediate review priority
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Average Risk Score
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {loading ? "—" : averageScore}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Across current risk observations
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-sm leading-5 text-red-700 sm:mb-6 sm:px-4">
          {error}
        </div>
      )}

      {/* Explainable Risk Assessments */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">
                Explainable Risk Assessments
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Evidence and explanations associated with live
                risk events
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock3 className="h-3.5 w-3.5 shrink-0" />
              Live data
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500 sm:px-5">
              <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
              Loading risk explanations...
            </div>
          ) : events.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500 sm:px-5">
              No risk events are currently available.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5"
              >
                <ExplanationIcon
                  classification={event.risk_classification}
                />

                <div className="min-w-0 flex-1">
                  {/* Event Header */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-900">
                        {event.event_type}
                      </p>

                      <p className="mt-1 break-all text-xs leading-5 text-slate-400">
                        {event.event_reference}
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-7 w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${classificationClasses(
                        event.risk_classification,
                      )}`}
                    >
                      {classificationLabel(
                        event.risk_classification,
                      )}
                    </span>
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                      Explanation
                    </p>

                    <p className="mt-1 break-words text-sm leading-6 text-slate-700">
                      {event.explanation}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                    <span>
                      Risk score:{" "}
                      <strong className="text-slate-800">
                        {event.risk_score}
                      </strong>
                    </span>

                    <span>
                      Status:{" "}
                      <strong className="text-slate-800">
                        {event.status}
                      </strong>
                    </span>

                    {event.created_at && (
                      <span className="break-words">
                        Created:{" "}
                        <strong className="text-slate-800">
                          {new Date(
                            event.created_at,
                          ).toLocaleString()}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* High-Risk Notice */}
      {highCount > 0 && (
        <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 px-3 py-3 sm:mt-6 sm:px-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />

            <p className="min-w-0 text-xs leading-5 text-orange-800">
              {highCount} high-risk event
              {highCount === 1 ? "" : "s"} require institutional
              review.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}