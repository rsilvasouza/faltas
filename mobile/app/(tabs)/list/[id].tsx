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
import { ListaService } from "@/src/services/ListaService";

export default function ListaItens() {
  const { id, nome } = useLocalSearchParams();
  const router = useRouter();
  const [itens, setItens] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataFechamento, setDataFechamento] = useState<string | null>(null);

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [modalObsVisible, setModalObsVisible] = useState(false);
  const [modalFecharListaVisible, setModalFecharListaVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);

  const fetchDados = async () => {
    try {
      setLoading(true);
      const dataItens = await ListaItemService.getByLista(id as string);
      setItens(dataItens);

      const detalhesLista = await ListaService.getById(id as string);
      setDataFechamento(
        detalhesLista.fechamento ? detalhesLista.fechamento.toString() : null
      );
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

  const abrirObservacao = (item: Item) => {
    setItemSelecionado(item);
    setModalObsVisible(true);
  };

  const finalizarLista = async () => {
    try {
      await ListaService.fecharLista(id as string);
      setDataFechamento(new Date().toISOString());
      setModalFecharListaVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar a lista.");
    }
  };

  const excluirItem = async () => {
    if (!itemSelecionado) return;
    try {
      await ListaItemService.delete(itemSelecionado.id);
      // Remove o item da lista localmente para atualizar a tela
      setItens(itens.filter((i) => i.id !== itemSelecionado.id));
      setModalExcluirVisible(false);
      setItemSelecionado(null);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o item.");
    }
  };

  // Ações de Swipe (Somente se não estiver fechada)
  const renderLeftActions = (item: Item) => {
    if (dataFechamento) return null;
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
    if (dataFechamento) return null;
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
        style={[styles.actionBtn, { backgroundColor: "#ef4444" }]}
        onPress={() => {
          setItemSelecionado(item);
          setModalExcluirVisible(true);
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.actionText}>Excluir</Text>
      </TouchableOpacity>
    );
  };

  const toggleComprado = async (item: Item) => {
    if (dataFechamento) return;
    try {
      const novoStatus = !item.comprado;
      await ListaItemService.updateStatus(item.id, novoStatus);
      setItens(
        itens.map((i) =>
          i.id === item.id ? { ...i, comprado: novoStatus } : i
        )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header com Status */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.title}>{nome}</Text>
            {dataFechamento ? (
              <Text style={styles.statusFechada}>MODO VISUALIZAÇÃO</Text>
            ) : null}
          </View>

          {!dataFechamento ? (
            <View style={{ flexDirection: "row" }}>
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
          {Object.keys(itensAgrupados).map((grupoNome) => (
            <View key={grupoNome} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{grupoNome.toUpperCase()}</Text>
              {itensAgrupados[grupoNome].map((item) => (
                <Swipeable
                  key={item.id}
                  enabled={!dataFechamento} // Bloqueia arraste se fechada
                  renderLeftActions={() => renderLeftActions(item)}
                  renderRightActions={() => renderRightActions(item)}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => abrirObservacao(item)} // Modal sempre acessível
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
                              <Text style={styles.compradoBadgeText}>
                                COMPRADO
                              </Text>
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

        {/* Modal de Confirmação de Exclusão */}
        <Modal transparent visible={modalExcluirVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name="trash"
                size={40}
                color="#ef4444"
                style={{ alignSelf: "center", marginBottom: 10 }}
              />
              <Text style={styles.modalTitle}>Excluir Item?</Text>
              <Text style={styles.modalText}>
                Deseja remover "{itemSelecionado?.produto?.nome}" da lista? Esta
                ação não pode ser desfeita.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => {
                    setModalExcluirVisible(false);
                    setItemSelecionado(null);
                  }}
                >
                  <Text style={styles.btnTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnConfirm, { backgroundColor: "#ef4444" }]}
                  onPress={excluirItem}
                >
                  <Text style={styles.btnTextConfirm}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Detalhes (Acessível na lista fechada) */}
        <Modal transparent visible={modalObsVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Ionicons name="information-circle" size={24} color="#2563eb" />
                <Text style={styles.modalTitle}> Detalhes do Item</Text>
              </View>
              <Text style={styles.detailLabel}>Produto:</Text>
              <Text style={styles.detailValue}>
                {itemSelecionado?.produto?.nome}
              </Text>
              <Text style={styles.detailLabel}>Observação:</Text>
              <Text style={styles.obsTextContent}>
                {itemSelecionado?.observacao || "Sem observações."}
              </Text>

              <Text style={styles.detailLabelData}>
                Criado em:{" "}
                {itemSelecionado?.created_at
                  ? new Date(itemSelecionado.created_at).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "---"}
              </Text>
              <TouchableOpacity
                style={styles.btnCloseObs}
                onPress={() => setModalObsVisible(false)}
              >
                <Text style={styles.btnCloseObsText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de Fechamento */}
        <Modal
          transparent
          visible={modalFecharListaVisible}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Finalizar esta lista?</Text>
              <Text style={styles.modalText}>
                Após fechar, você não poderá mais editar os itens ou marcar
                compras.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setModalFecharListaVisible(false)}
                  style={styles.btnCancel}
                >
                  <Text style={styles.btnTextCancel}>Agora não</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={finalizarLista}
                  style={[styles.btnConfirm, { backgroundColor: "#22c55e" }]}
                >
                  <Text style={styles.btnTextConfirm}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  statusFechada: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
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
  undoAction: { backgroundColor: "#f59e0b" },
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
  },
  modalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  modalText: { color: "#64748b", marginVertical: 10 },
  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    marginTop: 10,
  },
  detailLabelData: {
    fontSize: 12,
    color: "#ff0000ff",
    fontWeight: "700",
    marginTop: 20,
  },
  detailValue: { fontSize: 16, color: "#1e293b" },
  obsTextContent: {
    color: "#475569",
    fontSize: 15,
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  btnCloseObs: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnCloseObsText: { color: "#fff", fontWeight: "bold" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  btnCancel: { marginRight: 15, padding: 10 },
  btnTextCancel: { color: "#64748b", fontWeight: "600" },
  btnConfirm: { padding: 10, borderRadius: 8 },
  btnTextConfirm: { color: "#fff", fontWeight: "600" },
});
