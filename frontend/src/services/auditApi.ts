
const API_BASE_URL = "http://127.0.0.1:8000"

export interface AuditEvent {
  id: number
  event_id: string
  event_type: string
  entity_type: string
  entity_id: string
  actor_identity_id?: number | null
  action: string
  status: string
  description: string
  metadata_json?: string | null
  created_at?: string | null
}

export async function getAuditEvents(): Promise<AuditEvent[]> {
  const response = await fetch(`${API_BASE_URL}/api/audit`)

  if (!response.ok) {
    throw new Error("Failed to load audit trail")
  }

  return response.json()
}
