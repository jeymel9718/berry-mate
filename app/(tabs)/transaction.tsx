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
import { useContext, useEffect, useReducer } from "react";
import { usePreferences } from "@/contexts/Preferences";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { transactionDB } from "@/db/services/transaction";


function reducer(state: BalanceState, action: BalanceActions) {
  switch (action) {
    case BalanceActions.INCOME: {
      state.income = !state.income;
      state.expense = false;
      return {...state};
    }
    case BalanceActions.EXPENSE: {
      state.expense = !state.expense;
      state.income = false;
      return {...state};
    }
  }
}

export default function TransactionScreen() {
  const db = useSQLiteContext();
  const [state, dispatch] = useReducer(reducer, {income: false, expense: false});
  const preferences = usePreferences();
  
  useFocusEffect(() => {
    preferences.showFab();

    return () => preferences.hideFab();
  });
  
  useEffect(() => {
    transactionDB.listTransactions(db).then((transactions) => {
      console.info(transactions)
    })
  }, [])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <TransactionHeader
          expense="$1,187.40"
          income="$4,120.00"
          balance="$7,783.00"
          incomeSelected={state.income}
          expenseSelected={state.expense}
          actions={dispatch}
        />
      }
    >
      <IconButton
        icon="calendar"
        mode="contained"
        onPress={() => console.log("Pressed")}
        style={styles.calendar}
      />
      <List.Section>
        <List.Subheader>April</List.Subheader>
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>March</List.Subheader>
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>February</List.Subheader>
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
        <Transaction
          iconName="car-outline"
          date="April 30"
          category="Transportation"
          transaction="Fuel"
          value={20000}
        />
      </List.Section>
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
