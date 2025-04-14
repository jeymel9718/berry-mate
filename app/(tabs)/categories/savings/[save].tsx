import { Transaction } from "@/components/categories/Transaction";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ProgressBar } from "@/components/home/ProgressBar";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { windowHeight, windowWidth } from "@/constants/Dimensions";
import { Saving, SavingTransaction } from "@/constants/Types";
import { savingDb } from "@/db/services/savings";
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
import {
  FAB,
  Icon,
  IconButton,
  List,
  Portal,
  Surface,
  Text,
} from "react-native-paper";

export default function SaveScreen() {
  const { save, id } = useLocalSearchParams<{ save: string; id: string }>();
  const db = useSQLiteContext();
  const [visible, setVisible] = useState<boolean>();
  const [saving, setSaving] = useState<Saving>({
    id: -1,
    name: "",
    icon: "",
    target: 0,
  });
  const [transactions, setTransactions] = useState<{
    [month: string]: SavingTransaction[];
  }>({});
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(() => {
    setVisible(true);

    return () => setVisible(false);
  });

  useEffect(() => {
    savingDb.getSaving(db, id).then((value) => {
      if (value) {
        setSaving(value);
      }
    });

    const deferFunc = savingDb.onSavingTransaction(db, Number(id), (values) => {
      const groupedTransactions: {
        [month: string]: SavingTransaction[];
      } = {};
      values.map((transaction) => {
        const month = transaction.month ?? "";
        if (groupedTransactions[month]) {
          groupedTransactions[month].push(transaction);
        } else {
          groupedTransactions[month] = [transaction];
        }
      });
      setTransactions(groupedTransactions);
    });
    return () => {
      deferFunc();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: save,
    });
  }, [navigation]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<View />}
      headerHeight={100}
    >
      <Portal>
        <FAB
          label="Add Savings"
          style={styles.addFab}
          customSize={35}
          visible={visible}
          onPress={() => {
            router.push(`/categories/savings/saving?saving=${id}`);
          }}
        />
      </Portal>
      {/* Goal and Amount Saved */}
      <View style={styles.goalContainer}>
        <View style={styles.goalRowContainer}>
          <View>
            <Text style={styles.goalLabel}>Goal</Text>
            <Text style={styles.goalAmount}>${saving.target}</Text>
            <Text style={styles.savedLabel}>Amount Saved</Text>
            <Text style={styles.savedAmount}>$653.31</Text>
          </View>
          <Surface style={styles.iconContainer}>
            <CircularProgressBar
              size={windowWidth * 0.26}
              strokeWidth={4}
              progress={30}
              color="#0068FF"
              backgroundColor="#F1FFF3"
              iconName={saving.icon}
            />
            <Text>{save}</Text>
          </Surface>
        </View>

        {/* Progress Bar */}
        <ProgressBar progress={30} amount={saving.target} />
        <Text style={styles.progressText}>
          30% of Your Expenses, Looks Good.
        </Text>
      </View>

      <View style={styles.listContainer}>
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
                iconName={saving.icon}
                date={formatTransactionDate(transaction.date)}
                name={transaction.title}
                value={transaction.amount}
              />
            ))}
          </List.Section>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  goalContainer: {
    alignItems: "center",
  },
  goalRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  iconContainer: {
    backgroundColor: "#6DB6FE",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
  },
  goalLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  goalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  savedLabel: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
  },
  savedAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#38B16C",
  },
  progressBarBackground: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    height: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  progressBarFill: {
    width: "40%",
    backgroundColor: "#38B16C",
    height: 12,
    borderRadius: 6,
  },
  progressText: {
    marginTop: 8,
    color: "#6B7280",
  },
  listContainer: {
    position: "relative",
  },
  calendar: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  addFab: {
    position: "absolute",
    alignSelf: "center",
    bottom: 55,
    borderRadius: 25,
  },
});
