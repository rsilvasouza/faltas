export const formatarMoeda = (valor: string): string => {
  if (!valor) return "";

  // Remove tudo que não é dígito
  let limpo = valor.replace(/\D/g, "");

  // Converte para centavos e depois para string com 2 casas decimais
  const v = (Number(limpo) / 100).toFixed(2);

  // Formata para o padrão brasileiro
  return v.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

export const converterMoedaParaNumero = (valor: string): number => {
  if (!valor) return 0;

  // Remove o "R$", os pontos de milhar e troca a vírgula por ponto
  const limpo = valor
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  return parseFloat(limpo) || 0;
};
