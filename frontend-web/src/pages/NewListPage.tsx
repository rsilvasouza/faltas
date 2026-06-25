import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Notice } from "../components/Notice";
import { ListaService } from "../services/listaService";

export function NewListPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!nome.trim()) {
      setError("Informe o nome da lista.");
      return;
    }

    setLoading(true);
    try {
      await ListaService.create(nome.trim());
      setMessage("Lista criada.");
      navigate("/");
    } catch {
      setError("Falha ao salvar.");
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
        <h1>Nova lista</h1>
        {error ? <Notice tone="error" message={error} /> : null}
        {message ? <Notice tone="success" message={message} /> : null}

        <label>
          Nome da lista
          <input autoFocus value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Ex: Compras do Mes" />
        </label>

        <button className="primary-button block" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Criar lista"}
        </button>
      </form>
    </section>
  );
}
