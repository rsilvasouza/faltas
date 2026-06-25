import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, PlusCircle, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Notice } from "../components/Notice";
import { GrupoService } from "../services/grupoService";
import { ListaItemService } from "../services/listaItemService";
import { ProdutoService } from "../services/produtoService";
import type { Grupo, Produto } from "../services/types";
import { converterMoedaParaNumero, formatarMoeda } from "../utils/formatters";

export function AddItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [sugestoes, setSugestoes] = useState<Produto[]>([]);
  const [searchText, setSearchText] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [grupoId, setGrupoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [preco, setPreco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadGrupos = async () => {
      try {
        setGrupos(await GrupoService.getAll());
      } catch {
        setError("Erro ao carregar grupos.");
      }
    };
    void loadGrupos();
  }, []);

  useEffect(() => {
    const term = searchText.trim();
    setProdutoSelecionado((current) => (current?.nome === term ? current : null));

    if (term.length <= 1) {
      setSugestoes([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setSearching(true);
      try {
        setSugestoes(await ProdutoService.search(term));
      } catch {
        setError("Erro ao carregar produtos.");
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchText]);

  const resetForm = () => {
    setSearchText("");
    setProdutoSelecionado(null);
    setGrupoId("");
    setQuantidade("1");
    setPreco("");
    setObservacao("");
    setSugestoes([]);
  };

  const selecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setSearchText(produto.nome);
    setSugestoes([]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!id) return;
    if (!searchText.trim() || !grupoId || !quantidade) {
      setError("Por favor, informe o produto, selecione um grupo e a quantidade.");
      return;
    }

    const precoParaEnviar = converterMoedaParaNumero(preco);
    setLoading(true);
    try {
      let produtoId = produtoSelecionado?.id;

      if (!produtoId) {
        try {
          const novoProduto = await ProdutoService.create(searchText.trim());
          produtoId = novoProduto.id;
        } catch {
          setError("Este produto ja existe ou nao pode ser criado. Busque e selecione o produto existente.");
          setLoading(false);
          return;
        }
      }

      await ListaItemService.create({
        lista_id: Number(id),
        produto_id: Number(produtoId),
        grupo_id: Number(grupoId),
        quantidade: Number(quantidade),
        preco_atual: precoParaEnviar > 0 ? precoParaEnviar : undefined,
        observacao: observacao.trim(),
      });

      resetForm();
      setMessage("Item adicionado.");
    } catch {
      setError("Nao foi possivel salvar o item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-stack narrow">
      <div className="return-header">
        <button className="icon-text-button subtle" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <h1>Novo item na lista</h1>
        {error ? <Notice tone="error" message={error} /> : null}
        {message ? (
          <div className="notice success with-actions">
            <span>{message}</span>
            <button type="button" onClick={() => navigate(`/listas/${id}`)}>
              Voltar para a lista
            </button>
          </div>
        ) : null}

        <label>
          Produto *
          <div className="search-field">
            <Search size={20} />
            <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Ex: Caneta, Apontador..." />
            {searching ? <LoaderCircle className="spin" size={18} /> : null}
          </div>
        </label>
        {sugestoes.length > 0 ? (
          <div className="suggestion-box">
            {sugestoes.map((produto) => (
              <button key={produto.id} type="button" onClick={() => selecionarProduto(produto)}>
                {produto.nome}
                <PlusCircle size={18} />
              </button>
            ))}
          </div>
        ) : null}

        <label>
          Grupo / Categoria *
          <select value={grupoId} onChange={(event) => setGrupoId(event.target.value)}>
            <option value="">Selecione um grupo...</option>
            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nome}
              </option>
            ))}
          </select>
        </label>

        <div className="form-grid two">
          <label>
            Quantidade *
            <input type="number" min="1" value={quantidade} onChange={(event) => setQuantidade(event.target.value)} placeholder="1" />
          </label>
          <label>
            Preco Unit. (R$)
            <input inputMode="numeric" value={preco ? `R$ ${preco}` : ""} onChange={(event) => setPreco(formatarMoeda(event.target.value))} placeholder="R$ 0,00" />
          </label>
        </div>

        <label>
          Observações
          <textarea value={observacao} onChange={(event) => setObservacao(event.target.value)} placeholder="Ex: Cor azul, marca especifica, tamanho..." rows={4} />
        </label>

        <button className="primary-button block" type="submit" disabled={loading}>
          {loading ? <LoaderCircle className="spin" size={18} /> : <CheckCircle2 size={18} />}
          Adicionar a lista
        </button>
        <button className="text-button block" type="button" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </form>
    </section>
  );
}
