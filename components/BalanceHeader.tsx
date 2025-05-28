import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { ProgressBar } from "./home/ProgressBar";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { transactionDB } from "@/db/services/transaction";

export function BalanceHeader(){
  const db = useSQLiteContext();
  const { width } = useWindowDimensions();
  const [transactionsBalance, setTransactionsBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch total balance and expenses from the database
      const transactionsBalance = await transactionDB.getTotalTransactionsAmount(db); 

      // Update the state or context with the fetched data
      // This is just a placeholder, you would typically use a state management solution
      setIncome(transactionsBalance.total_income);
      setExpenses(transactionsBalance.total_expense);
      setTransactionsBalance(transactionsBalance.total_income - transactionsBalance.total_expense);
    };

    fetchData();
  }, []);

  return (
    <View style={[styles.centerContainer, {width: width*0.83}]}>
        <View style={styles.balanceContainer}>
          <View>
            <View style={styles.rowContainer}>
              <Icon size={17} source="bank-transfer-in" />
              <Text variant="labelMedium">
                Total Balance
              </Text>
            </View>
            <Text variant="titleLarge">${transactionsBalance}</Text>
          </View>
          <Divider horizontalInset style={styles.divider}/>
          <View>
            <View style={styles.rowContainer}>
              <Icon size={17} source="bank-transfer-out" />
              <Text variant="labelMedium">
                Total Expense
              </Text>
            </View>
            <Text variant="titleLarge">
              -${expenses}
            </Text>
          </View>
        </View>
        <View style={{gap: 6}}>
          <ProgressBar progress={20} amount={20000.0} />
          <View style={styles.rowContainer}>
            <Icon size={13} source="checkbox-outline" />
            <Text variant="labelMedium">
              20% Of Your Expenses
            </Text>
          </View>
        </View>
      </View>
  );
};

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
    alignSelf: "center"
  },
  divider: {
    height: '80%',
    width: 1,
    backgroundColor: 'white'
  },
});