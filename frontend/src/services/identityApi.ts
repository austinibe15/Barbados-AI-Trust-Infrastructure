
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

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
      // Keep default message.
    }

    throw new Error(message)
  }

  return response.json()
}

// ---------------------------------------------------------
// IDENTITY TYPES
// ---------------------------------------------------------

export interface Identity {
  id: number
  identity_id: string
  full_name: string
  email: string
  institution: string
  role: string
  status: string
  trust_level?: string
  biometric_verified?: boolean
  notes?: string
}

export interface IdentityCreate {
  full_name: string
  email: string
  identity_type?: string
  institution: string
  role?: string
  status?: string
  trust_level?: string
  biometric_verified?: boolean
  notes?: string
}

export interface IdentityUpdate {
  full_name?: string
  email?: string
  institution?: string
  role?: string
  status?: string
  trust_level?: string
  biometric_verified?: boolean
  notes?: string
}

// ---------------------------------------------------------
// GET ALL IDENTITIES
// ---------------------------------------------------------

export async function getIdentities(): Promise<Identity[]> {
  const data = await apiRequest<{
    count: number
    items: Identity[]
  }>(`${API_BASE_URL}/api/identities`)

  return data.items
}

// ---------------------------------------------------------
// GET SINGLE IDENTITY
// ---------------------------------------------------------

export async function getIdentity(
  id: number
): Promise<Identity> {
  return apiRequest<Identity>(
    `${API_BASE_URL}/api/identities/${id}`
  )
}

// ---------------------------------------------------------
// CREATE IDENTITY
// ---------------------------------------------------------

export async function createIdentity(
  identity: IdentityCreate
): Promise<Identity> {
  return apiRequest<Identity>(
    `${API_BASE_URL}/api/identities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(identity),
    }
  )
}

// ---------------------------------------------------------
// UPDATE IDENTITY
// ---------------------------------------------------------

export async function updateIdentity(
  id: number,
  identity: IdentityUpdate
): Promise<Identity> {
  return apiRequest<Identity>(
    `${API_BASE_URL}/api/identities/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(identity),
    }
  )
}

// ---------------------------------------------------------
// DELETE IDENTITY
// ---------------------------------------------------------

export async function deleteIdentity(
  id: number
): Promise<{ message?: string }> {
  return apiRequest<{ message?: string }>(
    `${API_BASE_URL}/api/identities/${id}`,
    {
      method: "DELETE",
    }
  )
}

