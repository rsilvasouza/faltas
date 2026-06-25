import { FormEvent, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Notice } from "../components/Notice";
import { AuthService } from "../services/authService";
import { authStore } from "../store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (authStore.getToken()) {
    return <Navigate to="/" replace />;
  }

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const finishLogin = (accessToken: string) => {
    authStore.setToken(accessToken);
    navigate(redirectTo, { replace: true });
  };

  useEffect(() => {
    if (!googleClientId) return;

    if (window.google?.accounts.id) {
      setGoogleReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setGoogleReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setError("Nao foi possivel carregar o login do Google.");
    document.head.appendChild(script);
  }, [googleClientId]);

  useEffect(() => {
    if (!googleReady || !googleClientId || !googleButtonRef.current || !window.google?.accounts.id) {
      return;
    }

    googleButtonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        setError("");

        if (!response.credential) {
          setError("Nao foi possivel obter a credencial do Google.");
          return;
        }

        setGoogleLoading(true);
        try {
          const data = await AuthService.loginWithGoogle(response.credential);
          if (!data.access_token) {
            setError("Falha na autenticacao Google: token nao encontrado.");
            return;
          }
          finishLogin(data.access_token);
        } catch (err: any) {
          setError(err.response?.data?.message || "Nao foi possivel entrar com Google.");
        } finally {
          setGoogleLoading(false);
        }
      },
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: googleButtonRef.current.clientWidth || 384,
      text: "signin_with",
      shape: "rectangular",
    });
  }, [googleClientId, googleReady, navigate, redirectTo]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const data = await AuthService.login(email, password);
      if (!data.access_token) {
        setError("Falha na autenticação: token não encontrado.");
        return;
      }
      finishLogin(data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Minhas Listas</h1>
        {error ? <Notice tone="error" message={error} /> : null}

        <label>
          E-mail
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
          />
        </label>

        <button className="primary-button block" type="submit" disabled={loading}>
          {loading ? <LoaderCircle className="spin" size={18} /> : null}
          Entrar
        </button>

        <div className="login-divider">
          <span>ou</span>
        </div>

        {googleClientId ? (
          <div className="google-login-slot" aria-busy={googleLoading}>
            <div ref={googleButtonRef} />
            {googleLoading ? (
              <div className="google-loading">
                <LoaderCircle className="spin" size={18} />
                Entrando com Google...
              </div>
            ) : null}
          </div>
        ) : (
          <Notice tone="info" message="Configure VITE_GOOGLE_CLIENT_ID no .env para habilitar o login Google." />
        )}
      </form>
    </main>
  );
}
