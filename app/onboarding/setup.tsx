import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { userDB } from "@/db/services/user";

const CURRENCIES = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "CRC (₡)", value: "CRC" },
];

export default function OnboardingSetup() {
  const router = useRouter();
  const db = useSQLiteContext();

  const [step, setStep] = useState(0);
  const [target, setTarget] = useState("");
  const [currency, setCurrency] = useState("USD");

  const screens = [
    {
      title: "Welcome To\nBerry-mate",
      subtitle: "Your new Expense Manager",
      content: (
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
      ),
    },
    {
      title: "Set Your\nMonthly Target",
      subtitle: "How much do you want to spend per month?",
      content: (
        <View style={{ alignItems: "center", width: "100%" }}>
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={target}
            onChangeText={setTarget}
            placeholder="Enter amount"
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Currency</Text>
            <Picker
              selectedValue={currency}
              onValueChange={setCurrency}
              style={styles.picker}
              itemStyle={{ fontSize: 16 }}
            >
              {CURRENCIES.map((c) => (
                <Picker.Item key={c.value} label={c.label} value={c.value} />
              ))}
            </Picker>
          </View>
        </View>
      ),
    },
    {
      title: "All Set!",
      subtitle: "Let's start tracking your expenses.",
      content: (
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.imageSmall}
          resizeMode="contain"
        />
      ),
    },
  ];

  const isLast = step === screens.length - 1;

  const onFinish = async () => {
    await userDB.setValue(db, "currency", currency);
    await userDB.setValue(db, "monthly_expense", target);
    await userDB.setValue(db, "onboarding_complete", "1");
    router.replace("/(tabs)");
  };

  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text variant="titleLarge" style={styles.title}>
          {screens[step].title}
        </Text>
        {screens[step].subtitle ? (
          <Text variant="bodyMedium" style={styles.subtitle}>
            {screens[step].subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.contentSection}>{screens[step].content}</View>
      <View style={styles.bottomSection}>
        <View style={styles.dots}>
          {screens.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, step === idx && styles.activeDot]}
            />
          ))}
        </View>
        <Button mode="contained" onPress={handleNext} style={styles.button}>
          {isLast ? "Get Started" : "Next"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0dd8a7",
    paddingTop: 56,
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    color: "#232323",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    color: "#222",
    textAlign: "center",
    marginBottom: 6,
  },
  contentSection: {
    backgroundColor: "#f3fff7",
    borderRadius: 40,
    padding: 30,
    alignItems: "center",
    width: "90%",
    minHeight: 260,
    marginBottom: 16,
  },
  input: {
    marginTop: 4,
    marginBottom: 12,
    width: "100%",
  },
  pickerContainer: {
    width: "100%",
    marginTop: 12,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    color: "#232323",
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    color: "#232323",
    marginBottom: 2,
    marginLeft: 4,
    fontWeight: "600",
  },
  bottomSection: {
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  button: {
    marginTop: 18,
    marginBottom: 18,
    alignSelf: "center",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#b2ead5",
    margin: 4,
  },
  activeDot: {
    backgroundColor: "#0dd8a7",
    width: 14,
    height: 14,
  },
  image: {
    width: 180,
    height: 180,
    marginVertical: 24,
  },
  imageSmall: {
    width: 150,
    height: 150,
    marginVertical: 24,
  },
});
