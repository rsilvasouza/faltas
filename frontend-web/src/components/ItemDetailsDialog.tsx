import { Info } from "lucide-react";
import type { ListaItem } from "../services/types";
import { formatarDataHora } from "../utils/formatters";

interface ItemDetailsDialogProps {
  item: ListaItem | null;
  onClose: () => void;
}

export function ItemDetailsDialog({ item, onClose }: ItemDetailsDialogProps) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <div className="dialog-heading">
          <Info size={24} />
          <h2 id="details-title">Detalhes do item</h2>
        </div>
        <span className="detail-label">Produto</span>
        <p className="detail-value">{item.produto?.nome}</p>

        <span className="detail-label">Observação</span>
        <p className="observation-box">{item.observacao || "Sem observações."}</p>

        <span className="detail-date">Criado em: {formatarDataHora(item.created_at)}</span>
        <button className="primary-button block" type="button" onClick={onClose}>
          Voltar
        </button>
      </div>
    </div>
  );
}
