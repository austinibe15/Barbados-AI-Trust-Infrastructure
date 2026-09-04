
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

export interface SearchResult {
  type: "identity" | "credential" | "risk" | "audit";
  id: number;
  reference: string;
  title: string;
  description: string;
  route: string;
}

export interface SearchResponse {
  query: string;
  count: number;
  items: SearchResult[];
}

export async function searchInfrastructure(
  query: string,
  limit = 10,
): Promise<SearchResponse> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      query: "",
      count: 0,
      items: [],
    };
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    limit: String(limit),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Search infrastructure request failed");
  }

  return response.json();
}

