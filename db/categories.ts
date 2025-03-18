import { SQLiteDatabase } from "expo-sqlite";

export type Category = {
  id: number;
  name: string;
  icon: string;
  target: number;
};

export async function createCategory(db: SQLiteDatabase, category: Category) {
  const data = {
    $name: category.name,
    $icon: category.icon,
    $target: category.target,
  };

  await db.runAsync(
    "INSERT INTO categories(name, icon, target) VALUES ($name, $icon, $target)",
    data
  );
}

export async function getCategories(db: SQLiteDatabase): Promise<any[]> {
  return await db.getAllAsync("SELECT * FROM categories");
}
