import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CheckCheck, FileText, Lock, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ItemDetailsDialog } from "../components/ItemDetailsDialog";
import { Notice } from "../components/Notice";
import { ListaItemService } from "../services/listaItemService";
import { ListaService } from "../services/listaService";
import type { ListaItem } from "../services/types";

export function ListDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [itens, setItens] = useState<ListaItem[]>([]);
  const [nomeLista, setNomeLista] = useState((location.state as { nome?: string } | null)?.nome || "Lista");
  const [dataFechamento, setDataFechamento] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailsItem, setDetailsItem] = useState<ListaItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ListaItem | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);

  const fechada = Boolean(dataFechamento);

  const fetchDados = useCallback(async () => {
    if (!id) return;
    setError("");
    setLoading(true);
    try {
      const [dataItens, detalhesLista] = await Promise.all([
        ListaItemService.getByLista(id),
        ListaService.getById(id),
      ]);
      setItens(dataItens);
      setNomeLista(detalhesLista.nome);
      setDataFechamento(detalhesLista.fechamento ? String(detalhesLista.fechamento) : null);
    } catch {
      setError("Erro ao carregar dados da lista.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDados();
  }, [fetchDados]);

  const itensAgrupados = useMemo(() => {
    return itens.reduce<Record<string, ListaItem[]>>((acc, item) => {
      const grupoNome = item.grupo?.nome || "Sem Grupo";
      acc[grupoNome] = acc[grupoNome] || [];
      acc[grupoNome].push(item);
      return acc;
    }, {});
  }, [itens]);

  const toggleComprado = async (item: ListaItem) => {
    if (fechada) return;
    try {
      const novoStatus = !item.comprado;
      await ListaItemService.updateStatus(item.id, novoStatus);
      setItens((current) => current.map((i) => (i.id === item.id ? { ...i, comprado: novoStatus } : i)));
    } catch {
      setError("Nao foi possivel atualizar o item.");
    }
  };

  const excluirItem = async () => {
    if (!deleteItem) return;
    try {
      await ListaItemService.delete(deleteItem.id);
      setItens((current) => current.filter((i) => i.id !== deleteItem.id));
      setDeleteItem(null);
    } catch {
      setError("Nao foi possivel excluir o item.");
    }
  };

  const finalizarLista = async () => {
    if (!id) return;
    try {
      await ListaService.fecharLista(id);
      setDataFechamento(new Date().toISOString());
      setConfirmClose(false);
    } catch {
      setError("Nao foi possivel finalizar a lista.");
    }
  };

  return (
    <section className="page-stack">
      <div className="detail-header">
        <button className="icon-button subtle" type="button" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1>{nomeLista}</h1>
          {fechada ? <p className="view-only">MODO VISUALIZACAO</p> : <p>Lista aberta para edicao</p>}
        </div>
        <div className="header-actions">
          {!fechada ? (
            <>
              <button className="icon-button success-outline" type="button" onClick={() => setConfirmClose(true)} aria-label="Finalizar lista">
                <CheckCheck size={22} />
              </button>
              <button className="icon-button" type="button" onClick={() => navigate(`/listas/${id}/itens/novo`)} aria-label="Adicionar item">
                <Plus size={22} />
              </button>
            </>
          ) : (
            <Lock className="muted-icon" size={22} />
          )}
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      {loading ? (
        <div className="loading-state">Carregando itens...</div>
      ) : Object.keys(itensAgrupados).length === 0 ? (
        <div className="empty-state">Nenhum item encontrado.</div>
      ) : (
        <div className="group-stack">
          {Object.entries(itensAgrupados).map(([grupoNome, grupoItens]) => (
            <section className="group-section" key={grupoNome}>
              <h2>{grupoNome.toUpperCase()}</h2>
              <div className="item-table">
                {grupoItens.map((item) => (
                  <article className={`item-row ${item.comprado ? "checked" : ""}`} key={item.id}>
                    <button className="item-main" type="button" onClick={() => setDetailsItem(item)}>
                      <span className="item-title-line">
                        <strong>{item.produto?.nome}</strong>
                        {item.observacao ? <FileText size={15} /> : null}
                      </span>
                      <span className="item-meta">
                        Qtd: {item.quantidade}
                        {item.comprado ? <em>COMPRADO</em> : null}
                      </span>
                    </button>
                    <span className="item-price">{item.preco_atual ? `R$ ${item.preco_atual}` : "---"}</span>
                    <div className="item-actions">
                      {!fechada ? (
                        <>
                          <button className={item.comprado ? "mini-button warning" : "mini-button success"} type="button" onClick={() => toggleComprado(item)}>
                            {item.comprado ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                            {item.comprado ? "Estornar" : "Comprar"}
                          </button>
                          {!item.comprado ? (
                            <button className="mini-button danger" type="button" onClick={() => setDeleteItem(item)}>
                              <Trash2 size={16} />
                              Excluir
                            </button>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ItemDetailsDialog item={detailsItem} onClose={() => setDetailsItem(null)} />
      <ConfirmDialog
        open={Boolean(deleteItem)}
        title="Excluir item?"
        message={<>Deseja remover "{deleteItem?.produto?.nome}" da lista? Esta acao nao pode ser desfeita.</>}
        confirmLabel="Excluir"
        tone="danger"
        onCancel={() => setDeleteItem(null)}
        onConfirm={excluirItem}
      />
      <ConfirmDialog
        open={confirmClose}
        title="Finalizar esta lista?"
        message="Apos fechar, voce nao podera mais editar os itens ou marcar compras."
        confirmLabel="Finalizar"
        tone="success"
        onCancel={() => setConfirmClose(false)}
        onConfirm={finalizarLista}
      />
    </section>
  );
}
