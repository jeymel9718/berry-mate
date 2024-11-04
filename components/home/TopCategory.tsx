import CircularProgressBar from "../CircularProgressBar";
import { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { windowWidth } from "@/constants/Dimensions";

export type TopCategoryProps = {
  categoryName: string;
  budget: number;
  balance: number;
  iconName: ComponentProps<typeof Ionicons>["name"];
};

export function TopCategory({
  categoryName,
  budget,
  balance,
  iconName,
}: TopCategoryProps) {
  const progress = (balance / budget) * 100;
  return (
    <View style={styles.container}>
      <CircularProgressBar
        size={windowWidth * 0.17}
        strokeWidth={4}
        progress={progress}
        color="#4caf50"
        backgroundColor="#e0e0e0"
        iconName={iconName}
      />
      <Divider horizontalInset />
      <View style={styles.center}>
        <View style={styles.row}>
          <Text variant="labelMedium">{categoryName}:</Text>
          <Text variant="labelSmall">
            ${balance}
          </Text>
          <Text>/</Text>
          <Text variant="labelSmall">
            ${budget}
          </Text>
        </View>
        <Divider horizontalInset />
        <Text variant="labelLarge">{Math.round(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 2
  },
  center: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row"
  }
});
