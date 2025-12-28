import { TouchableOpacity, Text } from 'react-native';

export function Button({ title, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-black py-4 rounded-xl"
    >
      <Text className="text-white text-center text-lg font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
