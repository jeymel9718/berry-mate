import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        target REAL,
        static BOOL DEFAULT FALSE
      );
  
  CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,          -- ISO formatted date string
        amount REAL NOT NULL,
        type TEXT NOT NULL,          -- 'expense' or 'income'
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    
  CREATE TABLE IF NOT EXISTS savings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      target REAL NOT NULL
    );
  
  CREATE TABLE IF NOT EXISTS transactions_savings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      saving_id INTEGER,
      FOREIGN KEY (saving_id) REFERENCES savings(id)
  );

  CREATE TABLE IF NOT EXISTS user_config (
      key TEXT PRIMARY KEY,
      value TEXT
  );

  INSERT INTO user_config (key, value) VALUES ('currency', 'USD');
  INSERT INTO user_config (key, value) VALUES ('monthly_expense', '0');
  INSERT INTO user_config (key, value) VALUES ('onboarding_complete', '0');
  INSERT INTO categories (name, icon, target, static) VALUES ('Incomes', 'cash-multiple', 4000, TRUE);
  INSERT INTO categories (name, icon, target) VALUES ('Food', 'silverware-variant', 4000);
  INSERT INTO categories (name, icon, target) VALUES ('Transport', 'car-outline', 4000);
  INSERT INTO categories (name, icon, target) VALUES ('Groceries', 'store-outline', 4000);
  INSERT INTO categories (name, icon, target) VALUES ('Rent', 'home-city-outline', 4000);
  INSERT INTO categories (name, icon, target, static) VALUES ('savings', 'piggy-bank', 0, TRUE);
  `);

    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    await db.execAsync(`
      INSERT OR IGNORE INTO user_config (key, value) VALUES ('monthly_expense', '0');
      INSERT OR IGNORE INTO user_config (key, value) VALUES ('onboarding_complete', '0');
    `);
    currentDbVersion = 2;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
