import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";

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

export type CategoriesStackParamList = {
  expense: undefined;
  index: undefined;
};

export type TabParamList = {
  categories: NavigatorScreenParams<CategoriesStackParamList>;
  explore: undefined;
  transaction: undefined;
  index: undefined;
};

export type IconItem = {
  id: string
  name: string;
};