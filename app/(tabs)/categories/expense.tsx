import ParallaxScrollView from "@/components/ParallaxScrollView";
import { BalanceActions } from "@/constants/Enums";
import { Expense, SimpleCategory } from "@/constants/Types";
import { categoryDB } from "@/db/services/categories";
import { Transaction, transactionDB } from "@/db/services/transaction";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function ExpenseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const theme = useTheme();
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [expense, setExpense] = useState<Transaction>({
    id: -1,
    date: new Date(),
    category_id: category ? +category : 0,
    amount: 0,
    title: "",
    type: BalanceActions.EXPENSE,
  });

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setExpense({ ...expense, date: currentDate });
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: expense.date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  const onSave = async () => {
    await transactionDB.saveTransaction(db, {...expense, amount: Number(amount)});
    router.back();
  }

  useEffect(() => {
    async function loadCategories() {
      const dbData = await categoryDB.getSimpleCategories(db);
      setCategories(dbData);
    }

    loadCategories();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<View />}
      headerHeight={100}
    >
      <View>
        <Text variant="labelLarge" style={styles.label}>
          Expense Title
        </Text>
        <TextInput
          mode="outlined"
          theme={{
            roundness: 50,
          }}
          value={expense.title}
          onChangeText={(title) => setExpense({ ...expense, title })}
          placeholder={"Expense Title"}
        />
      </View>
      <View>
        <Text variant="labelLarge" style={styles.label}>
          Date
        </Text>
        <TextInput
          mode="outlined"
          theme={{
            roundness: 50,
          }}
          value={expense.date.toDateString()}
          placeholder={"Date"}
          right={<TextInput.Icon icon="calendar" onPress={showMode} />}
        />
      </View>
      <View>
        <Text variant="labelLarge" style={styles.label}>
          Category
        </Text>
        <View style={[styles.picker, { borderColor: theme.colors.primary }]}>
          <Picker
            enabled={category ? false : true}
            selectedValue={expense.category_id}
            onValueChange={(v) => setExpense({ ...expense, category_id: v })}
          >
            {categories.map((category, i) => (
              <Picker.Item
                key={i}
                label={category.name}
                value={category.id}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View>
        <Text variant="labelLarge" style={styles.label}>
          Amount
        </Text>
        <TextInput
          mode="outlined"
          theme={{
            roundness: 50,
          }}
          value={amount}
          onChangeText={(amount) => setAmount(amount)}
          inputMode="decimal"
          placeholder={"Amount"}
          left={<TextInput.Icon icon="currency-usd" />}
        />
      </View>
      <Button mode="contained" uppercase onPress={onSave}>
        Save
      </Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 50,
  },
});
