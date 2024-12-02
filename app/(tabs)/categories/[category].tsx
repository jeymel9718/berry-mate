import { BalanceHeader } from "@/components/BalanceHeader";
import { Transaction } from "@/components/categories/Transaction";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, List } from "react-native-paper";

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: category,
    });
  }, [navigation]);
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
      <IconButton
        icon="calendar"
        mode="contained"
        onPress={() => console.log("Pressed")}
        style={styles.calendar}
      />
      <List.Section>
        <List.Subheader>April</List.Subheader>
        <Transaction
          iconName="car-outline"
          date="April 30"
          name="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          name="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          name="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          name="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          name="Fuel"
          value={20000}
        />
      </List.Section>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  calendar: {
    position: "absolute",
    right: 10,
    top: 5,
  },
});
