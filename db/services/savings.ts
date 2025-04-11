import { Saving } from "@/constants/Types";
import { SQLiteDatabase } from "expo-sqlite";
import { NativeEventEmitter, NativeModules } from "react-native";

class SavingService {
  static instance: SavingService;
  private eventEmitter = new NativeEventEmitter(
    NativeModules.SQLiteEventService || null
  );

  constructor() {}

  static getInstance(): SavingService {
    if (!SavingService.instance) {
      SavingService.instance = new SavingService();
    }

    return SavingService.instance;
  }

  async getSavings(db: SQLiteDatabase): Promise<Saving[]> {
    return await db.getAllAsync("SELECT * FROM savings");
  }
}
