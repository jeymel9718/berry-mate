import ParallaxScrollView from "@/components/ParallaxScrollView";
import { BalanceActions } from "@/constants/Enums";
import { transactionDB } from "@/db/services/transaction";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";

export default function IncomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [income, setIncome] = useState({
    title: "",
    amount: "",
    date: new Date(),
  });

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setIncome({ ...income, date: currentDate });
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: income.date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  const onSave = async () => {
    await transactionDB.saveTransaction(db, {
      title: income.title,
      id: -1,
      date: income.date.toISOString(),
      amount: Number(income.amount),
      type: BalanceActions.INCOME,
      category_id: 1
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
          value={income.title}
          onChangeText={(title) => setIncome({ ...income, title })}
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
          value={income.date.toDateString()}
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
          value={income.amount}
          onChangeText={(amount) => setIncome({ ...income, amount })}
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
