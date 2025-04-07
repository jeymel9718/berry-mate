import { BalanceHeader } from "@/components/BalanceHeader";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Saving } from "@/components/savings/Saving";
import { windowWidth } from "@/constants/Dimensions";
import { Category as CategoryType } from "@/constants/Types";
import { generateSubarrays } from "@/utils/utils";
import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function SavingsScreen() {
  const data: CategoryType[][] = generateSubarrays(
    [
      { name: "Tavel", iconName: "airplane" },
      { name: "New House", iconName: "home-outline" },
      { name: "Car", iconName: "car" },
      { name: "Wedding", iconName: "ring" },
    ],
    3
  );

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
              <Saving key={i} name={cat.name} iconName={cat.iconName} id={i}/>
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
