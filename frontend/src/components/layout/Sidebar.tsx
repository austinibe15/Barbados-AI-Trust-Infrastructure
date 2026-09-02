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
      {open && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-slate-200 bg-white transition-transform ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173b72] text-white">
              <ShieldCheck size={22} />
            </div>

            <div>
              <div className="text-lg font-bold text-[#173b72]">
                BATI
              </div>

              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                AI Trust Infrastructure
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          {navigation.map((group) => (
            <div
              key={group.section}
              className="mb-6"
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
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-[#edf3fb] text-[#173b72]"
                            : "text-slate-600 hover:bg-slate-50"
                        }`
                      }
                    >
                      <Icon size={17} />

                      <span>{item.label}</span>

                      {item.label === "Risk Centre" && (
                        <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
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
        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            <Settings size={17} />
            Settings
          </button>

          <div className="mt-3 rounded-xl bg-[#f5f8fc] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

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