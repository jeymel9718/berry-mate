import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { View, StyleSheet } from 'react-native';
import { Divider, Text } from "react-native-paper";

export type TransactionProps = {
  iconName: ComponentProps<typeof Ionicons>["name"];
  date: string;
  category: string;
  transaction: string;
  value: number;
};

export function Transaction({
  iconName,
  category,
  date,
  transaction,
  value,
}: TransactionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={25} />
      </View>
      <View  style={styles.categoryContainer}>
        <Text variant="labelMedium">{category}</Text>
        <Text variant="labelSmall">{date}</Text>
      </View>
      <Divider horizontalInset />
      <Text variant="labelMedium">{transaction}</Text>
      <Divider horizontalInset />
      <Text variant="labelMedium">{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconContainer: {
    borderRadius: 20,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  categoryContainer: {
    marginLeft: 15,
  }
});
