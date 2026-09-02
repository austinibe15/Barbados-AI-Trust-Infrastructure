import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileCheck2,
  Fingerprint,
  Gauge,
  Network,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const riskData = [
  { name: "Safe", value: 82 },
  { name: "Review", value: 14 },
  { name: "Critical", value: 4 },
]

const activityData = [
  { day: "Mon", events: 42 },
  { day: "Tue", events: 55 },
  { day: "Wed", events: 48 },
  { day: "Thu", events: 71 },
  { day: "Fri", events: 64 },
  { day: "Sat", events: 52 },
  { day: "Sun", events: 67 },
]

const accountabilityEvents = [
  {
    title: "Credential verified",
    description: "Institutional credential VC-982173",
    time: "8 minutes ago",
    type: "success",
  },
  {
    title: "AI anomaly detected",
    description: "Unusual transaction behaviour",
    time: "24 minutes ago",
    type: "warning",
  },
  {
    title: "Compliance review initiated",
    description: "Case CMP-00482",
    time: "41 minutes ago",
    type: "info",
  },
  {
    title: "Credential revoked",
    description: "Credential VC-981204",
    time: "1 hour ago",
    type: "danger",
  },
]

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
}: {
  label: string
  value: string
  description: string
  icon: typeof Users
  trend?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>

        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {trend}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  )
}

function PipelineStep({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string
  title: string
  description: string
  icon: typeof Fingerprint
}) {
  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>

      <div className="pb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {number}
          </span>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

function EventIcon({ type }: { type: string }) {
  if (type === "success") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      </div>
    )
  }

  if (type === "warning") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      </div>
    )
  }

  if (type === "danger") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
      </div>
    )
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
      <CircleDot className="h-4 w-4 text-blue-600" />
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              System operational
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            BATI Dashboard
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Barbados AI Trust Infrastructure — research environment for
            trustworthy, privacy-preserving and accountable artificial
            intelligence.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />

            <div>
              <p className="text-xs font-semibold text-slate-800">
                Research Prototype
              </p>
              <p className="text-[11px] text-slate-400">
                Experimental data environment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Research disclaimer */}
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">Research prototype:</span>{" "}
            Dashboard metrics and classifications represent experimental
            research data. Production AI risk classifications will be
            generated after the research datasets and models are connected.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Digital Identities"
          value="12,482"
          description="Registered research identities"
          icon={Users}
          trend="+4.8%"
        />

        <MetricCard
          label="Verified Credentials"
          value="9,871"
          description="79.1% verification rate"
          icon={FileCheck2}
          trend="+3.2%"
        />

        <MetricCard
          label="AI Risk Events"
          value="146"
          description="Experimental risk observations"
          icon={AlertTriangle}
          trend="+8.6%"
        />

        <MetricCard
          label="Critical Events"
          value="18"
          description="Priority institutional reviews"
          icon={Gauge}
        />
      </div>

      {/* Main analytics */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Activity chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Trust Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Identity, verification, AI and governance events
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              Last 7 days
            </div>
          </div>

          <div className="mt-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="trustActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity={0.2} />
                    <stop offset="100%" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#334155"
                  strokeWidth={2}
                  fill="url(#trustActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Risk Distribution
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Experimental classification profile
            </p>
          </div>

          <div className="relative mt-4 h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {riskData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        index === 0
                          ? "#10b981"
                          : index === 1
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-950">82%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Safe
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {riskData.map((risk, index) => (
              <div
                key={risk.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      index === 0
                        ? "bg-emerald-500"
                        : index === 1
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />

                  <span className="text-slate-600">{risk.name}</span>
                </div>

                <span className="font-semibold text-slate-800">
                  {risk.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust pipeline */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-900">
              BATI Trust Pipeline
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Core research architecture from identity to accountability
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-5 h-[calc(100%-35px)] w-px bg-slate-200" />

            <PipelineStep
              number="01"
              title="Trusted Identity"
              description="Establish and manage a digital identity for the participating actor."
              icon={Fingerprint}
            />

            <PipelineStep
              number="02"
              title="Privacy-Preserving Verification"
              description="Verify identity or credentials while minimising unnecessary disclosure."
              icon={UserCheck}
            />

            <PipelineStep
              number="03"
              title="AI Intelligence"
              description="Analyse events and activity for unusual or potentially risky patterns."
              icon={Network}
            />

            <PipelineStep
              number="04"
              title="Explainable Decision"
              description="Provide interpretable evidence for AI-assisted risk classifications."
              icon={Activity}
            />

            <PipelineStep
              number="05"
              title="Institutional Accountability"
              description="Connect findings to human review, governance actions and audit records."
              icon={ShieldCheck}
            />
          </div>
        </div>

        {/* Accountability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Accountability Events
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Traceable events within the research environment
              </p>
            </div>

            <button className="text-xs font-semibold text-slate-600 hover:text-slate-950">
              View audit trail
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {accountabilityEvents.map((event) => (
              <div
                key={`${event.title}-${event.time}`}
                className="flex gap-3 py-4 first:pt-0 last:pb-0"
              >
                <EventIcon type={event.type} />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {event.title}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {event.description}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom status */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400">Identity Layer</p>
              <p className="text-sm font-semibold text-slate-800">
                Operational
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Network className="h-4 w-4 text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400">AI Intelligence</p>
              <p className="text-sm font-semibold text-slate-800">
                Research Mode
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Activity className="h-4 w-4 text-violet-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400">Governance</p>
              <p className="text-sm font-semibold text-slate-800">
                Audit Enabled
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}