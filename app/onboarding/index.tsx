import { useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Onboarding from "react-native-onboarding-swiper";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

const CURRENCIES = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "CRC (₡)", value: "CRC" },
];

export default function OnboardingWelcome() {
  const router = useRouter();

  const [target, setTarget] = useState("");
  const [currency, setCurrency] = useState("USD");

  return (
    <Onboarding
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      showSkip={false}
      bottomBarHighlight={false}
      pages={[
        {
          backgroundColor: "#0dd8a7",
          image: <Image source={require("@/assets/images/welcome.png")} />,
          title: "Welcome To\nBerry-mate",
          subtitle: "Your financial companion",
        },
        {
          backgroundColor: "#0dd8a7",
          image: <Image source={require("@/assets/images/welcome2.png")} />,
          title: "¿Are you ready to take control of your finances?",
        },
        {
          backgroundColor: "#0dd8a7",
          title: "Let's start setting your monthly target",
          subtitle: "How much do you want to spend per month?",
          image: (
            <View style={{ alignItems: "center", width: "80%" }}>
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
          containerStyles: {flexDirection: "row-reverse"}
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#232323",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#222",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 6,
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
});
