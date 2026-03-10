import { useState } from "react";
import { endpointGroups, type ApiEndpoint, type HttpMethod } from "@/lib/api-endpoints";

const methodColors: Record<HttpMethod, string> = {
  GET: "text-success",
  POST: "text-accent",
  PUT: "text-primary",
  DELETE: "text-destructive",
};

interface EndpointListProps {
  selectedId: string | null;
  onSelect: (endpoint: ApiEndpoint) => void;
}

const EndpointList = ({ selectedId, onSelect }: EndpointListProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(endpointGroups.map((g) => g.name))
  );

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <h1 className="font-mono text-sm font-bold tracking-wider text-foreground uppercase">
          StreamMG
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          API Explorer
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {endpointGroups.map((group) => (
          <div key={group.name}>
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full px-5 py-2 flex items-center justify-between text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <span>{group.name}</span>
              <span className="text-[10px]">
                {expandedGroups.has(group.name) ? "▾" : "▸"}
              </span>
            </button>

            {expandedGroups.has(group.name) && (
              <div className="pb-1">
                {group.endpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => onSelect(ep)}
                    className={`w-full px-5 py-2 flex items-center gap-3 text-left transition-colors border-l-2 ${
                      selectedId === ep.id
                        ? "border-l-primary bg-secondary"
                        : "border-l-transparent hover:bg-secondary/50"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold w-10 shrink-0 ${methodColors[ep.method]}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs text-foreground truncate">
                      {ep.path}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground font-mono">
          Base: api.streamMG.railway.app/api
        </p>
      </div>
    </div>
  );
};

export default EndpointList;
