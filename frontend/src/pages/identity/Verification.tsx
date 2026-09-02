import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  getCredentials,
  verifyCredential,
  type Credential,
} from "../../services/credentialApi";

export default function Verification() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadCredentials() {
    try {
      setLoading(true);
      setError("");

      const data = await getCredentials();
      setCredentials(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  async function handleVerify(id: number) {
    try {
      setVerifyingId(id);
      setError("");
      setMessage("");

      await verifyCredential(id);

      setMessage(
        "Credential verification completed successfully."
      );

      await loadCredentials();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Credential verification failed."
      );
    } finally {
      setVerifyingId(null);
    }
  }

  const verifiedCount = credentials.filter(
    (credential) => credential.status === "verified"
  ).length;

  const activeCount = credentials.filter(
    (credential) => credential.status === "active"
  ).length;

  const revokedCount = credentials.filter(
    (credential) => credential.status === "revoked"
  ).length;

  return (
    <div className="px-4 py-7 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
            Identity
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Verification
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Experimental verification of identities and digital
            credentials using the BATI verification workflow.
          </p>
        </div>

        <button
          onClick={loadCredentials}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Research notice */}
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">
              Research prototype:
            </span>{" "}
            Verification is processed by the BATI backend. Successful
            and unsuccessful verification attempts generate corresponding
            risk and audit events.
          </p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <CircleAlert className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Total Credentials
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {credentials.length}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Verified
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {verifiedCount}
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Revoked
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {revokedCount}
          </p>
        </div>
      </div>

      {/* Verification registry */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Credential Verification
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select a credential to execute the backend verification
            workflow.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Loading credentials...
          </div>
        ) : credentials.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No credentials available for verification.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {credentials.map((credential) => {
              const isRevoked =
                credential.status === "revoked";

              const isVerified =
                credential.status === "verified";

              const isVerifying =
                verifyingId === credential.id;

              return (
                <div
                  key={credential.id}
                  className="px-5 py-5 hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <FileCheck2 className="h-5 w-5 text-slate-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {credential.credential_id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {credential.credential_type}
                          {" · "}
                          {credential.issuer}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Subject: {credential.subject}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Identity ID: {credential.identity_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                        {credential.trust_level}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${
                          isRevoked
                            ? "border-red-100 bg-red-50 text-red-700"
                            : isVerified
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border-blue-100 bg-blue-50 text-blue-700"
                        }`}
                      >
                        {credential.status}
                      </span>
                    </div>
                  </div>

                  {/* Verification result */}
                  {isVerified &&
                    credential.verified_at && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />

                        <span>
                          Credential verified at{" "}
                          {new Date(
                            credential.verified_at
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}

                  {isRevoked && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                      <XCircle className="h-4 w-4" />

                      <span>
                        This credential has been revoked and
                        cannot be verified.
                      </span>
                    </div>
                  )}

                  {/* Action */}
                  <div className="mt-4">
                    <button
                      disabled={isRevoked || isVerifying}
                      onClick={() =>
                        handleVerify(credential.id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />

                      {isVerifying
                        ? "Verifying..."
                        : isRevoked
                          ? "Verification blocked"
                          : "Verify Credential"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Backend workflow explanation */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Verification Workflow
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            ["01", "Credential", "Select credential"],
            ["02", "Validation", "Check status and expiry"],
            ["03", "Risk Engine", "Assess verification event"],
            ["04", "Audit", "Record accountability event"],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-[10px] font-bold tracking-wider text-slate-400">
                {number}
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Active credentials available: {activeCount}
      </div>
    </div>
  );
}