import { IconCategories } from "@/constants/Categories";
import { IconItem } from "@/constants/Types";
import { useState } from "react";
import { TouchableOpacity, StyleSheet, View, TextInput, FlatList } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function MoreScreen() {
  const [categoryName, setCategoryName] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');

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
          color={isSelected ? '#007BFF' : '#333'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Category Name"
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <Text style={styles.subtitle}>Select an Icon</Text>
      <FlatList
        data={IconCategories}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => renderIconItem(item)}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity
        style={styles.createButton}
      >
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 90,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  grid: {
    marginBottom: 16,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedIconContainer: {
    backgroundColor: '#e0f7fa',
    borderColor: '#007BFF',
  },
  createButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});