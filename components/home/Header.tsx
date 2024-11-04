import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { Divider, Text } from "react-native-paper";

export default function Header() {
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View>
        <Text variant="headlineMedium">Welcome Back!</Text>
        <Text variant="headlineSmall">Good Morning</Text>
      </View>
      <View style={[styles.centerContainer, {width: width * 0.85}]}>
        <View style={styles.balanceContainer}>
          <View>
            <View style={styles.rowContainer}>
              <Ionicons name="enter-outline" size={15} />
              <Text variant="labelLarge">
                Total Balance
              </Text>
            </View>
            <Text variant="titleSmall">$7,783.00</Text>
          </View>
          <Divider horizontalInset />
          <View>
            <View style={styles.rowContainer}>
              <Ionicons name="exit-outline" size={15} />
              <Text variant="labelLarge">
                Total Expense
              </Text>
            </View>
            <Text variant="titleSmall">
              -$1,187.40
            </Text>
          </View>
        </View>
        <View>
          <ProgressBar progress={20} amount={20000.0} />
          <View style={styles.rowContainer}>
            <Ionicons size={13} name="checkbox-outline" />
            <Text variant="labelSmall">
              20% Of Your Expenses
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginHorizontal: 25,
    gap: 4,
  },
  centerContainer: {
    alignSelf: "center", 
    height: 30,
    gap: 4,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
