import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PreferencesProvider } from "@/contexts/Preferences";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { migrateDbIfNeeded } from "@/db/db";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppRoutes() {
  const db = useSQLiteContext();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const result = await db.getFirstAsync<{ value: string }>(
        "SELECT value FROM user_config WHERE key = 'onboarding_complete'"
      );
      setInitialRoute(result?.value === '1' ? '(tabs)' : 'onboarding');
    };
    check();
  }, []);

  if (!initialRoute) return null;

  return (
    <Stack initialRouteName={initialRoute}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const paperTheme =
    colorScheme === "dark" ? { ...MD3DarkTheme } : { ...MD3LightTheme };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <PreferencesProvider>
          <SQLiteProvider databaseName="berry-mate.db" onInit={migrateDbIfNeeded}>
            <AppRoutes />
          </SQLiteProvider>
        </PreferencesProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
