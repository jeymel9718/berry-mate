import { BalanceHeader } from "@/components/BalanceHeader";
import { Transaction } from "@/components/categories/Transaction";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Category, categoryDB } from "@/db/services/categories";
import {
  Transaction as TransactionType,
  transactionDB,
} from "@/db/services/transaction";
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
  const { category } = useLocalSearchParams<{ category: string }>();
  const db = useSQLiteContext();
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
    let deferFunc = () => {};
    categoryDB
      .getCategoryByName(db, category)
      .then((dbData) => {
        if (dbData) {
          setdbCategory(dbData);
          deferFunc = transactionDB.onCategoryTransactions(
            db,
            dbData.id,
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
              console.info(category, groupedTransactions)
              setTransactions(groupedTransactions);
            }
          );
        }
      })
    return () => {
      deferFunc();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: category,
    });
  }, [navigation]);
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
          label="Add Expenses"
          style={styles.addFab}
          customSize={35}
          visible={visible}
          onPress={() => {
            router.push(`/categories/expense?category=${dbCategory.id}`);
          }}
        />
      </Portal>
      <IconButton
        icon="calendar"
        mode="contained"
        onPress={() => console.log("Pressed")}
        style={styles.calendar}
      />
      {Object.keys(transactions).map((key, index) => (
        <List.Section key={index}>
          <List.Subheader>{key}</List.Subheader>
          {transactions[key].map((transaction) => (
            <Transaction
              key={transaction.id}
              iconName={dbCategory.icon}
              date={"April 30"}
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
    bottom: 55,
  },
});
