import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { ItemService } from "@/src/services/ProdutoService"; // Você precisará criar este service

export default function ItensDaLista() {
  const { id, nome } = useLocalSearchParams(); // Captura o ID da URL
  const [itens, setItens] = useState([]);

  const fetchItens = async () => {
    try {
      // O seu service deve buscar itens filtrados por esse ID de lista
      const data = await ItemService.getByLista(id as string);
      setItens(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItens();
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Itens de: {nome}</Text>
      
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.nome}</Text>
          </View>
        )}
      />
    </View>
  );
}