import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JwtPayload {
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

interface AuthPanelProps {
  token: string | null;
  onTokenChange: (token: string | null) => void;
}

const AuthPanel = ({ token, onTokenChange }: AuthPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"token" | "login">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);

  const decoded = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const handleQuickLogin = useCallback(async () => {
    if (!email || !password) return;
    setLoading(true);

    // Simulate login — returns a fake JWT
    await new Promise((r) => setTimeout(r, 800));
    const now = Math.floor(Date.now() / 1000);
    const fakeJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ email, role: "user", iat: now, exp: now + 900 })
    )}.fake_signature`;
    onTokenChange(fakeJwt);
    setLoading(false);
    setExpanded(false);
  }, [email, password, onTokenChange]);

  const handleSetManualToken = useCallback(() => {
    if (manualToken.trim()) {
      onTokenChange(manualToken.trim());
      setExpanded(false);
    }
  }, [manualToken, onTokenChange]);

  const handleClear = useCallback(() => {
    onTokenChange(null);
    setManualToken("");
    setEmail("");
    setPassword("");
  }, [onTokenChange]);

  return (
    <div className="border-b border-border">
      {/* Collapsed bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2.5 flex items-center gap-3 text-left hover:bg-secondary/30 transition-colors"
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            token ? "bg-success" : "bg-muted-foreground/40"
          }`}
        />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Auth
        </span>
        {token ? (
          <span className="font-mono text-[10px] text-success truncate flex-1">
            Bearer ···{token.slice(-12)}
          </span>
        ) : (
          <span className="font-mono text-[10px] text-muted-foreground/50 flex-1">
            Non authentifié
          </span>
        )}
        <span className="text-[10px] text-muted-foreground">
          {expanded ? "▴" : "▾"}
        </span>
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1">
              {/* Mode tabs */}
              <div className="flex gap-0 mb-3 border border-border rounded overflow-hidden">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    mode === "login"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Login rapide
                </button>
                <button
                  onClick={() => setMode("token")}
                  className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors border-l border-border ${
                    mode === "token"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Token manuel
                </button>
              </div>

              {mode === "login" ? (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rabe@exemple.mg"
                    className="w-full bg-secondary border border-border rounded px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full bg-secondary border border-border rounded px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={handleQuickLogin}
                    disabled={loading || !email || !password}
                    className="w-full py-2 bg-primary text-primary-foreground font-mono text-xs font-medium rounded transition-all hover:brightness-110 disabled:opacity-40"
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1Ni..."
                    rows={3}
                    className="w-full bg-secondary border border-border rounded px-3 py-1.5 font-mono text-[10px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <button
                    onClick={handleSetManualToken}
                    disabled={!manualToken.trim()}
                    className="w-full py-2 bg-primary text-primary-foreground font-mono text-xs font-medium rounded transition-all hover:brightness-110 disabled:opacity-40"
                  >
                    Appliquer le token
                  </button>
                </div>
              )}

              {token && decoded && (
                <div className="mt-3 border border-border rounded bg-secondary/50 p-3">
                  <h4 className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Payload décodé
                  </h4>
                  <div className="space-y-1.5">
                    {decoded.email && (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">email</span>
                        <span className="font-mono text-[10px] text-foreground">{decoded.email}</span>
                      </div>
                    )}
                    {decoded.role && (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">role</span>
                        <span className="font-mono text-[10px] text-primary">{decoded.role}</span>
                      </div>
                    )}
                    {decoded.iat && (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">émis</span>
                        <span className="font-mono text-[10px] text-foreground">
                          {new Date(decoded.iat).toLocaleTimeString("fr-FR")}
                        </span>
                      </div>
                    )}
                    {decoded.exp && (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">expire</span>
                        <span className={`font-mono text-[10px] ${decoded.exp * 1000 < Date.now() ? "text-destructive" : "text-success"}`}>
                          {new Date(decoded.exp * 1000).toLocaleTimeString("fr-FR")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {token && (
                <button
                  onClick={handleClear}
                  className="w-full mt-2 py-1.5 font-mono text-[10px] text-destructive hover:text-destructive/80 transition-colors"
                >
                  Effacer le token
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPanel;
