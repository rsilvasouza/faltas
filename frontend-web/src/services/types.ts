export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Lista {
  id: number;
  nome: string;
  fechamento: string | null;
  created_at: string;
}

export interface Grupo {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
}

export interface ListaItem {
  id: number;
  lista_id: number;
  produto_id: number;
  grupo_id: number;
  quantidade: number;
  comprado: boolean;
  preco_atual: string | number | null;
  observacao?: string | null;
  created_at: string;
  produto: Produto;
  grupo: Grupo;
}
