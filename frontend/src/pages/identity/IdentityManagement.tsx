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
      const identity = await createIdentity({
        full_name: "BATI Research Participant",
        email: `participant-${Date.now()}@bati.local`,
        institution: "Barbados AI Trust Infrastructure",
        role: "Researcher",
        status: "active",
        trust_level: "medium",
        biometric_verified: false,
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
    <div className="px-4 py-7 sm:px-6 lg:px-8">

      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          Identity
        </div>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Identity Management
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Management of trusted digital identities within the
          BATI research infrastructure.
        </p>
      </div>

      <div className="mb-5 flex justify-end">
        <button
          onClick={handleCreateIdentity}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Create Research Identity
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Registered Identities
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Live data from the BATI identity service.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading identities...
          </div>
        ) : identities.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No identities registered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Identity</th>
                  <th className="px-5 py-3">Institution</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Trust</th>
                  <th className="px-5 py-3">Status</th>
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
                      {identity.institution}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {identity.role}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {identity.trust_level || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {identity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}