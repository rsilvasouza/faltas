import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Notice } from "../components/Notice";
import { ListaService } from "../services/listaService";
import type { Lista } from "../services/types";
import { formatarData } from "../utils/formatters";

type Filter = "aberto" | "fechado";

export function HomePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("aberto");
  const [listas, setListas] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListas = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await ListaService.getAll();
      setListas(data ?? []);
    } catch {
      setError("Erro ao carregar listas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchListas();
  }, [fetchListas]);

  const filteredData = useMemo(
    () =>
      listas.filter((item) => {
        const fechada = item.fechamento !== null && item.fechamento !== undefined;
        return filter === "fechado" ? fechada : !fechada;
      }),
    [filter, listas],
  );

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Minhas Listas</h1>
          <p>{filter === "aberto" ? "Listas em andamento" : "Listas finalizadas"}</p>
        </div>
        <div className="header-actions">
          <button className="icon-button subtle" type="button" onClick={fetchListas} aria-label="Atualizar">
            <RefreshCw size={20} />
          </button>
          <button className="icon-button" type="button" onClick={() => navigate("/listas/nova")} aria-label="Nova lista">
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="segmented-control" role="tablist" aria-label="Filtrar listas">
        <button className={filter === "aberto" ? "active" : ""} type="button" onClick={() => setFilter("aberto")}>
          Abertas
        </button>
        <button className={filter === "fechado" ? "active" : ""} type="button" onClick={() => setFilter("fechado")}>
          Fechadas
        </button>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      {loading ? (
        <div className="loading-state">Carregando listas...</div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">Nenhuma lista encontrada.</div>
      ) : (
        <div className="list-card-stack">
          {filteredData.map((item) => {
            const fechada = item.fechamento !== null && item.fechamento !== undefined;
            return (
              <button className="list-card" key={item.id} type="button" onClick={() => navigate(`/listas/${item.id}`, { state: { nome: item.nome } })}>
                <span>
                  <strong>{item.nome}</strong>
                  <small>{fechada ? `Finalizada em: ${formatarData(item.fechamento)}` : "Aberta"}</small>
                </span>
                {fechada ? <CheckCircle2 className="success-icon" size={24} /> : <ChevronRight className="primary-icon" size={24} />}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
