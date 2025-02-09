import { Stack } from "expo-router";

export default function SavingsLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerTransparent: true, headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ title: "Savings" }} />
      <Stack.Screen name="[save]" />
      <Stack.Screen name="saving" options={{ title: "Add Savings" }} />
    </Stack>
  );
};