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

export default function ListaItens() {
  const { id, nome } = useLocalSearchParams();
  const router = useRouter();
  const [itens, setItens] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para Modais
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [modalObsVisible, setModalObsVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);

  const fetchItens = async () => {
    try {
      setLoading(true);
      const data = await ListaItemService.getByLista(id as string);
      setItens(data);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItens();
    }, [id])
  );

  // Lógica de Agrupamento por Grupo/Categoria
  const itensAgrupados = itens.reduce((acc, item) => {
    const grupoNome = item.grupo?.nome || "Sem Grupo";
    if (!acc[grupoNome]) acc[grupoNome] = [];
    acc[grupoNome].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const confirmarExclusao = (item: Item) => {
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

  const renderRightActions = (item: Item) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => confirmarExclusao(item)}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.title}>{nome}</Text>
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

        <ScrollView contentContainerStyle={styles.list}>
          {Object.keys(itensAgrupados).length === 0 && !loading && (
            <Text style={styles.empty}>Nenhum item adicionado.</Text>
          )}

          {Object.keys(itensAgrupados).map((grupoNome) => (
            <View key={grupoNome} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{grupoNome.toUpperCase()}</Text>

              {itensAgrupados[grupoNome].map((item) => (
                <Swipeable
                  key={item.id}
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
                          <Text style={styles.itemNome}>
                            {item.produto?.nome}
                          </Text>
                          {/* Ícone sutil indicando que há nota */}
                          {item.observacao && (
                            <Ionicons
                              name="document-text"
                              size={14}
                              color="#2563eb"
                              style={{ marginLeft: 6 }}
                            />
                          )}
                        </View>

                        <View style={styles.itemSubRow}>
                          <Text style={styles.itemInfo}>
                            Qtd: {item.quantidade}
                          </Text>

                          {/* Botão de Ver Observação (Badge) */}
                          {item.observacao && (
                            <View style={styles.obsBadge}>
                              <Text style={styles.obsBadgeText}>Ver Obs.</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <Text style={styles.itemPreco}>
                        {item.preco_atual ? `R$ ${item.preco_atual}` : "---"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Modal de Exclusão */}
        <Modal transparent visible={modalExcluirVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Excluir Item?</Text>
              <Text style={styles.modalText}>
                Deseja remover "{itemSelecionado?.produto?.nome}"?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalExcluirVisible(false)}
                >
                  <Text style={styles.btnTextCancel}>Não</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={excluirItem}
                >
                  <Text style={styles.btnTextConfirm}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Observação (Detalhes) */}
        <Modal transparent visible={modalObsVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Ionicons name="document-text" size={24} color="#2563eb" />
                <Text style={styles.modalTitle}> Detalhes</Text>
              </View>

              <Text style={styles.detailLabel}>Produto:</Text>
              <Text style={styles.detailValue}>
                {itemSelecionado?.produto?.nome}
              </Text>

              <Text style={styles.detailLabel}>Observação:</Text>
              <Text style={styles.obsTextContent}>
                {itemSelecionado?.observacao || "Nenhuma observação informada."}
              </Text>

              <TouchableOpacity
                style={styles.btnCloseObs}
                onPress={() => setModalObsVisible(false)}
              >
                <Text style={styles.btnCloseObsText}>Fechar</Text>
              </TouchableOpacity>
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
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  addBtn: { backgroundColor: "#2563eb", padding: 8, borderRadius: 8 },
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
  itemInfo: { fontSize: 13, color: "#94a3b8" },
  obsBadge: {
    marginLeft: 10,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  obsBadgeText: {
    fontSize: 10,
    color: "#2563eb",
    fontWeight: "bold",
  },
  itemPreco: { fontWeight: "bold", color: "#0f172a", fontSize: 15 },
  deleteAction: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
  },
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
  modalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  modalText: { color: "#64748b", marginBottom: 20 },
  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    marginTop: 10,
  },
  detailValue: { fontSize: 16, color: "#1e293b", marginBottom: 10 },
  obsTextContent: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
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
    marginTop: 10,
  },
  btnCancel: { marginRight: 15, padding: 10 },
  btnTextCancel: { color: "#64748b", fontWeight: "600" },
  btnConfirm: { backgroundColor: "#ef4444", padding: 10, borderRadius: 8 },
  btnTextConfirm: { color: "#fff", fontWeight: "600" },
});
