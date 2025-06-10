import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { userDB } from "@/db/services/user";

export default function OnboardingSetup() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [currency, setCurrency] = useState("USD");
  const [expense, setExpense] = useState("");

  const onFinish = async () => {
    await userDB.setValue(db, "currency", currency);
    await userDB.setValue(db, "monthly_expense", expense);
    await userDB.setValue(db, "onboarding_complete", "1");
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Setup Preferences</Text>
      <TextInput
        label="Currency Symbol"
        mode="outlined"
        style={styles.input}
        value={currency}
        onChangeText={setCurrency}
      />
      <TextInput
        label="Monthly Expense Target"
        mode="outlined"
        inputMode="decimal"
        style={styles.input}
        value={expense}
        onChangeText={setExpense}
      />
      <Button mode="contained" onPress={onFinish} style={styles.button}>
        Finish
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 16 },
  button: { marginTop: 16 },
});
