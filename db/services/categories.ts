import { SimpleCategory } from "@/constants/Types";
import { SQLiteDatabase } from "expo-sqlite";
import { NativeEventEmitter, NativeModules } from "react-native";

export type Category = {
  id: number;
  name: string;
  icon: string;
  target: number;
  static: boolean;
};

class CategoryService {
  static instance: CategoryService;
  private eventEmitter = new NativeEventEmitter(
    NativeModules.SQLiteEventService || null
  );

  constructor() {}

  static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }

    return CategoryService.instance;
  }

  async createCategory(db: SQLiteDatabase, category: Category) {
    const data = {
      $name: category.name,
      $icon: category.icon,
      $target: category.target,
    };

    await db.runAsync(
      "INSERT INTO categories(name, icon, target) VALUES ($name, $icon, $target)",
      data
    );
    this.eventEmitter.emit("categoryChanged");
  }

  async getSimpleCategories(db: SQLiteDatabase): Promise<SimpleCategory[]> {
    return await db.getAllAsync(
      "SELECT id, name, static FROM categories WHERE static = 0"
    );
  }

  async getCategories(db: SQLiteDatabase): Promise<Category[]> {
    return await db.getAllAsync("SELECT * FROM categories");
  }

  async getCategoryByName(
    db: SQLiteDatabase,
    name: string
  ): Promise<Category | null> {
    return await db.getFirstAsync(
      "SELECT * FROM categories WHERE name = ?",
      name
    );
  }

  async getCategory(
    db: SQLiteDatabase,
    id: number | string
  ): Promise<Category | null> {
    return await db.getFirstAsync("SELECT * FROM categories WHERE id = ?", id);
  }

  async updateCategory(db: SQLiteDatabase, category: Category) {
    return await db.runAsync(
      "UPDATE categories SET name = ?, icon = ?, target = ? WHERE id = ?",
      category.name,
      category.icon,
      category.target,
      category.id
    );
  }

  onCategories(db: SQLiteDatabase, callback: (categories: Category[]) => void) {
    const loadData = async () => {
      const dbData = await this.getCategories(db);
      callback(dbData);
    };

    // Initial setUp
    loadData();

    const subscription = this.eventEmitter.addListener(
      "categoryChanged",
      loadData
    );

    return () => subscription.remove();
  }

  async deleteCategory(db: SQLiteDatabase, id: number) {
    await db.runAsync("DELETE FROM categories WHERE id=$1", id);
    await db.runAsync(
      "DELETE FROM transactions WHERE category_id=$1",
      id
    );
    this.eventEmitter.emit("categoryChanged");
  }
}

export const categoryDB = CategoryService.getInstance();
