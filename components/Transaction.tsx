import { View, StyleSheet } from 'react-native';
import { Caption, Divider, Icon, List, Text } from "react-native-paper";

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
    <List.Item left={() => (
      <View style={styles.iconContainer}>
        <Icon source={iconName} size={25} />
      </View>
    )}
    title={() => <Text variant="titleSmall" style={styles.titleText}>{transaction}</Text>}
    description={() => (
      <View style={styles.container}>
      <View  style={styles.categoryContainer}>
        <Text variant="labelMedium">{category}</Text>
        <Caption>{date}</Caption>
      </View>
      <Divider horizontalInset style={styles.divider} />
      <Text variant="labelLarge">{value}</Text>
    </View>
    )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
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
    
  },
  titleText:{
    fontWeight: 'bold'
  },
  divider: {
    height: '85%',
    width: 1,
  }
});
