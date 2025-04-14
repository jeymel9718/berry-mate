import { BalanceHeader } from "@/components/BalanceHeader";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Saving } from "@/components/savings/Saving";
import { Saving as SavingType } from "@/constants/Types";
import { windowWidth } from "@/constants/Dimensions";
import { generateSubarrays } from "@/utils/utils";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { savingDb } from "@/db/services/savings";
import { useSQLiteContext } from "expo-sqlite";

export default function SavingsScreen() {
  const [savings, setSavings] = useState<SavingType[][]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    const deferFunc = savingDb.onSavings(db, (savings) => {
      const data = generateSubarrays(savings, 3);
      setSavings(data);

      return () => {
        deferFunc();
      };
    });
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
      {savings.map((arr, index) => {
        return (
          <View key={index} style={styles.rowContainer}>
            {arr.map((cat, i) => (
              <Saving key={i} name={cat.name} iconName={cat.icon} id={cat.id}/>
            ))}
          </View>
        );
      })}
      <Link asChild href="/categories/more?savings=true">
        <Button mode="contained" style={styles.button}>
          Add Saving
        </Button>
      </Link>
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
  button: {
    width: windowWidth * 0.5,
    alignSelf: "center",
    margin: 5,
  },
});
