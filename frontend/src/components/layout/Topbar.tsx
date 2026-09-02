import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  searchInfrastructure,
  type SearchResult,
} from "../../services/searchApi";

interface TopbarProps {
  onMenuClick?: () => void;
}

function resultLabel(type: SearchResult["type"]) {
  switch (type) {
    case "identity":
      return "Identity";

    case "credential":
      return "Credential";

    case "risk":
      return "Risk Event";

    case "audit":
      return "Audit Event";

    default:
      return "Result";
  }
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      setError("");
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        setOpen(true);

        const response = await searchInfrastructure(trimmed, 10);

        setResults(response.items);
      } catch (err) {
        setResults([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to search BATI infrastructure",
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  function handleResultClick(result: SearchResult) {
    setOpen(false);
    setQuery("");

    navigate(result.route);
  }

  function clearSearch() {
    setQuery("");
    setResults([]);
    setError("");
    setOpen(false);
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-3 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div
          ref={searchRef}
          className="relative w-full max-w-xl"
        >
          <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-slate-300 focus-within:bg-white">
            <Search
              size={16}
              className="shrink-0 text-slate-400"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                if (query.trim()) {
                  setOpen(true);
                }
              }}
              placeholder="Search infrastructure..."
              className="ml-2 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              aria-label="Search BATI infrastructure"
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="ml-2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search results */}
          {open && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              {loading && (
                <div className="px-4 py-4 text-sm text-slate-400">
                  Searching BATI infrastructure...
                </div>
              )}

              {!loading && error && (
                <div className="px-4 py-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                results.length === 0 && (
                  <div className="px-4 py-5">
                    <p className="text-sm font-medium text-slate-700">
                      No results found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try an identity, credential, risk event, audit event,
                      institution, or reference number.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                results.length > 0 && (
                  <div className="max-h-[420px] overflow-y-auto py-2">
                    {results.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        type="button"
                        onClick={() => handleResultClick(result)}
                        className="block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {result.title}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {result.description}
                            </p>

                            <p className="mt-1 truncate text-[11px] text-slate-400">
                              {result.reference}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {resultLabel(result.type)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* User / research identity */}
      <div className="ml-4 hidden items-center gap-3 sm:flex">
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-700">
            Research Administrator
          </p>

          <p className="text-[11px] text-slate-400">
            NYCAR Research
          </p>
        </div>
      </div>
    </header>
  );
}