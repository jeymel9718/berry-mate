import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TransactionHeader } from "@/components/transaction/TransactionHeader";
import { IconButton, List } from "react-native-paper";
import { Transaction } from "@/components/Transaction";
import { BalanceActions } from "@/constants/Enums";
import { BalanceState } from "@/constants/Types";
import { useContext, useEffect, useReducer, useState } from "react";
import { usePreferences } from "@/contexts/Preferences";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  transactionDB,
  TransactionWithCategory,
} from "@/db/services/transaction";
import { formatTransactionDate } from "@/utils/utils";
import { RangeDatePicker } from "@/components/RangeDatePicker";

function reducer(state: BalanceState, action: BalanceActions) {
  switch (action) {
    case BalanceActions.INCOME: {
      state.income = !state.income;
      state.expense = false;
      return { ...state };
    }
    case BalanceActions.EXPENSE: {
      state.expense = !state.expense;
      state.income = false;
      return { ...state };
    }
  }
}

export default function TransactionScreen() {
  const db = useSQLiteContext();
  const [state, dispatch] = useReducer(reducer, {
    income: false,
    expense: false,
  });
  const [transactionsBalance, setTransactionsBalance] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenses, setExpenses] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const preferences = usePreferences();
  const [transactions, setTransactions] = useState<{
    [month: string]: TransactionWithCategory[];
  }>({});

  useFocusEffect(() => {
    preferences.showFab();

    return () => preferences.hideFab();
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsList = await transactionDB.listTransactions(
        db,
        state.income,
        state.expense,
        startDate,
        endDate
      );
      // Group transactions by month
      const groupedTransactions: {
        [month: string]: TransactionWithCategory[];
      } = {};
      transactionsList.forEach((transaction) => {
        const month = new Date(transaction.date).toLocaleString("default", {
          month: "long",
        });
        if (!groupedTransactions[month]) {
          groupedTransactions[month] = [];
        }
        groupedTransactions[month].push(transaction);
      });
      setTransactions(groupedTransactions);
    };
    fetchTransactions();
  }, [startDate, endDate, state.expense, state.income]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch total balance and expenses from the database
      const transactionsBalance =
        await transactionDB.getTotalTransactionsAmount(db);

      // Update the state or context with the fetched data
      // This is just a placeholder, you would typically use a state management solution
      setIncome(transactionsBalance.total_income);
      setExpenses(transactionsBalance.total_expense);
      setTransactionsBalance(
        transactionsBalance.total_income - transactionsBalance.total_expense
      );
    };

    fetchData();
  }, []);

  // onDatePickerCancel is called when the user cancels the date range selection
  const onDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const onDatePickerClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setShowDatePicker(false);
  };

  // onDatePickerApply is called when the user selects a date range
  const onDatePickerApply = (range: { startDate: string; endDate: string }) => {
    setShowDatePicker(false);
    // Handle the selected date range
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <TransactionHeader
          expense={`$${expenses.toFixed(2)}`}
          income={`$${income.toFixed(2)}`}
          balance={`$${transactionsBalance.toFixed(2)}`}
          incomeSelected={state.income}
          expenseSelected={state.expense}
          actions={dispatch}
        />
      }
    >
      <RangeDatePicker
        visible={showDatePicker}
        onApply={onDatePickerApply}
        onCancel={onDatePickerCancel}
        onClear={onDatePickerClear}
      />
      <IconButton
        icon="calendar"
        mode="contained"
        onPress={() => setShowDatePicker(true)}
        style={styles.calendar}
      />
      {Object.keys(transactions).map((month, index) => (
        <List.Section key={index}>
          <List.Subheader>{month}</List.Subheader>
          {transactions[month].map((transaction) => (
            <Transaction
              key={transaction.id}
              iconName={transaction.category_icon}
              date={formatTransactionDate(transaction.date)}
              category={transaction.category_name}
              transaction={transaction.title}
              value={transaction.amount}
            />
          ))}
        </List.Section>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  calendar: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
