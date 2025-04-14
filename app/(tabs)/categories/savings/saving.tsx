import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Expense } from "@/constants/Types";
import { savingDb } from "@/db/services/savings";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function SavingScreen() {
  const { saving } = useLocalSearchParams<{ saving: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: new Date(),
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
    await savingDb.createTransaction(db, {
      id: -1,
      title: expense.title,
      amount: Number(expense.amount),
      date: expense.date.toISOString(),
      saving_id: +saving,
    });
    router.back();
  };

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
          Amount
        </Text>
        <TextInput
          mode="outlined"
          theme={{
            roundness: 50,
          }}
          value={expense.amount}
          onChangeText={(amount) => setExpense({ ...expense, amount })}
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
