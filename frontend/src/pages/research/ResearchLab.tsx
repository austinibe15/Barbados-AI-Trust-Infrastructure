
import {
  Activity,
  Beaker,
  BrainCircuit,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

export default function ResearchLab() {
  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mb-5 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          Research
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Research Lab
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Experimental environment for investigating trustworthy artificial
          intelligence infrastructure, evaluation methods, models and
          governance mechanisms.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

          <p className="min-w-0 text-xs leading-5 text-violet-800">
            <span className="font-semibold">Research environment:</span>{" "}
            The laboratory interface is active. Research datasets, models,
            experiments and evaluation results will be connected as their
            corresponding backend services become available.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <Beaker className="h-5 w-5 text-violet-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Research Workspace
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Active
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Experimental research environment
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <BrainCircuit className="h-5 w-5 text-blue-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            AI Models
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Registry
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Model investigation and tracking
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Experiments
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Ready
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Experimental runs and observations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Evaluation
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Research Mode
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Trustworthiness and model evaluation
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            BATI Research Workflow
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Experimental workflow supporting trustworthy AI research
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              01
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              Models
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Register and investigate AI models used in the research
              programme.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              02
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              Experiments
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Execute controlled research experiments and record observations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              03
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              Evaluation
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Evaluate model behaviour, performance and trust-related
              characteristics.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              04
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              Evidence
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Preserve research observations for explainability,
              accountability and governance.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:mt-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Research Interface Operational
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Research-specific backend APIs are not currently exposed by the
              BATI backend service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
