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

export type TopCategory = {
  category: string;
  total_expense: number;
  percentage: number;
};

export type TopCategoryIcon = {
  name: string;
  target: number;
  total_expense: number;
  icon: string;
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
    await db.runAsync("DELETE FROM transactions WHERE category_id=$1", id);
    this.eventEmitter.emit("categoryChanged");
  }

  async getTopCategories(db: SQLiteDatabase): Promise<TopCategory[]> {
    return await db.getAllAsync(
      `
        WITH per_category AS (
  -- 1) Compute total expense per category
  SELECT
    c.name            AS category,
    SUM(t.amount)     AS total_expense
  FROM
    categories AS c
    JOIN transactions AS t
      ON t.category_id = c.id
  WHERE
    t.type = 'expense'
  GROUP BY
    c.id,
    c.name
),
top4 AS (
  -- 2) Take the top 4 categories by expense
  SELECT
    category,
    total_expense
  FROM
    per_category
  ORDER BY
    total_expense DESC
  LIMIT 4
),
others AS (
  -- 3) Group all remaining categories into “Others”
  SELECT
    'Others'           AS category,
    SUM(total_expense) AS total_expense
  FROM
    per_category
  WHERE
    category NOT IN (SELECT category FROM top4)
),
breakdown AS (
  -- 4) Combine the top 4 + the “Others” row
  SELECT * FROM top4
  UNION ALL
  SELECT * FROM others
),
overall AS (
  -- 5) Compute the grand total (sum of all these expenses)
  SELECT
    SUM(total_expense) AS overall_total
  FROM
    breakdown
)
-- 6) Final select: for each row, show category, total_expense, and percentage of overall total
SELECT
  b.category,
  b.total_expense,
  (b.total_expense * 100.0 / o.overall_total) AS percentage
FROM
  breakdown AS b
  CROSS JOIN overall AS o
ORDER BY
  b.total_expense DESC;`
    );
  }

  async getMostExpensiveCategory(db: SQLiteDatabase): Promise<TopCategoryIcon> {
    const result = await db.getFirstAsync<TopCategoryIcon>(`
      SELECT
        c.name AS name,
        c.icon AS icon,
        c.target as target,
        SUM(t.amount) AS total_expense
      FROM
        categories AS c
        JOIN transactions AS t
          ON t.category_id = c.id
      WHERE
        t.type = 'expense'
      GROUP BY
        c.id,
        c.name
      ORDER BY
        total_expense DESC
      LIMIT 1;
      `);
    return result || { name: "", icon: "", target: 0, total_expense: 0 };
  }

  async getLastWeekCategory(db: SQLiteDatabase): Promise<TopCategoryIcon> {
    const result = await db.getFirstAsync<TopCategoryIcon>(`
      SELECT
        c.name AS name,
        c.icon AS icon,
        c.target as target,
        SUM(t.amount) AS total_expense
      FROM
        categories AS c
        JOIN transactions AS t
          ON t.category_id = c.id
      WHERE
        t.type = 'expense'
        AND date(t.date) BETWEEN date('now', '-6 days') AND date('now')
      GROUP BY
        c.id,
        c.name
      ORDER BY
        total_expense DESC
      LIMIT 1;
      `);
    
      return result || { name: "", icon: "", target: 0, total_expense: 0 };
  }
}

export const categoryDB = CategoryService.getInstance();
