import { Text, View, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";

export type IncomeExpenseProps = {
  income: string;
  expense: string;
};

export function IncomeExpense({ income, expense }: IncomeExpenseProps) {
  return (
    <View style={styles.container}>
      {/* Income Box */}
      <View style={styles.item}>
        <View style={[styles.iconWrapper, { borderColor: "#1FC76A" }]}>
          <Icon source="arrow-top-right" size={20} color="#1FC76A" />
        </View>
        <Text style={styles.label}>Income</Text>
        <Text style={[styles.amount, { color: "#1FC76A" }]}>$4,120.00</Text>
      </View>

      {/* Expense Box */}
      <View style={styles.item}>
        <View style={[styles.iconWrapper, { borderColor: "#0091FF" }]}>
          <Icon source="arrow-bottom-left" size={20} color="#0091FF" />
        </View>
        <Text style={styles.label}>Expense</Text>
        <Text style={[styles.amount, { color: "#0091FF" }]}>$1,187.40</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  item: {
    alignItems: "center",
  },
  iconWrapper: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#0E2B17",
    fontWeight: "500",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
});
