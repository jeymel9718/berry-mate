import CircularProgressBar from "../CircularProgressBar";
import { View, StyleSheet } from "react-native";
import { Divider, Text } from "react-native-paper";
import { windowHeight, windowWidth } from "@/constants/Dimensions";

export type TopCategoryProps = {
  categoryName: string;
  budget: number;
  balance: number;
  iconName: string;
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
      <Divider horizontalInset style={styles.divider} />
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
        <Divider style={styles.horizontalDivider} />
        <Text variant="labelLarge">{Math.round(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
    marginVertical: 2,
    padding: 5,
  },
  center: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row"
  },
  divider: {
    height: windowWidth*0.15,
    width: 1,
  },
  horizontalDivider: {
    margin: 5,
    height: 1,
    width: windowHeight*0.25
  }
});
