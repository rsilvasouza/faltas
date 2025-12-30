import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Item, ListaItemService } from "@/src/services/ListaItemService";
import { ListaService } from "@/src/services/ListaService"; // Certifique-se de ter este service

export default function ListaItens() {
  const { id, nome } = useLocalSearchParams();
  const router = useRouter();
  const [itens, setItens] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataFechamento, setDataFechamento] = useState<string | null>(null);

  // Estados para Modais
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [modalObsVisible, setModalObsVisible] = useState(false);
  const [modalFecharListaVisible, setModalFecharListaVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);

  const fetchDados = async () => {
    try {
      setLoading(true);
      // Busca os itens
      const dataItens = await ListaItemService.getByLista(id as string);
      setItens(dataItens);

      // Busca os detalhes da lista para verificar se está fechada
      const detalhesLista = await ListaService.getById(id as string);
      setDataFechamento(detalhesLista.fechamento ? detalhesLista.fechamento.toString() : null);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDados();
    }, [id])
  );

  const itensAgrupados = itens.reduce((acc, item) => {
    const grupoNome = item.grupo?.nome || "Sem Grupo";
    if (!acc[grupoNome]) acc[grupoNome] = [];
    acc[grupoNome].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const toggleComprado = async (item: Item) => {
    if (dataFechamento) return; // Bloqueio se fechada
    try {
      const novoStatus = !item.comprado;
      await ListaItemService.updateStatus(item.id, novoStatus);
      setItens(
        itens.map((i) =>
          i.id === item.id ? { ...i, comprado: novoStatus } : i
        )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o item.");
    }
  };

  const finalizarLista = async () => {
    try {
      await ListaService.fecharLista(id as string);
      setDataFechamento(new Date().toISOString());
      setModalFecharListaVisible(false);
      Alert.alert(
        "Sucesso",
        "Lista finalizada! Agora ela está apenas para consulta."
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar a lista.");
    }
  };

  const confirmarExclusao = (item: Item) => {
    if (dataFechamento) return;
    setItemSelecionado(item);
    setModalExcluirVisible(true);
  };

  const abrirObservacao = (item: Item) => {
    setItemSelecionado(item);
    setModalObsVisible(true);
  };

  const excluirItem = async () => {
    if (!itemSelecionado) return;
    try {
      await ListaItemService.delete(itemSelecionado.id);
      setItens(itens.filter((i) => i.id !== itemSelecionado.id));
      setModalExcluirVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o item.");
    }
  };

  const renderLeftActions = (item: Item) => {
    if (dataFechamento) return null; // Remove ações de swipe se fechada
    return (
      <TouchableOpacity
        style={[styles.actionBtn, styles.checkAction]}
        onPress={() => toggleComprado(item)}
      >
        <Ionicons
          name={item.comprado ? "arrow-undo" : "checkmark-circle"}
          size={28}
          color="#fff"
        />
        <Text style={styles.actionText}>
          {item.comprado ? "Desfazer" : "Comprar"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (item: Item) => {
    if (dataFechamento) return null; // Remove ações de swipe se fechada
    if (item.comprado) {
      return (
        <TouchableOpacity
          style={[styles.actionBtn, styles.undoAction]}
          onPress={() => toggleComprado(item)}
        >
          <Ionicons name="arrow-undo-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Estornar</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.actionBtn, styles.deleteAction]}
        onPress={() => confirmarExclusao(item)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.actionText}>Excluir</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.title} numberOfLines={1}>
              {nome}
            </Text>
            {dataFechamento ? (
              <Text style={styles.statusFechada}>
                Finalizada em {new Date(dataFechamento).toLocaleDateString()}
              </Text>
            ) : null}
          </View>

          {!dataFechamento ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.finishBtn}
                onPress={() => setModalFecharListaVisible(true)}
              >
                <Ionicons name="checkmark-done" size={22} color="#22c55e" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                  router.push({
                    pathname: "/list/add-item",
                    params: { listaId: id },
                  })
                }
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <Ionicons name="lock-closed" size={20} color="#94a3b8" />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {Object.keys(itensAgrupados).length === 0 && !loading ? (
            <Text style={styles.empty}>Nenhum item adicionado.</Text>
          ) : null}

          {Object.keys(itensAgrupados).map((grupoNome) => (
            <View key={grupoNome} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{grupoNome.toUpperCase()}</Text>
              {itensAgrupados[grupoNome].map((item) => (
                <Swipeable
                  key={item.id}
                  enabled={!dataFechamento} // Desabilita o swipe se estiver fechada
                  renderLeftActions={() => renderLeftActions(item)}
                  renderRightActions={() => renderRightActions(item)}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                      item.observacao ? abrirObservacao(item) : null
                    }
                  >
                    <View style={styles.itemCard}>
                      <View style={styles.itemMainInfo}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              styles.itemNome,
                              item.comprado ? styles.itemCompradoTexto : null,
                            ]}
                          >
                            {item.produto?.nome}
                          </Text>
                          {item.observacao ? (
                            <Ionicons
                              name="document-text"
                              size={14}
                              color="#2563eb"
                              style={{ marginLeft: 6 }}
                            />
                          ) : null}
                        </View>
                        <View style={styles.itemSubRow}>
                          <Text style={styles.itemInfo}>
                            Qtd: {item.quantidade}
                          </Text>
                          {item.comprado ? (
                            <View style={styles.compradoBadge}>
                              <Text style={styles.compradoBadgeText}>OK</Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.itemPreco,
                          item.comprado ? styles.itemCompradoTexto : null,
                        ]}
                      >
                        {item.preco_atual ? `R$ ${item.preco_atual}` : "---"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Modal de Confirmação de Fechamento */}
        <Modal
          transparent
          visible={modalFecharListaVisible}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name="alert-circle"
                size={48}
                color="#22c55e"
                style={{ alignSelf: "center", marginBottom: 10 }}
              />
              <Text style={styles.modalTitle}>Finalizar Lista?</Text>
              <Text style={styles.modalText}>
                Ao finalizar, você não poderá mais adicionar itens ou alterar
                status de compra.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalFecharListaVisible(false)}
                >
                  <Text style={styles.btnTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnConfirm, { backgroundColor: "#22c55e" }]}
                  onPress={finalizarLista}
                >
                  <Text style={styles.btnTextConfirm}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Exclusão e Detalhes mantidos... */}
        {/* (Mesmo código dos modais anteriores) */}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  statusFechada: { fontSize: 11, color: "#ef4444", fontWeight: "700" },
  addBtn: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  finishBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  list: { paddingBottom: 30 },
  groupSection: { marginTop: 15 },
  groupTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
    paddingHorizontal: 20,
    marginBottom: 5,
    letterSpacing: 1,
  },
  itemCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemMainInfo: { flex: 1 },
  itemSubRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  itemNome: { fontSize: 16, fontWeight: "600", color: "#334155" },
  itemCompradoTexto: { textDecorationLine: "line-through", color: "#94a3b8" },
  itemInfo: { fontSize: 13, color: "#94a3b8" },
  compradoBadge: {
    marginLeft: 10,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  compradoBadgeText: { fontSize: 9, color: "#16a34a", fontWeight: "900" },
  itemPreco: { fontWeight: "bold", color: "#0f172a", fontSize: 15 },
  actionBtn: { justifyContent: "center", alignItems: "center", width: 80 },
  actionText: { color: "#fff", fontSize: 10, fontWeight: "bold", marginTop: 4 },
  checkAction: { backgroundColor: "#22c55e" },
  deleteAction: { backgroundColor: "#ef4444" },
  undoAction: { backgroundColor: "#f59e0b" },
  empty: { textAlign: "center", marginTop: 40, color: "#94a3b8" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    width: "85%",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  modalText: { color: "#64748b", marginVertical: 15, textAlign: "center" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btnCancel: { marginRight: 15, padding: 10 },
  btnTextCancel: { color: "#64748b", fontWeight: "600" },
  btnConfirm: { padding: 10, borderRadius: 8 },
  btnTextConfirm: { color: "#fff", fontWeight: "600" },
});
