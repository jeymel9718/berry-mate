import { SQLiteDatabase } from "expo-sqlite";
import { BaseStorage } from "./db";

export type Transaction = {
  date: string;
  amount: number;
  type: string;
  category_id: number;
};

class TransactionStorage extends BaseStorage{
  static instance: TransactionStorage;

  private constructor() {
    super();
  }

  static getInstance(): TransactionStorage {
    if (!TransactionStorage.instance) {
      TransactionStorage.instance = new TransactionStorage();
    }

    return TransactionStorage.instance;
  }

  async getTransactions(db: SQLiteDatabase): Promise<any[]> {
    return await db.getAllAsync("SELECT * FROM transactions");
  }

  async createTransaction(db: SQLiteDatabase, transaction: Transaction) {
    const data = {
      $date: transaction.date,
      $amount: transaction.amount,
      $type: transaction.type,
      $category_id: transaction.category_id,
    };
    await db.runAsync(
      "INSERT INTO transactions(date, amount, type, category_id) VALUES ($date, $amount, $type, $category_id)",
      data
    );
    this.emitChange();
  }

  async getTransaction(db: SQLiteDatabase, id: number): Promise<any> {
    return await db.getFirstAsync(
      "SELECT * FROM transactions WHERE id = ?",
      id
    );
  }
}

export const transactionDB = TransactionStorage.getInstance();
