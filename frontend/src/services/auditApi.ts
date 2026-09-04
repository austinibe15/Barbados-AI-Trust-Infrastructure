
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

export interface AuditLog {
  id: number
  event_id: string
  event_type: string
  entity_type: string
  entity_id: string
  actor_identity_id?: number | null
  action: string
  status: string
  description?: string | null
  metadata_json?: string | null
  timestamp?: string | null
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch(`${API_BASE_URL}/api/audit`)

  if (!response.ok) {
    throw new Error("Failed to load audit trail")
  }

  const data = await response.json()

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.items)) {
    return data.items
  }

  throw new Error("Audit API returned an invalid response")
}

