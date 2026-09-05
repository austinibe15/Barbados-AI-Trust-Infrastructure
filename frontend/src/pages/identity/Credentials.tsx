import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  Plus,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from "lucide-react"

import {
  createCredential,
  getCredentials,
  revokeCredential,
  verifyCredential,
  type Credential,
} from "../../services/credentialApi"

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "verified":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"

    case "revoked":
      return "bg-red-50 text-red-700 border-red-200"

    case "active":
      return "bg-blue-50 text-blue-700 border-blue-200"

    default:
      return "bg-slate-50 text-slate-600 border-slate-200"
  }
}

function formatDate(value?: string | null) {
  if (!value) return "—"

  return new Date(value).toLocaleDateString()
}

export default function Credentials() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState<number | null>(null)

  async function loadCredentials() {
    try {
      setLoading(true)
      setError("")

      const data = await getCredentials()

      setCredentials(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load credentials"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCredentials()
  }, [])

  async function handleVerify(id: number) {
    try {
      setBusyId(id)
      setError("")

      const updated = await verifyCredential(id)

      setCredentials((current) =>
        current.map((credential) =>
          credential.id === id ? updated : credential
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Credential verification failed"
      )

      await loadCredentials()
    } finally {
      setBusyId(null)
    }
  }

  async function handleRevoke(id: number) {
    try {
      setBusyId(id)
      setError("")

      const updated = await revokeCredential(id)

      setCredentials((current) =>
        current.map((credential) =>
          credential.id === id ? updated : credential
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Credential revocation failed"
      )
    } finally {
      setBusyId(null)
    }
  }

  async function handleCreateDemoCredential() {
    try {
      setError("")

      const created = await createCredential({
        identity_id: 1,
        credential_type: "Research",
        issuer: "Barbados AI Trust Infrastructure",
        trust_level: "high",
      })

      setCredentials((current) => [created, ...current])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create credential"
      )
    }
  }

  const active = credentials.filter(
    (credential) =>
      credential.status.toLowerCase() === "active"
  ).length

  const verified = credentials.filter(
    (credential) =>
      credential.status.toLowerCase() === "verified"
  ).length

  const revoked = credentials.filter(
    (credential) =>
      credential.status.toLowerCase() === "revoked"
  ).length

  return (
    <div className="w-full overflow-x-hidden px-3 py-5 sm:px-6 sm:py-7 lg:px-8">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-7 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
            Identity
          </div>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            Credentials
          </h1>

          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Management and lifecycle monitoring of verifiable
            digital credentials.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <button
            type="button"
            onClick={() => void loadCredentials()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => void handleCreateDemoCredential()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Issue Credential
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 sm:px-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />

          <span className="min-w-0 break-words">
            {error}
          </span>
        </div>
      )}

      {/* Summary */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">
            Active
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {active}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">
            Verified
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {verified}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">
            Revoked
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {revoked}
          </p>
        </div>
      </div>

      {/* Credential registry */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Credential Registry
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Live records returned by the BATI credential service.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center px-5 py-14 text-sm text-slate-500 sm:py-16">
            Loading credentials...
          </div>
        ) : credentials.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center sm:py-16">
            <FileCheck2 className="h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No credentials found
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
              Issue a credential to begin the lifecycle workflow.
            </p>
          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {credentials.map((credential) => (

              <div
                key={credential.id}
                className="px-4 py-4 sm:px-5 sm:py-5"
              >

                {/* Credential information */}
                <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-all text-sm font-semibold text-slate-900">
                        {credential.credential_id}
                      </p>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusClass(
                          credential.status
                        )}`}
                      >
                        {credential.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {credential.credential_type} · Identity #
                      {credential.identity_id}
                    </p>

                    <p className="mt-1 break-words text-xs text-slate-400">
                      Issuer: {credential.issuer}
                    </p>

                  </div>

                  {/* Metadata + actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">

                    <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">

                      <div className="rounded-lg bg-slate-50 px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Trust
                        </p>

                        <p className="mt-0.5 text-xs font-semibold capitalize text-slate-700">
                          {credential.trust_level}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Issued
                        </p>

                        <p className="mt-0.5 text-xs text-slate-600">
                          {formatDate(credential.issued_at)}
                        </p>
                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">

                      {credential.status.toLowerCase() !== "revoked" && (
                        <button
                          type="button"
                          disabled={busyId === credential.id}
                          onClick={() =>
                            void handleVerify(credential.id)
                          }
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />

                          {busyId === credential.id
                            ? "Working..."
                            : "Verify"}
                        </button>
                      )}

                      {credential.status.toLowerCase() !== "revoked" && (
                        <button
                          type="button"
                          disabled={busyId === credential.id}
                          onClick={() =>
                            void handleRevoke(credential.id)
                          }
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />

                          {busyId === credential.id
                            ? "Working..."
                            : "Revoke"}
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backend status */}
      <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400 sm:mt-5 sm:items-center">
        <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />

        <span>
          Credential state is synchronized directly with the BATI
          FastAPI backend.
        </span>
      </div>
    </div>
  )
}