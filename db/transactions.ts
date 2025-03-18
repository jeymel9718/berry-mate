import { SQLiteDatabase } from "expo-sqlite";

export type Transaction = {
  date: string;
  amount: number;
  type: string;
  category_id: number;
};

export async function createTransaction(
  db: SQLiteDatabase,
  transaction: Transaction
) {
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
};

export async function getTransaction(
  db: SQLiteDatabase,
  id: number
): Promise<any> {
  return await db.getFirstAsync("SELECT * FROM transactions WHERE id = ?", id);
};

export async function getTransactions(db: SQLiteDatabase): Promise<any[]> {
  return await db.getAllAsync("SELECT * FROM transactions");
};
