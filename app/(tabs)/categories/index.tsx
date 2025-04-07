import { BalanceHeader } from "@/components/BalanceHeader";
import { Category } from "@/components/categories/Category";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { DefaultCategories } from "@/constants/Categories";
import { usePreferences } from "@/contexts/Preferences";
import { Category as CategoryType, categoryDB } from "@/db/services/categories";
import { generateSubarrays } from "@/utils/utils";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function CategoriesScreen() {
  const preferences = usePreferences();
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<CategoryType[][]>([]);

  useFocusEffect(() => {
    preferences.hideFab();
  });

  useEffect(() => {
    const deferFunc = categoryDB.onCategories(db, (value) => {
      value.push({
        id: -1,
        name: "more",
        icon: "plus",
        target: 0,
        static: true,
      });
      const data = generateSubarrays(value, 3);
      setCategories(data);
    });

    return () => {
      deferFunc();
    };
  });

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
              <Category
                key={i}
                name={cat.name}
                iconName={cat.icon}
                id={cat.id}
                disabled={cat.static}
              />
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
