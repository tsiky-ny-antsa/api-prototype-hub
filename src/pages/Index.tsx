import { useState } from "react";
import EndpointList from "@/components/EndpointList";
import RequestPanel from "@/components/RequestPanel";
import type { ApiEndpoint } from "@/lib/api-endpoints";

const Index = () => {
  const [selected, setSelected] = useState<ApiEndpoint | null>(null);

  return (
    <div className="h-full flex">
      {/* Left Panel — Console de commande (35%) */}
      <aside className="w-[35%] shrink-0 border-r border-border bg-card overflow-hidden">
        <EndpointList
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </aside>

      {/* Right Panel — Scène (65%) */}
      <main className="flex-1 overflow-hidden">
        <RequestPanel endpoint={selected} />
      </main>
    </div>
  );
};

export default Index;
