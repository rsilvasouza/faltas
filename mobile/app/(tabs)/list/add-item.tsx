import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { ListaItemService } from "@/src/services/ListaItemService";
import { Produto, ProdutoService } from "@/src/services/ProdutoService";
import { Grupo, GrupoService } from "@/src/services/GrupoService";
import {
  formatarMoeda,
  converterMoedaParaNumero,
} from "@/src/utils/formatters";

export default function AddItem() {
  const { listaId } = useLocalSearchParams();
  const router = useRouter();

  // Estados de dados
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [sugestoes, setSugestoes] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Estados do Formulário
  const [searchText, setSearchText] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [grupoId, setGrupoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [preco, setPreco] = useState("");
  const [observacao, setObservacao] = useState("");

  const resetForm = () => {
    setSearchText("");
    setProdutoSelecionado(null);
    setGrupoId("");
    setQuantidade("1");
    setPreco("");
    setObservacao("");
    setSugestoes([]);
  };

  // Carregar grupos ao montar a tela
  useEffect(() => {
    const loadGrupos = async () => {
      try {
        const data = await GrupoService.getAll();
        setGrupos(data);
      } catch (error) {
        console.error("Erro ao carregar grupos");
      }
    };
    loadGrupos();
  }, []);

  // Busca de produtos dinâmica (Autocomplete)
  const handleSearch = async (text: string) => {
    setSearchText(text);
    setProdutoSelecionado(null);

    if (text.length > 1) {
      setSearching(true);
      try {
        const data = await ProdutoService.search(text);
        setSugestoes(data);
      } catch (error) {
        console.error("Erro ao carregar produtos");
      } finally {
        setSearching(false);
      }
    } else {
      setSugestoes([]);
    }
  };

  const selecionarProduto = (prod: Produto) => {
    setProdutoSelecionado(prod);
    setSearchText(prod.nome);
    setSugestoes([]);
    Keyboard.dismiss();
  };

  const handleSave = async () => {
    const precoParaEnviar = converterMoedaParaNumero(preco);
    
    if (!searchText.trim() || !grupoId || !quantidade) {
      Alert.alert(
        "Erro",
        "Por favor, informe o produto, selecione um grupo e a quantidade."
      );
      return;
    }

    setLoading(true);
    try {
      let idFinalDoProduto = produtoSelecionado?.id;

      // Se o usuário digitou mas não selecionou da lista, cria o produto primeiro
      if (!idFinalDoProduto) {
        try {
          const novoProduto = await ProdutoService.create(searchText);
          idFinalDoProduto = novoProduto.id;
        } catch (err: any) {
          Alert.alert("Erro", "Este produto já existe ou não pôde ser criado.");
          setLoading(false);
          return;
        }
      }

      // Cria o item na lista vinculando ao produto e grupo
      await ListaItemService.create({
        lista_id: Number(listaId),
        produto_id: Number(idFinalDoProduto),
        grupo_id: Number(grupoId),
        quantidade: Number(quantidade),
        preco_atual: precoParaEnviar > 0 ? precoParaEnviar : undefined,
        observacao: observacao.trim(),
      });

      resetForm();

      Alert.alert("Sucesso", "Item adicionado!", [
        {
          text: "Adicionar outro",
          onPress: () => {},
        },
        {
          text: "Voltar para a lista",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível salvar o item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.headerTitle}>Novo Item na Lista</Text>

        {/* Busca de Produto */}
        <Text style={styles.label}>Produto (Busque pelo nome) *</Text>
        <View style={styles.inputSearchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.inputSearch}
            placeholder="Ex: Caneta, Apontador..."
            value={searchText}
            onChangeText={handleSearch}
          />
          {searching && <ActivityIndicator style={{ marginRight: 10 }} />}
        </View>

        {/* Lista de Sugestões */}
        {sugestoes.length > 0 && (
          <View style={styles.suggestionBox}>
            {sugestoes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => selecionarProduto(item)}
              >
                <Text style={styles.suggestionText}>{item.nome}</Text>
                <Ionicons name="add-circle-outline" size={20} color="#2563eb" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Seleção de Grupo */}
        <Text style={styles.label}>Grupo / Categoria *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={grupoId}
            onValueChange={(val) => setGrupoId(val)}
          >
            <Picker.Item
              label="Selecione um grupo..."
              value=""
              color="#94a3b8"
            />
            {grupos.map((g) => (
              <Picker.Item key={g.id} label={g.nome} value={g.id.toString()} />
            ))}
          </Picker>
        </View>

        {/* Quantidade e Preço (Lado a Lado) */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Quantidade *</Text>
            <TextInput
              style={styles.input}
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
              placeholder="1"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Preço Unit. (R$)</Text>
            <TextInput
              style={styles.input}
              value={preco ? `R$ ${preco}` : ""}
              onChangeText={(text) => setPreco(formatarMoeda(text))}
              keyboardType="numeric"
              placeholder="R$ 0,00"
            />
          </View>
        </View>

        {/* Observação */}
        <Text style={styles.label}>Observações (Opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Ex: Cor azul, marca específica, tamanho..."
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Adicionar à Lista</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Botão Cancelar */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  form: { padding: 20 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  inputSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: { paddingLeft: 12 },
  inputSearch: { flex: 1, padding: 12, fontSize: 16 },
  suggestionBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    marginTop: 2,
    maxHeight: 200,
    overflow: "hidden",
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  suggestionText: { fontSize: 15, color: "#334155" },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  row: { flexDirection: "row", marginTop: 10 },
  saveButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButton: { marginTop: 15, padding: 10, alignItems: "center" },
  cancelButtonText: { color: "#94a3b8", fontWeight: "600" },
});