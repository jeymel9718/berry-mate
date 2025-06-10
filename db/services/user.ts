import { SQLiteDatabase } from "expo-sqlite";

class UserService {
  static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getValue(db: SQLiteDatabase, key: string): Promise<string | null> {
    const result = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM user_config WHERE key = ?",
      key
    );
    return result ? result.value : null;
  }

  async setValue(db: SQLiteDatabase, key: string, value: string) {
    await db.runAsync(
      "INSERT INTO user_config(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [key, value]
    );
  }
}

export const userDB = UserService.getInstance();
