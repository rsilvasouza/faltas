import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { ListaService } from "@/src/services/ListaService";

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState<"aberto" | "fechado">("aberto");
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchListas = async () => {
    try {
      setLoading(true);
      const data = await ListaService.getAll();
      setLista(data ?? []);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchListas();
    }, [])
  );

  const filteredData = lista.filter((item) => {
    const isFechado = item.fechamento !== null && item.fechamento !== undefined;
    return filter === "fechado" ? isFechado : !isFechado;
  });

  const renderCard = ({ item }: { item: any }) => {
    const estaFechado =
      item.fechamento !== null && item.fechamento !== undefined;

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardSubtitle}>
            {estaFechado ? `Finalizada em: ${item.fechamento}` : "Aberta"}
          </Text>
        </View>
        <Ionicons
          name={estaFechado ? "checkmark-circle" : "chevron-forward"}
          size={24}
          color={estaFechado ? "#10b981" : "#2563eb"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Minhas Listas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/new-list")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "aberto" && styles.filterBtnActive,
          ]}
          onPress={() => setFilter("aberto")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "aberto" && styles.filterTextActive,
            ]}
          >
            Abertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "fechado" && styles.filterBtnActive,
          ]}
          onPress={() => setFilter("fechado")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "fechado" && styles.filterTextActive,
            ]}
          >
            Fechadas
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma lista encontrada.</Text>
          }
          // Adiciona "puxar para atualizar"
          onRefresh={fetchListas}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  welcome: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  addButton: {
    backgroundColor: "#2563eb",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Sombra Android
    shadowColor: "#000", // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  filterBtnActive: { backgroundColor: "#fff", elevation: 2 },
  filterText: { fontWeight: "600", color: "#64748b" },
  filterTextActive: { color: "#2563eb" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 13, color: "#94a3b8" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#94a3b8" },
});
