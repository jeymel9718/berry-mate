import { useWindowDimensions, View, StyleSheet } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { ProgressBar } from "../home/ProgressBar";

export type BalanceHeaderProps = {
  expenseTarget: number;
  expenseAmount: number;
  progress: number;
  expenseName: string;
};

export function CategoryHeader({
  expenseTarget,
  expenseAmount,
  progress,
  expenseName,
}: BalanceHeaderProps) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.centerContainer, { width: width * 0.83 }]}>
      <View style={styles.balanceContainer}>
        <View>
          <View style={styles.rowContainer}>
            <Text variant="labelMedium">Expense Target</Text>
          </View>
          <Text variant="titleLarge">${expenseTarget}</Text>
        </View>
        <Divider horizontalInset style={styles.divider} />
        <View>
          <View style={styles.rowContainer}>
            <Text variant="labelMedium">Expense Amount</Text>
          </View>
          <Text variant="titleLarge">${expenseAmount}</Text>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <ProgressBar progress={progress} amount={expenseAmount} />
        <View style={styles.rowContainer}>
          <Icon size={13} source="checkbox-outline" />
          <Text variant="labelMedium">{progress}% Of Your {expenseName} Expenses</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignSelf: "center",
  },
  divider: {
    height: "80%",
    width: 1,
    backgroundColor: "white",
  },
});
