import { windowHeight, windowWidth } from "@/constants/Dimensions";
import { BalanceActions } from "@/constants/Enums";
import { View, StyleSheet, Pressable } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";

export type TransactionHeaderProps = {
  expense: string;
  income: string;
  balance: string;
  expenseSelected: boolean;
  incomeSelected: boolean;
  actions: React.Dispatch<BalanceActions>;
};

export function TransactionHeader({
  expense,
  income,
  balance,
  expenseSelected,
  incomeSelected,
  actions
}: TransactionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Transactions
      </Text>
      <Surface style={styles.balanceContainer}>
        <Text variant="labelLarge">Total Balance</Text>
        <Text style={styles.balanceText} variant="titleLarge">
          {balance}
        </Text>
      </Surface>
      <View style={styles.rowContainer}>
        <Pressable onPress={() => actions(BalanceActions.INCOME)}>
          <Surface style={[styles.incContainer, incomeSelected ? styles.selectedContainer: {}]}>
            <Icon size={windowHeight * 0.05} source="bank-transfer-in" color={incomeSelected ? 'white': 'black'}/>
            <Text variant="labelLarge" style={[incomeSelected ? styles.whiteText : {}]}>Income</Text>
            <Text variant="labelLarge" style={[styles.balanceText, incomeSelected ? styles.whiteText : {}]}>
              {income}
            </Text>
          </Surface>
        </Pressable>
        <Pressable onPress={() => actions(BalanceActions.EXPENSE)}>
          <Surface style={[styles.incContainer, expenseSelected ? styles.selectedContainer: {}]}>
            <Icon size={windowHeight * 0.05} source="bank-transfer-out" color={expenseSelected ? 'white': 'black'}/>
            <Text variant="labelLarge" style={[expenseSelected ? styles.whiteText : {}]}>Expense</Text>
            <Text variant="labelLarge" style={[styles.balanceText, expenseSelected ? styles.whiteText : {}]}>
              {expense}
            </Text>
          </Surface>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    marginHorizontal: 20,
    alignItems: "center",
    gap: 13,
  },
  balanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: windowWidth * 0.8,
    height: windowHeight * 0.09,
  },
  selectedContainer: {
    backgroundColor: 'blue'
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  balanceText: {
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 10,
  },
  whiteText: {
    color: 'white'
  },
  incContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: windowWidth * 0.4,
    height: windowHeight * 0.12,
  },
});
