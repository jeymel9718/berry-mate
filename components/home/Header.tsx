import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { Divider, Text } from "react-native-paper";

export default function Header() {
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View>
        <Text variant="titleMedium">Welcome Back!</Text>
        <Text variant="labelMedium">Good Morning</Text>
      </View>
      <View style={[styles.centerContainer, {width: width*0.8}]}>
        <View style={styles.balanceContainer}>
          <View>
            <View style={styles.rowContainer}>
              <Ionicons name="enter-outline" size={15} />
              <Text variant="labelMedium">
                Total Balance
              </Text>
            </View>
            <Text variant="titleLarge">$7,783.00</Text>
          </View>
          <Divider horizontalInset style={styles.divider}/>
          <View>
            <View style={styles.rowContainer}>
              <Ionicons name="exit-outline" size={15} />
              <Text variant="labelMedium">
                Total Expense
              </Text>
            </View>
            <Text variant="titleLarge">
              -$1,187.40
            </Text>
          </View>
        </View>
        <View style={{gap: 6}}>
          <ProgressBar progress={20} amount={20000.0} />
          <View style={styles.rowContainer}>
            <Ionicons size={13} name="checkbox-outline" />
            <Text variant="labelMedium">
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
    marginTop: 35,
    marginHorizontal: 25,
    gap: 25,
  },
  centerContainer: {
    alignSelf: "center",
    paddingHorizontal: 10,
    height: 30,
    gap: 15,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center"
  },
  divider: {
    height: '80%',
    width: 1,
    backgroundColor: 'white'
  },
});
