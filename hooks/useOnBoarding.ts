import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";

export function useOnBoarding() {
  const [isOnBoardingComplete, setIsOnBoardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnBoardingStatus = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('berry-mate.db');
        const result = await db.getFirstAsync<{ value: string }>(
          "SELECT value FROM user_config WHERE key = 'onboarding_complete'"
        );
        setIsOnBoardingComplete(result?.value === '1');
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnBoardingComplete(false);
      }
    };

    checkOnBoardingStatus();
  }, []);

  return isOnBoardingComplete;
}