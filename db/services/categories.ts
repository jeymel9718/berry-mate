import { SQLiteDatabase } from "expo-sqlite";
import { NativeEventEmitter, NativeModules } from 'react-native';

export type Category = {
  id: number;
  name: string;
  icon: string;
  target: number;
};

class CategoryService {
  static instance: CategoryService;
  private eventEmitter = new NativeEventEmitter(NativeModules.SQLiteEventService || null);
  
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

  async getCategories(db: SQLiteDatabase): Promise<Category[]> {
    return await db.getAllAsync("SELECT * FROM categories");
  }

  onCategories(db: SQLiteDatabase, callback: (categories: Category[]) => void) {
    const loadData = async () => {
      const dbData = await this.getCategories(db)
      callback(dbData)
    }

    // Initial setUp
    loadData();

    const subscription = this.eventEmitter.addListener("categoryChanged", loadData);

    return () => subscription.remove();
  }

  async deleteCategory(db: SQLiteDatabase, id: number) {
    await db.runAsync("DELETE FROM categories WHERE id=$1", id);
    this.eventEmitter.emit("categoryChanged");
  }
}

export const categoryDB = CategoryService.getInstance();