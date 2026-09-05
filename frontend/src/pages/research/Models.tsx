
import {
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Database,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

export default function Models() {
  return (
    <div className="min-h-full w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55749c] sm:text-xs">
          Research
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          Models
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Registry and investigation environment for AI models evaluated
          within the BATI research programme.
        </p>
      </div>

      {/* Research Notice */}
      <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 sm:mb-6 sm:px-4">
        <div className="flex items-start gap-3">
          <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="min-w-0 text-xs leading-5 text-blue-800">
            <span className="font-semibold">Research mode:</span>{" "}
            The model registry interface is prepared for model metadata,
            evaluation results and experiment relationships. A dedicated
            model-registry API is not currently exposed by the BATI backend.
          </p>
        </div>
      </div>

      {/* Model Registry Status */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {/* Model Registry */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <Cpu className="h-5 w-5 text-violet-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Model Registry
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Ready
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Research model catalogue
          </p>
        </div>

        {/* Metadata */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Database className="h-5 w-5 text-blue-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Metadata
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Prepared
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Architecture and configuration records
          </p>
        </div>

        {/* Experiments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Experiments
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Linked
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Model-to-experiment relationship
          </p>
        </div>

        {/* Trust Evaluation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            Trust Evaluation
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Research
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Trustworthiness evaluation context
          </p>
        </div>
      </div>

      {/* Model Registry */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 flex items-start gap-3 sm:mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <BrainCircuit className="h-5 w-5 text-slate-700" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              AI Model Registry
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Models evaluated or intended for evaluation within the BATI
              research environment.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center sm:px-5 sm:py-10">
          <Cpu className="mx-auto h-8 w-8 text-slate-300" />

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No model records available
          </p>

          <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-400">
            The BATI backend currently does not expose a model-registry
            endpoint. Model records will appear here when the research model
            service is connected.
          </p>
        </div>
      </div>

      {/* Planned Model Metadata */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Model Record Structure
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Planned research metadata represented by the model registry.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 md:grid-cols-3">
          {/* Model Identity */}
          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-800">
              Model Identity
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Name, version, provider and model type.
            </p>
          </div>

          {/* Evaluation */}
          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-800">
              Evaluation
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Performance, risk and trustworthiness evaluation results.
            </p>
          </div>

          {/* Governance */}
          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-800">
              Governance
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Research status, accountability and governance evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:mt-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Model Research Interface Operational
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Waiting for the dedicated research model API to be exposed by
              the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


