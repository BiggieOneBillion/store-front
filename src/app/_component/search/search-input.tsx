"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { filterProducts } from "@/services/api/product";
import { useRouter } from "next/navigation";
import { Product } from "@/app/account/dashboard/product-management/_component/columns";
import { Badge } from "@/components/ui/badge";

type Props = {
  className?: string;
};

export default function SearchInput({ className }: Props) {
  const [query, setQuery] = React.useState("");
  const debounced = useDebounce(query, 1000);
  const [results, setResults] = React.useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const route = useRouter();

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const q = debounced.trim();
      if (q.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      const res = await filterProducts({ name: q });
      //   // console.log("search res", res);
      if (!cancelled) {
        setResults([res]);
        setOpen(true);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={containerRef} className={["relative", className ?? ""].join(" ")}>
      <div className="flex items-center gap-1 border rounded-md px-2 py-1y bg-white">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search for products..."
          className="w-full outline-none placeholder:text-sm"
          aria-label="Search"
          autoComplete="off"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Search size={17} />
        </Button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg overflow-hidden">
          {/* Loading row */}
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching…
            </div>
          )}

          {/* No results message */}
          {!loading && results.length === 0 && debounced.trim().length >= 2 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No products found.
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <ul className="max-h-72 overflow-auto">
              {results.map((p, idx) => (
                <li
                  key={`${p.inventory.sku}-${idx}`}
                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    route.push(
                      `/product/${p.category.name}-${p.id}/${p.name.replaceAll(
                        " ",
                        "-"
                      )}-${p.category.id}`
                    );
                    // TODO: Navigate to product page
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {/* <span className="text-xs">Category</span> •{" "} */}
                        <Badge variant={"secondary"}>{p.category.name}</Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">
                        ₦{p.price.toLocaleString()}
                      </p>
                      {p.compareAtPrice && (
                        <p className="text-[11px] line-through text-muted-foreground">
                          ₦{p.compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
