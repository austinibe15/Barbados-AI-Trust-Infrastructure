
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

export interface RiskEvent {
  id: number
  event_reference: string
  event_type: string
  risk_score: number
  risk_classification: string
  status: string
  explanation: string
  credential_status?: string | null
  identity_id?: number | null
  created_at?: string | null
}

export interface RiskResponse {
  count: number
  items: RiskEvent[]
}

export async function getRiskEvents(): Promise<RiskEvent[]> {
  const response = await fetch(`${API_BASE_URL}/api/risk`)

  if (!response.ok) {
    throw new Error("Failed to load risk events")
  }

  const data: RiskResponse = await response.json()

  return data.items
}

