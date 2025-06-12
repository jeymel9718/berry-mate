import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";

export function useOnBoarding(): {loading: boolean, isOnBoardingComplete: boolean} {
  const [isOnBoardingComplete, setIsOnBoardingComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkOnBoardingStatus = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('berry-mate.db');
        const result = await db.getFirstAsync<{ value: string }>(
          "SELECT value FROM user_config WHERE key = 'onboarding_complete'"
        );
        setIsOnBoardingComplete(result?.value === '1');
        setLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnBoardingComplete(false);
        setLoading(false);
      }
    };

    checkOnBoardingStatus();
  }, []);

  return {loading, isOnBoardingComplete};
}