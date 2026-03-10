import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ApiEndpoint, HttpMethod } from "@/lib/api-endpoints";

const methodBadgeColors: Record<HttpMethod, string> = {
  GET: "bg-success/15 text-success border-success/30",
  POST: "bg-accent/15 text-accent border-accent/30",
  PUT: "bg-primary/15 text-primary border-primary/30",
  DELETE: "bg-destructive/15 text-destructive border-destructive/30",
};

type RequestState = "idle" | "sending" | "success" | "error";

interface RequestPanelProps {
  endpoint: ApiEndpoint | null;
  token: string | null;
}

const RequestPanel = ({ endpoint, token }: RequestPanelProps) => {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [response, setResponse] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const handleParamChange = useCallback((name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSend = useCallback(async () => {
    if (!endpoint) return;
    setRequestState("sending");
    setResponse(null);

    // Simulate API call with delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    // Simulate response
    setStatusCode(200);
    setResponse(endpoint.exampleResponse);
    setRequestState("success");

    // Reset to idle after flash
    setTimeout(() => setRequestState("idle"), 600);
  }, [endpoint]);

  if (!endpoint) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Sélectionnez un endpoint
          </p>
          <p className="font-sans text-xs text-muted-foreground/60 mt-2">
            Choisissez une route dans le panneau de gauche
          </p>
        </div>
      </div>
    );
  }

  const bodyParams = endpoint.params.filter((p) => p.type === "body");
  const queryParams = endpoint.params.filter((p) => p.type === "query");
  const pathParams = endpoint.params.filter((p) => p.type === "path");

  const lineColor =
    requestState === "sending"
      ? "bg-accent"
      : requestState === "success"
      ? "bg-success"
      : requestState === "error"
      ? "bg-destructive"
      : "";

  return (
    <div className="h-full flex flex-col relative">
      {/* Signal Line Animation */}
      <AnimatePresence>
        {requestState !== "idle" && (
          <>
            {/* Horizontal line */}
            <motion.div
              className={`absolute top-[52px] left-0 h-[2px] ${lineColor} z-20 ${
                requestState === "sending" ? "animate-pulse-amber" : ""
              }`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Vertical line */}
            <motion.div
              className={`absolute top-[52px] right-0 w-[2px] ${lineColor} z-20 ${
                requestState === "sending" ? "animate-pulse-amber" : ""
              }`}
              initial={{ height: 0 }}
              animate={{ height: "50%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-3 shrink-0">
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
            methodBadgeColors[endpoint.method]
          }`}
        >
          {endpoint.method}
        </span>
        <span className="font-mono text-sm text-foreground">{endpoint.path}</span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground border border-border px-2 py-0.5 rounded">
          {endpoint.auth}
        </span>
      </div>

      {/* Request Zone */}
      <div
        className={`flex-1 overflow-y-auto border-b border-border transition-opacity duration-300 ${
          requestState === "sending" ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <div className="px-6 py-4">
          <p className="text-xs text-muted-foreground font-sans mb-4">
            {endpoint.description}
          </p>

          {/* Auto-injected Bearer header */}
          {endpoint.auth !== "Public" && (
            <div className="mb-5">
              <h3 className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Authorization
              </h3>
              <div className="flex items-center gap-2 bg-secondary border border-border rounded px-3 py-2">
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">Bearer</span>
                {token ? (
                  <span className="font-mono text-[10px] text-success truncate">
                    ···{token.slice(-20)}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-destructive">
                    Token manquant — authentifiez-vous
                  </span>
                )}
              </div>
            </div>
          )}

          {pathParams.length > 0 && (
            <ParamSection
              title="Paramètres de chemin"
              params={pathParams}
              values={paramValues}
              onChange={handleParamChange}
            />
          )}

          {queryParams.length > 0 && (
            <ParamSection
              title="Paramètres de requête"
              params={queryParams}
              values={paramValues}
              onChange={handleParamChange}
            />
          )}

          {bodyParams.length > 0 && (
            <ParamSection
              title="Corps de la requête"
              params={bodyParams}
              values={paramValues}
              onChange={handleParamChange}
            />
          )}

          {endpoint.params.length === 0 && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              Aucun paramètre requis
            </p>
          )}
        </div>
      </div>

      {/* Send Button */}
      <div className="px-6 py-3 border-b border-border shrink-0">
        <button
          onClick={handleSend}
          disabled={requestState === "sending"}
          className="w-full py-2.5 bg-primary text-primary-foreground font-mono text-sm font-medium rounded transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {requestState === "sending" ? "Envoi en cours..." : "Envoyer"}
        </button>
      </div>

      {/* Response Zone */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {response ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="px-6 py-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground">
                  Réponse
                </span>
                {statusCode && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      statusCode < 300
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-destructive/15 text-destructive border-destructive/30"
                    }`}
                  >
                    {statusCode}
                  </span>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                  }}
                  className="ml-auto text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors border border-border px-2 py-0.5 rounded"
                >
                  copier
                </button>
              </div>
              <pre className="font-mono text-xs text-foreground bg-secondary/50 border border-border rounded p-4 overflow-x-auto whitespace-pre-wrap">
                {response}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="h-full flex items-center justify-center"
            >
              <p className="font-mono text-xs text-muted-foreground/40">
                La réponse apparaîtra ici
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ParamSectionProps {
  title: string;
  params: ApiEndpoint["params"];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const ParamSection = ({ title, params, values, onChange }: ParamSectionProps) => (
  <div className="mb-5">
    <h3 className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="space-y-2">
      {params.map((param) => (
        <div key={param.name} className="flex items-start gap-3">
          <div className="w-32 shrink-0 pt-2">
            <span className="font-mono text-xs text-foreground">
              {param.name}
            </span>
            {param.required && (
              <span className="text-destructive text-[10px] ml-1">*</span>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {param.description}
            </p>
          </div>
          <input
            type="text"
            value={values[param.name] ?? ""}
            onChange={(e) => onChange(param.name, e.target.value)}
            placeholder={param.example ?? ""}
            className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      ))}
    </div>
  </div>
);

export default RequestPanel;
