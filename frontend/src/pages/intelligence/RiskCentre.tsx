import { useEffect, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from "lucide-react"

import {
  getRiskEvents,
  type RiskEvent,
} from "../../services/riskApi"

export default function RiskCentre() {
  const [events, setEvents] = useState<RiskEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadRiskEvents() {
    try {
      setLoading(true)
      setError("")

      const data = await getRiskEvents()
      setEvents(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load risk events from the BATI API.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRiskEvents()
  }, [])

  const critical = events.filter(
    (event) => event.risk_classification.toLowerCase() === "critical",
  ).length

  const high = events.filter(
    (event) => event.risk_classification.toLowerCase() === "high",
  ).length

  const medium = events.filter(
    (event) => event.risk_classification.toLowerCase() === "medium",
  ).length

  const low = events.filter(
    (event) => event.risk_classification.toLowerCase() === "low",
  ).length

  function classificationBadge(classification: string) {
    const value = classification.toLowerCase()

    if (value === "critical") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold capitalize text-red-700">
          <XCircle className="h-3.5 w-3.5" />
          Critical
        </span>
      )
    }

    if (value === "high") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold capitalize text-orange-700">
          <ShieldAlert className="h-3.5 w-3.5" />
          High
        </span>
      )
    }

    if (value === "medium") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Medium
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Low
      </span>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
            AI Intelligence
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Risk Centre
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Central monitoring of AI-assisted risk events and institutional
            review priorities.
          </p>
        </div>

        <button
          onClick={loadRiskEvents}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Total Risk Events</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {events.length}
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Critical</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{critical}</p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">High</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{high}</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Medium</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{medium}</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Low</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{low}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-slate-700" />

            <h2 className="text-sm font-semibold text-slate-900">
              Risk Event Monitor
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Live risk events generated by the BATI Risk Engine.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading risk events...
          </div>
        ) : events.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No risk events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Classification</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Explanation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {event.event_reference}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">
                        {event.event_type}
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <Clock3 className="h-3 w-3" />
                        Risk event
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {classificationBadge(event.risk_classification)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {event.risk_score}
                    </td>

                    <td className="px-5 py-4 capitalize text-slate-600">
                      {event.status}
                    </td>

                    <td className="max-w-md px-5 py-4 text-xs leading-5 text-slate-500">
                      {event.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}