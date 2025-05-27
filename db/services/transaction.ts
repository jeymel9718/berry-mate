import { SQLiteDatabase } from "expo-sqlite";
import { NativeEventEmitter, NativeModules } from "react-native";
import { BalanceActions } from "@/constants/Enums";

export type Transaction = {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: BalanceActions;
  category_id: number;
  month?: string;
};

class TransactionService {
  static instance: TransactionService;
  private eventEmitter = new NativeEventEmitter(
    NativeModules.SQLiteEventService || null
  );

  constructor() {}

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }

    return TransactionService.instance;
  }

  async saveTransaction(db: SQLiteDatabase, transaction: Transaction) {
    const data = {
      $title: transaction.title,
      $date: transaction.date,
      $amount: transaction.amount,
      $type: transaction.type,
      $category_id: transaction.category_id,
    };

    await db.runAsync(
      "INSERT INTO transactions(title, date, amount, type, category_id) VALUES ($title, $date, $amount, $type, $category_id)",
      data
    );

    this.eventEmitter.emit(`${transaction.type}Changed`);
  }

  async listIncomes(db: SQLiteDatabase): Promise<Transaction[]> {
    return db.getAllAsync(
      `SELECT * FROM transactions WHERE type = "${BalanceActions.INCOME}"`
    );
  }

  async listTransactions(db: SQLiteDatabase): Promise<Transaction[]> {
    return db.getAllAsync(
      `SELECT *, strftime('%Y-%m', date) as month 
       FROM transactions
       ORDER BY date ASC`
    );
  }

  async listExpense(db: SQLiteDatabase): Promise<Transaction[]> {
    return db.getAllAsync(
      `SELECT * FROM transactions WHERE type = "${BalanceActions.EXPENSE}"`
    );
  }

  async getCategoryTransactions(
    db: SQLiteDatabase,
    categoryID: number
  ): Promise<Transaction[]> {
    return db.getAllAsync(
      `SELECT *, strftime('%Y-%m', date) as month 
       FROM transactions 
       WHERE category_id = ?
       ORDER BY date ASC`,
      categoryID
    );
  }

  async getTransactionsBetween(
    db: SQLiteDatabase,
    categoryId: number,
    startISO: string,
    endISO: string
  ): Promise<Transaction[]> {
    return db.getAllAsync<Transaction>(
      `
        SELECT *
          FROM transactions
         WHERE category_id = ?
           AND date BETWEEN ? AND ?
         ORDER BY date ASC;
        `,
      [categoryId, startISO, endISO]
    );
  }

  onCategoryTransactions(
    db: SQLiteDatabase,
    id: number,
    callback: (transactions: Transaction[]) => void,
    startDate?: Date,
    endDate?: Date,
    isIncome: boolean = false
  ) {
    const loadData = async () => {
      let dbData: Transaction[];

      if (startDate && endDate) {
        // --- filter by ISO range ---
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();
        dbData = await this.getTransactionsBetween(
          db,
          id,
          startISO,
          endISO
        );
      } else {
        // --- no dates provided ⇒ fetch all ---
        dbData = await this.getCategoryTransactions(db, id);
      }

      callback(dbData);
    };

    //initialize data
    loadData();

    const subscription = this.eventEmitter.addListener(
      isIncome ? "incomeChanged" : "expenseChanged",
      loadData
    );

    return () => subscription.remove();
  }

  async getTotalAmount(
    db: SQLiteDatabase,
    id: number): Promise<{ total: number }> {
    const result = await db.getFirstAsync<Promise<null | {total: number}>>(
      `SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE category_id = ?`,
      id
    );
    return result || { total: 0 };
  }
}

export const transactionDB = TransactionService.getInstance();
