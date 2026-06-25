import { LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth";

export function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.setToken(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => navigate("/")}>
          Minhas Listas
        </button>
        <button className="icon-text-button subtle" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
