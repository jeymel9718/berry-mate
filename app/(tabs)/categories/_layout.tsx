import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function CategoriesLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerTransparent: true, headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ title: "Categories" }} />
      <Stack.Screen name="[category]" />
      <Stack.Screen name="expense" options={{title: "Add Expenses"}} />
      <Stack.Screen name="savings" options={{ headerShown: false }}/>
      <Stack.Screen name="More" options={{title: "Add New Category"}} />
    </Stack>
  );
}
