import { View, StyleSheet } from 'react-native';
import { Divider, Icon, Text } from "react-native-paper";

export type TransactionProps = {
  iconName: string;
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
        <Icon source={iconName} size={25} />
      </View>
      <View  style={styles.categoryContainer}>
        <Text variant="labelMedium">{category}</Text>
        <Text variant="labelSmall" style={styles.dateText}>{date}</Text>
      </View>
      <Divider horizontalInset style={styles.divider} />
      <Text variant="bodySmall">{transaction}</Text>
      <Divider horizontalInset style={styles.divider} />
      <Text variant="labelMedium">{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 7,
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
  },
  dateText: {
    fontSize: 10,
  },
  divider: {
    height: '85%',
    width: 1,
  }
});
