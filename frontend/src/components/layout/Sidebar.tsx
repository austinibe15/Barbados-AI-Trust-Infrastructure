import {
  Activity,
  BarChart3,
  Brain,
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Network,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"

import { NavLink } from "react-router-dom"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    section: "Identity",
    items: [
      {
        label: "Identity Management",
        path: "/identity",
        icon: Fingerprint,
      },
      {
        label: "Credentials",
        path: "/identity/credentials",
        icon: FileCheck2,
      },
      {
        label: "Verification",
        path: "/identity/verification",
        icon: ShieldCheck,
      },
    ],
  },

  {
    section: "AI Intelligence",
    items: [
      {
        label: "Risk Centre",
        path: "/intelligence/risk-centre",
        icon: Gauge,
      },
      {
        label: "Anomaly Detection",
        path: "/intelligence/anomaly-detection",
        icon: Activity,
      },
      {
        label: "Explainable AI",
        path: "/intelligence/explainable-ai",
        icon: Brain,
      },
    ],
  },

  {
    section: "Governance",
    items: [
      {
        label: "Compliance",
        path: "/governance/compliance",
        icon: ClipboardCheck,
      },
      {
        label: "Accountability",
        path: "/governance/accountability",
        icon: Network,
      },
      {
        label: "Audit Trail",
        path: "/governance/audit-trail",
        icon: LockKeyhole,
      },
    ],
  },

  {
    section: "Institutions",
    items: [
      {
        label: "Institutions",
        path: "/institutions",
        icon: Users,
      },
      {
        label: "Access Control",
        path: "/institutions/access-control",
        icon: ShieldCheck,
      },
    ],
  },

  {
    section: "Research",
    items: [
      {
        label: "Research Lab",
        path: "/research",
        icon: BarChart3,
      },
      {
        label: "Models",
        path: "/research/models",
        icon: Brain,
      },
      {
        label: "Experiments",
        path: "/research/experiments",
        icon: Activity,
      },
      {
        label: "Evaluation",
        path: "/research/evaluation",
        icon: ShieldCheck,
      },
    ],
  },
]

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[min(86vw,320px)] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out lg:h-screen lg:w-[270px] lg:shadow-none ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex min-h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173b72] text-white">
              <ShieldCheck size={22} />
            </div>

            <div className="min-w-0">
              <div className="text-lg font-bold text-[#173b72]">
                BATI
              </div>

              <div className="truncate text-[10px] uppercase tracking-wider text-slate-400">
                AI Trust Infrastructure
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
          {navigation.map((group) => (
            <div
              key={group.section}
              className="mb-6 last:mb-2"
            >
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.section}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-[#edf3fb] text-[#173b72]"
                            : "text-slate-600 hover:bg-slate-50"
                        }`
                      }
                    >
                      <Icon
                        size={18}
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>

                      {item.label === "Risk Centre" && (
                        <span className="ml-auto shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          18
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 p-3 sm:p-4">
          <button
            type="button"
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            <Settings
              size={18}
              className="shrink-0"
            />

            Settings
          </button>

          <div className="mt-3 rounded-xl bg-[#f5f8fc] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-slate-700">
                System operational
              </span>
            </div>

            <div className="mt-1 text-[10px] text-slate-400">
              BATI research environment
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}