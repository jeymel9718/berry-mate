import { BalanceHeader } from "@/components/BalanceHeader";
import { Transaction } from "@/components/categories/Transaction";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RangeDatePicker } from "@/components/RangeDatePicker";
import { windowWidth } from "@/constants/Dimensions";
import { Category, categoryDB } from "@/db/services/categories";
import {
  Transaction as TransactionType,
  transactionDB,
} from "@/db/services/transaction";
import { formatTransactionDate } from "@/utils/utils";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, List, Portal } from "react-native-paper";

export default function CategoryScreen() {
  const { category, id } = useLocalSearchParams<{
    category: string;
    id: string;
  }>();
  const db = useSQLiteContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>();
  const [dbCategory, setdbCategory] = useState<Category>({
    id: -1,
    name: "",
    icon: "",
    target: 0,
    static: true,
  });
  const [transactions, setTransactions] = useState<{
    [month: string]: TransactionType[];
  }>({});
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(() => {
    setVisible(true);

    return () => setVisible(false);
  });

  useEffect(() => {
    categoryDB.getCategory(db, id).then((dbData) => {
      if (dbData) {
        setdbCategory(dbData);
      }
    });
  });
  useEffect(() => {
    const deferFunc = transactionDB.onCategoryTransactions(
      db,
      Number(id),
      (transactions) => {
        const groupedTransactions: {
          [month: string]: TransactionType[];
        } = {};
        transactions.map((transaction) => {
          const month = transaction.month ?? "";
          if (groupedTransactions[month]) {
            groupedTransactions[month].push(transaction);
          } else {
            groupedTransactions[month] = [transaction];
          }
        });
        setTransactions(groupedTransactions);
      }
    );
    return () => {
      deferFunc();
    };
  }, [startDate, endDate]);

  useEffect(() => {
    navigation.setOptions({
      title: category,
    });
  }, [navigation]);

  const handleAdd = () => {
    if (category === "Incomes") {
      router.push(`/categories/income`);
    } else {
      router.push(`/categories/expense?category=${dbCategory.id}`);
    }
  };

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
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <BalanceHeader />
        </View>
      }
      headerHeight={220}
    >
      <Portal>
        <FAB
          label={category === "Incomes" ? "Add Incomes" : "Add Expenses"}
          style={styles.addFab}
          customSize={38}
          visible={visible}
          onPress={handleAdd}
        />
      </Portal>
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
      {Object.keys(transactions).map((key, index) => (
        <List.Section key={index}>
          <List.Subheader>{key}</List.Subheader>
          {transactions[key].map((transaction) => (
            <Transaction
              key={transaction.id}
              iconName={dbCategory.icon}
              date={formatTransactionDate(transaction.date)}
              name={transaction.title}
              value={transaction.amount}
            />
          ))}
        </List.Section>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  calendar: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  addFab: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: 55,
  },
});
