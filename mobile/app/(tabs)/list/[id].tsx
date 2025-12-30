import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
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

  // Estados para o Modal de Exclusão
  const [modalVisible, setModalVisible] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState<any>(null);

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

  const confirmarExclusao = (item: any) => {
    setItemParaExcluir(item);
    setModalVisible(true);
  };

  const excluirItem = async () => {
    if (!itemParaExcluir) return;
    try {
      await ListaItemService.delete(itemParaExcluir.id);
      setItens(itens.filter((i) => i.id !== itemParaExcluir.id));
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o item.");
    }
  };

  const renderRightActions = (item: any) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => confirmarExclusao(item)}
    >
      <Ionicons name="trash-outline" size={28} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.itemCard}>
        <View>
          <Text style={styles.itemNome}>{item.produto?.nome}</Text>
          <Text style={styles.itemInfo}>
            {item.grupo?.nome} • Qtd: {item.quantidade}
          </Text>
        </View>
        <Text style={styles.itemPreco}>
          {item.preco_atual ? `R$ ${item.preco_atual}` : "---"}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
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

        <FlatList
          data={itens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum item adicionado.</Text>
          }
        />

        {/* Modal de Confirmação */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Excluir Item?</Text>
              <Text style={styles.modalText}>
                Deseja remover "{itemParaExcluir?.produto?.nome}" da lista?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnTextCancel}>Não</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={excluirItem}
                >
                  <Text style={styles.btnTextConfirm}>Sim, Excluir</Text>
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
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  addBtn: { backgroundColor: "#2563eb", padding: 8, borderRadius: 8 },
  list: { padding: 15 },
  itemCard: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemNome: { fontSize: 16, fontWeight: "600", color: "#334155" },
  itemInfo: { fontSize: 13, color: "#64748b" },
  itemPreco: { fontWeight: "bold", color: "#0f172a" },
  deleteAction: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
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
    borderRadius: 15,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { color: "#64748b", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  btnCancel: { marginRight: 15, padding: 10 },
  btnTextCancel: { color: "#64748b", fontWeight: "600" },
  btnConfirm: { backgroundColor: "#ef4444", padding: 10, borderRadius: 8 },
  btnTextConfirm: { color: "#fff", fontWeight: "600" },
});
