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

export type DayTransaction = {
  day: string;
  income: number;
  expenses: number;
}

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

  async listTransactions(
    db: SQLiteDatabase,
    income: boolean = false,
    expense: boolean = false,
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
      const endISO = endDate.toISOString();

      return db.getAllAsync<TransactionWithCategory>(
        `${baseQuery}
         WHERE t.date BETWEEN ? AND ?
         AND (
            /* if both flags false, include all: */
            (? = 0 AND ? = 0)
            /* else only the checked types: */
            OR (t.type = 'income'  AND ? = 1)
            OR (t.type = 'expense' AND ? = 1)
          )
         ORDER BY t.date ASC;`,
        [
          startISO,
          endISO,
          income ? 1 : 0,
          expense ? 1 : 0,
          income ? 1 : 0,
          expense ? 1 : 0,
        ]
      );
    }

    // no date filters ⇒ return all
    return db.getAllAsync<TransactionWithCategory>(
      `${baseQuery}
        WHERE (
            /* if both flags false, include all: */
            (? = 0 AND ? = 0)
            /* else only the checked types: */
            OR (t.type = 'income'  AND ? = 1)
            OR (t.type = 'expense' AND ? = 1)
          )
       ORDER BY t.date ASC;`,
      [income ? 1 : 0, expense ? 1 : 0, income ? 1 : 0, expense ? 1 : 0]
    );
  }

  async listIncomeTransactions(
    db: SQLiteDatabase,
    startDate?: Date,
    endDate?: Date
  ): Promise<TransactionWithCategory[]> {
    const baseQuery = `
      SELECT
        t.*,
        c.name   AS category_name,
        c.icon   AS category_icon,
        strftime('%Y-%m', t.date) AS month
      FROM transactions AS t
      LEFT JOIN categories AS c
        ON t.category_id = c.id
      WHERE t.type = 'income'
    `;
    if (startDate && endDate) {
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      return db.getAllAsync<TransactionWithCategory>(
        `${baseQuery}
         AND t.date BETWEEN ? AND ?
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

  async listExpenseTransactions(
    db: SQLiteDatabase,
    startDate?: Date,
    endDate?: Date
  ): Promise<TransactionWithCategory[]> {
    const baseQuery = `
      SELECT
        t.*,
        c.name   AS category_name,
        c.icon   AS category_icon,
        strftime('%Y-%m', t.date) AS month
      FROM transactions AS t
      LEFT JOIN categories AS c
        ON t.category_id = c.id
      WHERE t.type = 'expense'
    `;
    if (startDate && endDate) {
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();
      return db.getAllAsync<TransactionWithCategory>(
        `${baseQuery}
         AND t.date BETWEEN ? AND ?
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

  async getLastWeekTransactions(db: SQLiteDatabase) : Promise<DayTransaction[]> {
    // Fetch transactions for the last 7 days, grouped by day of the week
    // and calculate total income and expenses for each day.
    // The result will be an array of objects with day, weekday, income, and expenses.
    const result = await db.getAllAsync<DayTransaction>(`
      SELECT
        strftime('%w', date) AS weekday_num,
        CASE strftime('%w', date)
          WHEN '0' THEN 'Sun'
          WHEN '1' THEN 'Mon'
          WHEN '2' THEN 'Tue'
          WHEN '3' THEN 'Wed'
          WHEN '4' THEN 'Thu'
          WHEN '5' THEN 'Fri'
          WHEN '6' THEN 'Sat'
        END AS day,
        COALESCE(SUM(CASE WHEN type = 'income'  THEN amount END), 0)  AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0)  AS expenses
      FROM
        transactions
      WHERE
        date(date) BETWEEN date('now', '-6 days') AND date('now')
      GROUP BY
        weekday_num
      ORDER BY
        weekday_num;
      `);
      return result;
  }
}

export const transactionDB = TransactionService.getInstance();
