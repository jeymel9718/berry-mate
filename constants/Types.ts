export type BalanceState = {
  expense: boolean;
  income: boolean;
};

export type Category = {
  name: string;
  iconName: string;
};

export type Expense = {
  date: Date;
  category: string;
  amount: string;
  title: string;
};