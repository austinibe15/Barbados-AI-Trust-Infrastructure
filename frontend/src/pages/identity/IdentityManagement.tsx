import { useEffect, useState } from "react";
import {
  createIdentity,
  getIdentities,
  type Identity,
} from "../../services/identityApi";

export default function IdentityManagement() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadIdentities() {
    try {
      setLoading(true);
      setError("");

      const data = await getIdentities();

      setIdentities(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load identities"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIdentities();
  }, []);

  async function handleCreateIdentity() {
    try {
      setError("");

      const identity = await createIdentity({
        full_name: "BATI Research Participant",
        email: `participant-${Date.now()}@bati.local`,
        institution: "Barbados AI Trust Infrastructure",
        role: "Researcher",
      });

      setIdentities((current) => [
        identity,
        ...current,
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create identity"
      );
    }
  }

  return (
    <div className="w-full overflow-x-hidden px-3 py-5 sm:px-6 sm:py-7 lg:px-8">

      {/* Header */}
      <div className="mb-6 sm:mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Identity
        </div>

        <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
          Identity Management
        </h1>

        <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
          Management of trusted digital identities within the
          BATI research infrastructure.
        </p>
      </div>

      {/* Create button */}
      <div className="mb-5 flex">
        <button
          type="button"
          onClick={handleCreateIdentity}
          className="min-h-11 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
        >
          Create Research Identity
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 sm:px-4">
          {error}
        </div>
      )}

      {/* Registered identities */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
          <h2 className="font-semibold text-slate-900">
            Registered Identities
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Live data from the BATI identity service.
          </p>
        </div>

        {loading ? (
          <div className="p-5 text-sm text-slate-500 sm:p-6">
            Loading identities...
          </div>
        ) : identities.length === 0 ? (
          <div className="p-5 text-sm text-slate-500 sm:p-6">
            No identities registered.
          </div>
        ) : (
          <>
            {/* ------------------------------------------------ */}
            {/* MOBILE VIEW                                      */}
            {/* ------------------------------------------------ */}
            <div className="divide-y divide-slate-100 sm:hidden">
              {identities.map((identity) => (
                <div
                  key={identity.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">
                        {identity.full_name}
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        {identity.identity_id}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-emerald-700">
                      {identity.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Institution
                      </p>

                      <p className="mt-1 break-words text-sm text-slate-600">
                        {identity.institution || "—"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Role
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {identity.role || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Trust
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-blue-700">
                          {identity.trust_level || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ------------------------------------------------ */}
            {/* DESKTOP / TABLET VIEW                            */}
            {/* ------------------------------------------------ */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">
                      Identity
                    </th>

                    <th className="px-5 py-3">
                      Institution
                    </th>

                    <th className="px-5 py-3">
                      Role
                    </th>

                    <th className="px-5 py-3">
                      Trust
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {identities.map((identity) => (
                    <tr key={identity.id}>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {identity.full_name}
                        </div>

                        <div className="text-xs text-slate-400">
                          {identity.identity_id}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {identity.institution || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {identity.role || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                          {identity.trust_level || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                          {identity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}