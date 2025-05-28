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

export type TransactionWithCategory = Transaction & {
  category_name: string;
  category_icon: string;
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

  async listTransactions(
    db: SQLiteDatabase,
    startDate?: Date,
    endDate?: Date
  ): Promise<TransactionWithCategory[]> {
    // build the base SQL with join
    const baseQuery = `
      SELECT
        t.*,
        c.name   AS category_name,
        c.icon   AS category_icon,
        strftime('%Y-%m', t.date) AS month
      FROM transactions AS t
      LEFT JOIN categories AS c
        ON t.category_id = c.id
    `;
  
    if (startDate && endDate) {
      const startISO = startDate.toISOString();
      const endISO   = endDate.toISOString();
  
      return db.getAllAsync<TransactionWithCategory>(
        `${baseQuery}
         WHERE t.date BETWEEN ? AND ?
         ORDER BY t.date ASC;`,
        [startISO, endISO]
      );
    }
  
    // no date filters ⇒ return all
    return db.getAllAsync<TransactionWithCategory>(
      `${baseQuery}
       ORDER BY t.date ASC;`
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
        dbData = await this.getTransactionsBetween(db, id, startISO, endISO);
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
    id: number
  ): Promise<{ total: number }> {
    const result = await db.getFirstAsync<Promise<null | { total: number }>>(
      `SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE category_id = ?`,
      id
    );
    return result || { total: 0 };
  }

  async getTotalTransactionsAmount(
    db: SQLiteDatabase
  ): Promise<{ total_income: number; total_expense: number }> {
    const result = await db.getFirstAsync<{
      total_income: number;
      total_expense: number;
    }>(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
      FROM
        transactions;`
    );
    return result || { total_income: 0, total_expense: 0 };
  }
}

export const transactionDB = TransactionService.getInstance();
