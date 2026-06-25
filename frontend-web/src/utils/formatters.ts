export const formatarMoeda = (valor: string): string => {
  if (!valor) return "";
  const limpo = valor.replace(/\D/g, "");
  const v = (Number(limpo) / 100).toFixed(2);
  return v.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

export const converterMoedaParaNumero = (valor: string): number => {
  if (!valor) return 0;
  const limpo = valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  return parseFloat(limpo) || 0;
};

export const formatarData = (valor?: string | null) => {
  if (!valor) return "---";
  return new Date(valor).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatarDataHora = (valor?: string | null) => {
  if (!valor) return "---";
  return new Date(valor).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
