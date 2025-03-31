import { IconCategories } from "@/constants/Categories";
import { windowHeight } from "@/constants/Dimensions";
import { IconItem } from "@/constants/Types";
import { categoryDB } from "@/db/services/categories";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  FlatList,
} from "react-native";
import { Button, Icon, Text } from "react-native-paper";

export default function MoreScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { savings } = useLocalSearchParams<{ savings: string }>();
  const [categoryName, setCategoryName] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  const renderIconItem = (item: IconItem) => {
    const isSelected = selectedIcon && selectedIcon === item.name;
    return (
      <TouchableOpacity
        style={[
          styles.iconContainer,
          isSelected ? styles.selectedIconContainer : {},
        ]}
        onPress={() => setSelectedIcon(item.name)}
      >
        <Icon
          source={item.name}
          size={32}
          color={isSelected ? "#007BFF" : "#333"}
        />
      </TouchableOpacity>
    );
  };

  const onSave = () => {
    if (savings === "true") {
      // Add new savings
    } else {
      categoryDB.createCategory(db, {id: 0, name: categoryName, target: Number(target), icon: selectedIcon});
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer} />
      <View style={styles.bodyContainer}>
        <TextInput
          style={styles.input}
          placeholder="Category Name"
          value={categoryName}
          onChangeText={setCategoryName}
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
        <Button mode="contained" style={styles.button} onPress={onSave}>Create</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A1CEDC",
  },
  headerContainer: {
    backgroundColor: '#A1CEDC',
    height: windowHeight*0.13
  },
  bodyContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    height: "86%"
  },
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
    fontWeight: 'bold',
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
  }
});
