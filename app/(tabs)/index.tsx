import Header from "@/components/home/Header";
import { TopCategory } from "@/components/home/TopCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Transaction } from "@/components/Transaction";
import { usePreferences } from "@/contexts/Preferences";
import { useFocusEffect, useNavigation } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, FAB, Portal } from "react-native-paper";

export default function IndexScreen() {
  const [open, setOpen] = useState<boolean>(false);
  const preferences = usePreferences();
  const navigation = useNavigation<any>();

  useFocusEffect(() => {
    preferences.showFab();

    return () => preferences.hideFab();
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
    >
      <Portal>
        <FAB.Group
          open={open}
          visible={preferences.fabVisible}
          fabStyle={styles.fab}
          style={styles.fabOptions}
          icon={open ? "close" : "plus"}
          actions={[
            {
              icon: "bank-transfer-in",
              label: "Add Income",
              onPress: () => console.log("Income"),
            },
            {
              icon: "bank-transfer-out",
              label: "Add Expense",
              onPress: () =>
                navigation.navigate("categories", {
                  screen: "expense",
                  initial: false,
                }),
            },
          ]}
          onStateChange={({ open }: { open: boolean }) => setOpen(open)}
        />
      </Portal>
      <Card elevation={4}>
        <TopCategory
          categoryName="Groceries"
          budget={300}
          balance={120}
          iconName="food-outline"
        />
        <TopCategory
          categoryName="Groceries"
          budget={300}
          balance={120}
          iconName="food-outline"
        />
        <TopCategory
          categoryName="Groceries"
          budget={300}
          balance={120}
          iconName="food-outline"
        />
      </Card>
      <View style={{ marginTop: 20, gap: 5 }}>
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fab: {},
  fabOptions: {
    bottom: 45,
    right: 0,
  },
});
