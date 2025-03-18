import { BalanceHeader } from "@/components/BalanceHeader";
import { Category } from "@/components/categories/Category";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { DefaultCategories } from "@/constants/Categories";
import { usePreferences } from "@/contexts/Preferences";
import { getCategories, Category as CategoryType } from "@/db/categories";
import { generateSubarrays } from "@/utils/utils";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function CategoriesScreen() {
  const preferences = usePreferences();
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<CategoryType[][]>([]);
  
  useFocusEffect(() => {
    preferences.hideFab();
  });

  useEffect(() => {
    const getData = async () => {
      const dbData = await getCategories(db);
      dbData.push({id: -1, name: "savings", icon: "piggy-bank", target: 0 });
      dbData.push({id: -1, name: "More", icon: "plus", target: 0 });

      setCategories(generateSubarrays(dbData, 3))
    }
    getData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <BalanceHeader />
        </View>
      }
      headerHeight={220}
    >
      {categories.map((arr, index) => {
        return (
          <View key={index} style={styles.rowContainer}>
            {arr.map((cat, i) => (
              <Category key={i} name={cat.name} iconName={cat.icon} />
            ))}
          </View>
        );
      })}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
});
