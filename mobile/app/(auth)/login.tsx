import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api } from '../../src/services/api';
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });
      console.log(api.post("/login", { email, password }));
      console.log('Dados do Laravel:', response.data); // Isso vai aparecer no seu terminal

      const token = response.data.access_token;

      if (token) {
        await SecureStore.setItemAsync("user_token", String(token));
        router.replace("/(tabs)");
      } else {
        Alert.alert("Erro", "Token não recebido do servidor.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Usuário ou senha inválidos");
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Login</Text>

      <TextInput
        placeholder="E-mail"
        className="border border-gray-300 p-4 rounded-lg mb-4"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        className="border border-gray-300 p-4 rounded-lg mb-6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
