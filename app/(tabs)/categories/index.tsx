import { BalanceHeader } from "@/components/BalanceHeader";
import { Category } from "@/components/categories/Category";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { DefaultCategories } from "@/constants/Categories";
import { Category as CategoryType } from "@/constants/Types";
import { usePreferences } from "@/contexts/Preferences";
import { useFocusEffect } from "expo-router";
import { useContext, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

function generateSubarrays(array: any[], size: number) {
  const subarrays = [];
  for (let i = 0; i < array.length; i += size) {
    const subarray = array.slice(i, i + size);
    subarrays.push(subarray);
  }
  return subarrays;
}

export default function CategoriesScreen() {
  const preferences = usePreferences();
  const data: CategoryType[][] = generateSubarrays(DefaultCategories, 3);
  
  useFocusEffect(() => {
    preferences.hideFab();
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
      {data.map((arr, index) => {
        return (
          <View key={index} style={styles.rowContainer}>
            {arr.map((cat, i) => (
              <Category key={i} name={cat.name} iconName={cat.iconName} />
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
