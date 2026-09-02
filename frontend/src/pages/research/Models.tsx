
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
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Research
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Models
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Registry and investigation environment for AI models evaluated
          within the BATI research programme.
        </p>
      </div>

      {/* Research notice */}
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">Research mode:</span>{" "}
            The model registry interface is prepared for model metadata,
            evaluation results and experiment relationships. A dedicated
            model-registry API is not currently exposed by the BATI backend.
          </p>
        </div>
      </div>

      {/* Model registry status */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <Cpu className="h-5 w-5 text-violet-600" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Model Registry
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Ready
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Research model catalogue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Database className="h-5 w-5 text-blue-600" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Metadata
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Prepared
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Architecture and configuration records
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Experiments
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Linked
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Model-to-experiment relationship
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Trust Evaluation
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950">
            Research
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Trustworthiness evaluation context
          </p>
        </div>
      </div>

      {/* Model registry */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <BrainCircuit className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              AI Model Registry
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Models evaluated or intended for evaluation within the BATI
              research environment.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
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

      {/* Planned model metadata */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Model Record Structure
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Planned research metadata represented by the model registry.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-800">
              Model Identity
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Name, version, provider and model type.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-800">
              Evaluation
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Performance, risk and trustworthiness evaluation results.
            </p>
          </div>

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
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Model Research Interface Operational
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Waiting for the dedicated research model API to be exposed by
              the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
