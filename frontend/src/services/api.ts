export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const error = await response.json();

      if (typeof error.detail === "string") {
        message = error.detail;
      }
    } catch {
      // Ignore JSON parsing failure.
    }

    throw new Error(message);
  }

  return response.json();
}