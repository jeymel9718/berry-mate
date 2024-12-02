import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { BalanceHeader } from "../BalanceHeader";

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text variant="titleMedium">Welcome Back!</Text>
        <Text variant="labelMedium">Good Morning</Text>
      </View>
      <BalanceHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    marginHorizontal: 20,
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
