import { Transaction } from "@/components/categories/Transaction";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ProgressBar } from "@/components/home/ProgressBar";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RangeDatePicker } from "@/components/RangeDatePicker";
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
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
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
  const [amount, setAmount] = useState<number>(0);
  const navigation = useNavigation();
  const router = useRouter();

  const savingProgress = useMemo(() => {
    if (saving.target <= 0) {
      // no valid target ⇒ show 0%
      return 0;
    }
    const rawPct = (amount / saving.target) * 100;
    const clamped = Math.min(Math.max(rawPct, 0), 100);
    return Math.round(clamped * 100) / 100;
  }, [amount]);

  // getTransactionsAmount obtain the total amount saved from the transactions
  async function getTransactionsAmount(id: number) {
    const dbData = await savingDb.getTotalTransactionsAmount(db, id);
    if (dbData) {
      setAmount(dbData.total_saved);
    }
  }

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
  });

  useEffect(() => {
    const deferFunc = savingDb.onSavingTransaction(db, Number(id), (values) => {
      getTransactionsAmount(Number(id));
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
    }, startDate, endDate);
    return () => {
      deferFunc();
    };
  }, [startDate, endDate]);

  // set the title of the screen to the name of the saving
  useEffect(() => {
    navigation.setOptions({
      title: save,
    });
  }, [navigation]);

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
      <RangeDatePicker
        visible={showDatePicker}
        onCancel={onDatePickerCancel}
        onApply={onDatePickerApply}
        onClear={onDatePickerClear}
      />
      {/* Goal and Amount Saved */}
      <View style={styles.goalContainer}>
        <View style={styles.goalRowContainer}>
          <View>
            <Text style={styles.goalLabel}>Goal</Text>
            <Text style={styles.goalAmount}>${saving.target}</Text>
            <Text style={styles.savedLabel}>Amount Saved</Text>
            <Text style={styles.savedAmount}>${amount}</Text>
          </View>
          <Surface style={styles.iconContainer}>
            <CircularProgressBar
              size={windowWidth * 0.26}
              strokeWidth={4}
              progress={savingProgress}
              color="#0068FF"
              backgroundColor="#F1FFF3"
              iconName={saving.icon}
            />
            <Text>{save}</Text>
          </Surface>
        </View>

        {/* Progress Bar */}
        <ProgressBar progress={savingProgress} amount={saving.target} />
        <Text style={styles.progressText}>
          {savingProgress}% of Your Expenses, Looks Good.
        </Text>
      </View>
      {/* Transactions List */}
      {Object.keys(transactions).map((key, index) => (
        <List.Section key={index}>
          <View style={styles.listHeader}>
            <List.Subheader>{key}</List.Subheader>
            {index === 0 && (
              <IconButton
                icon="calendar"
                selected
                mode="contained"
                onPress={() => setShowDatePicker(true)}
                style={styles.calendar}
              />
            )}
          </View>
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
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendar: {},
  addFab: {
    position: "absolute",
    alignSelf: "center",
    bottom: 55,
    borderRadius: 25,
  },
});
