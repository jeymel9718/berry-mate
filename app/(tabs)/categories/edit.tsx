import { CategoryForm } from "@/components/categories/CategoryForm";
import { windowHeight } from "@/constants/Dimensions";
import { categoryDB } from "@/db/services/categories";
import { savingDb } from "@/db/services/savings";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

export default function EditScreen() {
  const db = useSQLiteContext();
  const { savings, id } = useLocalSearchParams<{
    savings: string;
    id: string;
  }>();
  const [categoryName, setCategoryName] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  useEffect(() => {
    if (savings === "true") {
      savingDb.getSaving(db, id).then((saving) => {
        if (saving) {
          setCategoryName(saving.name);
          setTarget(saving.target.toString());
          setSelectedIcon(saving.icon);
        }
      });
    } else {
      categoryDB.getCategory(db, id).then((category) => {
        if (category) {
          setCategoryName(category.name);
          setTarget(category.target.toString());
          setSelectedIcon(category.icon);
        }
      });
    }
  }, []);

  const onSave = async () => {
    if (savings === "true") {
      await savingDb.updateSaving(db, {
        id: +id,
        name: categoryName,
        icon: selectedIcon,
        target: Number(target),
      });
      router.back();
    } else {
      await categoryDB.updateCategory(db, {
        id: +id,
        name: categoryName,
        icon: selectedIcon,
        target: Number(target),
        static: false,
      });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer} />
      <View style={styles.bodyContainer}>
        <CategoryForm
          name={categoryName}
          target={target}
          selectedIcon={selectedIcon}
          setName={setCategoryName}
          setTarget={setTarget}
          setIcon={setSelectedIcon}
          onSave={onSave}
          style={{ height: windowHeight * 0.78 }}
        />
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
    backgroundColor: "#A1CEDC",
    height: windowHeight * 0.13,
  },
  bodyContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
});
