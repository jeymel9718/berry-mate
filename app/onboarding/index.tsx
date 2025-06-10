import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

export default function OnboardingWelcome() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to Berry Mate
      </Text>
      <Button mode="contained" onPress={() => router.push("/onboarding/setup")}> 
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { marginBottom: 20, textAlign: "center" },
});
