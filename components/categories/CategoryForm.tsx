import { IconCategories } from "@/constants/Categories";
import { IconItem } from "@/constants/Types";
import { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Button, Icon, Text } from "react-native-paper";

export type CategoryFormProps = {
  name: string;
  target: string;
  selectedIcon: string;
  setName: (text: string) => void;
  setTarget: (text: string) => void;
  setIcon: (text: string) => void;
  onSave: () => void;
  style?: ViewStyle
};

export function CategoryForm({
  name,
  target,
  selectedIcon,
  setName,
  setTarget,
  setIcon,
  onSave,
  style,
}: CategoryFormProps) {
  const disabledSave = useMemo(() => {
    if (name === "" || target === "" || selectedIcon === "") {
      return true;
    }

    return false;
  }, [name, target, selectedIcon]);

  const renderIconItem = (item: IconItem) => {
    const isSelected = selectedIcon && selectedIcon === item.name;
    return (
      <TouchableOpacity
        style={[
          styles.iconContainer,
          isSelected ? styles.selectedIconContainer : {},
        ]}
        onPress={() => setIcon(item.name)}
      >
        <Icon
          source={item.name}
          size={32}
          color={isSelected ? "#007BFF" : "#333"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={style}>
      <TextInput
        autoCapitalize="words"
        style={styles.input}
        placeholder="Category Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category Target"
        inputMode="decimal"
        value={target}
        onChangeText={setTarget}
      />
      <Text style={styles.subtitle}>Select an Icon</Text>
      <FlatList
        data={IconCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderIconItem(item)}
        initialNumToRender={1}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
      <Button mode="contained" style={styles.button} onPress={onSave} disabled={disabledSave}>
        Create
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  grid: {
    marginBottom: 16,
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  selectedIconContainer: {
    backgroundColor: "#e0f7fa",
    borderColor: "#007BFF",
  },
  button: {
    marginBottom: 10,
  },
});
