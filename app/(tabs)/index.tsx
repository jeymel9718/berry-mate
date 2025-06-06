import Header from "@/components/home/Header";
import { TopCategory } from "@/components/home/TopCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Transaction } from "@/components/Transaction";
import { usePreferences } from "@/contexts/Preferences";
import { categoryDB, TopCategoryIcon } from "@/db/services/categories";
import {
  transactionDB,
  TransactionWithCategory,
} from "@/db/services/transaction";
import { formatTransactionDate } from "@/utils/utils";
import { useFocusEffect, useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, FAB, Portal } from "react-native-paper";

export default function IndexScreen() {
  const db = useSQLiteContext();
  const [open, setOpen] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    []
  );
  const [firstCategory, setFirstCategory] = useState<TopCategoryIcon>({ name: "", icon: "", target: 0, total_expense: 0 });
  const [secondCategory, setSecondCategory] = useState<TopCategoryIcon>({ name: "", icon: "", target: 0, total_expense: 0 });
  const [revenue, setRevenue] = useState<number>(0);
  const preferences = usePreferences();
  const navigation = useNavigation<any>();

  useFocusEffect(() => {
    preferences.showFab();

    return () => preferences.hideFab();
  });

  useEffect(() => {
    const updateData = async () => {
      const dbTransactions = await transactionDB.getLatestTransactions(db);
      const revenue = await transactionDB.getLastWeekRevenue(db);
      const category = await categoryDB.getMostExpensiveCategory(db);
      const weekCategory = await categoryDB.getLastWeekCategory(db);
      setRevenue(revenue.last_week_revenue);
      setFirstCategory(category);
      setSecondCategory(weekCategory);
      setTransactions(dbTransactions);
    };

    updateData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
    >
      <Portal>
        <FAB.Group
          open={open}
          visible={preferences.fabVisible}
          fabStyle={styles.fab}
          style={styles.fabOptions}
          icon={open ? "close" : "plus"}
          actions={[
            {
              icon: "bank-transfer-in",
              label: "Add Income",
              onPress: () =>
                navigation.navigate("categories", {
                  screen: "income",
                  initial: false,
                }),
            },
            {
              icon: "bank-transfer-out",
              label: "Add Expense",
              onPress: () =>
                navigation.navigate("categories", {
                  screen: "expense",
                  initial: false,
                }),
            },
          ]}
          onStateChange={({ open }: { open: boolean }) => setOpen(open)}
        />
      </Portal>
      <Card elevation={4}>
        <TopCategory
          firstCategory={firstCategory}
          secondCategory={secondCategory}
          revenue={revenue}
        />
      </Card>
      <View style={{ marginTop: 20, gap: 5 }}>
        {transactions.map((transaction, index) => (
          <Transaction
            key={index}
            iconName={transaction.category_icon}
            date={formatTransactionDate(transaction.date)}
            category={transaction.category_name}
            transaction={transaction.title}
            value={transaction.amount}
          />
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fab: {},
  fabOptions: {
    bottom: 45,
    right: 0,
  },
});
