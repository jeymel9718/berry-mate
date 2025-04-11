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

  async getCategoryTransactions(db: SQLiteDatabase, categoryID: number): Promise<Transaction[]> {
    return db.getAllAsync(
      `SELECT *, strftime('%Y-%m', date) as month 
       FROM transactions 
       WHERE category_id = ?
       ORDER BY date ASC`,
      categoryID
    );
  }

  onCategoryTransactions(db: SQLiteDatabase, id: number, callback: (transactions: Transaction[]) => void) {
    const loadData = async () => {
      const dbData = await this.getCategoryTransactions(db, id);
      callback(dbData);
    }

    //initialize data
    loadData();

    const subscription = this.eventEmitter.addListener("expenseChanged", loadData);

    return () => subscription.remove();
  }
}

export const transactionDB = TransactionService.getInstance();