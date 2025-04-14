import { Saving, SavingTransaction } from "@/constants/Types";
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

  async createSaving(db: SQLiteDatabase, saving: Saving) {
    const data = {
      $name: saving.name,
      $icon: saving.icon,
      $target: saving.target,
    };
    await db.runAsync(
      "INSERT INTO savings(name, icon, target) VALUES ($name, $icon, $target)",
      data
    );
    this.eventEmitter.emit("savingsChanged");
  }

  async getSaving(
    db: SQLiteDatabase,
    id: number | string
  ): Promise<Saving | null> {
    return await db.getFirstAsync("SELECT * FROM savings WHERE id = ?", id);
  }

  onSavings(db: SQLiteDatabase, callback: (savings: Saving[]) => void) {
    const loadData = async () => {
      const dbData = await this.getSavings(db);
      callback(dbData);
    };

    // Initial setUp
    loadData();

    const subscription = this.eventEmitter.addListener(
      "savingsChanged",
      loadData
    );

    return () => subscription.remove();
  }

  async updateSaving(db: SQLiteDatabase, saving: Saving) {
    return await db.runAsync(
      "UPDATE savings SET name = ?, icon = ?, target = ? WHERE id = ?",
      saving.name,
      saving.icon,
      saving.target,
      saving.id
    );
  }

  async createTransaction(db: SQLiteDatabase, transaction: SavingTransaction) {
    const data = {
      $title: transaction.title,
      $amount: transaction.amount,
      $date: transaction.date,
      $saving_id: transaction.saving_id,
    };
    await db.runAsync(
      "INSERT INTO transactions_savings(title, amount, date, saving_id) VALUES($title, $amount, $date, $saving_id)",
      data
    );
    this.eventEmitter.emit("savingTransaction");
  }

  async getSavingTransactions(
    db: SQLiteDatabase,
    id: number
  ): Promise<SavingTransaction[]> {
    return db.getAllAsync(
      "SELECT *, strftime('%Y-%m', date) as month FROM transactions_savings WHERE saving_id = ? ORDER BY date ASC",
      id
    );
  }

  onSavingTransaction(
    db: SQLiteDatabase,
    id: number,
    callback: (transactions: SavingTransaction[]) => void
  ) {
    const loadData = async () => {
      const dbData = await this.getSavingTransactions(db, id);
      callback(dbData);
    };

    // Initial setUp
    loadData();

    const subscription = this.eventEmitter.addListener(
      "savingTransaction",
      loadData
    );

    return () => subscription.remove();
  }
}

export const savingDb: SavingService = SavingService.getInstance();
