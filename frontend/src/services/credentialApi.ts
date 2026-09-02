
const API_BASE_URL = "http://127.0.0.1:8000"

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const error = await response.json()

      if (error?.detail) {
        message = error.detail
      }
    } catch {
      // Keep default error.
    }

    throw new Error(message)
  }

  return response.json()
}

export interface Credential {
  id: number
  credential_id: string
  identity_id: number
  credential_type: string
  issuer: string
  subject: string
  status: string
  trust_level: string
  issued_at: string
  expires_at?: string | null
  verified_at?: string | null
  revoked_at?: string | null
  metadata_json?: string | null
}

export interface CredentialCreate {
  identity_id: number
  credential_type: string
  issuer?: string
  trust_level?: string
  expires_at?: string | null
  metadata_json?: string | null
}

export interface CredentialListResponse {
  count: number
  items: Credential[]
}

export async function getCredentials(): Promise<Credential[]> {
  const data = await apiRequest<CredentialListResponse>(
    `${API_BASE_URL}/api/credentials`
  )

  return data.items
}

export async function getCredential(
  id: number
): Promise<Credential> {
  return apiRequest<Credential>(
    `${API_BASE_URL}/api/credentials/${id}`
  )
}

export async function createCredential(
  credential: CredentialCreate
): Promise<Credential> {
  return apiRequest<Credential>(
    `${API_BASE_URL}/api/credentials`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }
  )
}

export async function verifyCredential(
  id: number
): Promise<Credential> {
  return apiRequest<Credential>(
    `${API_BASE_URL}/api/credentials/${id}/verify`,
    {
      method: "POST",
    }
  )
}

export async function revokeCredential(
  id: number
): Promise<Credential> {
  return apiRequest<Credential>(
    `${API_BASE_URL}/api/credentials/${id}/revoke`,
    {
      method: "POST",
    }
  )
}
