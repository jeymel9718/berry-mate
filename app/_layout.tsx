import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PreferencesProvider } from "@/contexts/Preferences";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "@/db/db";
import { useOnBoarding } from "@/hooks/useOnBoarding";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const {loading, isOnBoardingComplete} = useOnBoarding();

  const paperTheme =
    colorScheme === "dark" ? { ...MD3DarkTheme } : { ...MD3LightTheme };

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded || loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <PreferencesProvider>
          <SQLiteProvider
            databaseName="berry-mate.db"
            onInit={migrateDbIfNeeded}
          >
            <Stack>
              <Stack.Protected guard={isOnBoardingComplete}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Protected guard={!isOnBoardingComplete}>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Screen name="+not-found" />
            </Stack>
          </SQLiteProvider>
        </PreferencesProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
