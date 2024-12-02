import { View, StyleSheet } from "react-native";
import { Caption, Divider, Icon, List, Text } from "react-native-paper";

export type TransactionProps = {
  name: string;
  iconName: string;
  date: string;
  value: number;
};

export function Transaction({ name, iconName, date, value }: TransactionProps) {
  return (
    <List.Item
      left={() => (
        <View style={styles.iconContainer}>
          <Icon source={iconName} size={25} />
        </View>
      )}
      title={() => (
        <Text variant="titleSmall" style={styles.titleText}>
          {name}
        </Text>
      )}
      description={() => (
        <View style={styles.container}>
          <Caption>{date}</Caption>
          <Divider horizontalInset style={styles.divider} />
          <Text variant="labelLarge">{value}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  iconContainer: {
    borderRadius: 20,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
  categoryContainer: {},
  titleText: {
    fontWeight: "bold",
  },
  divider: {
    height: "85%",
    width: 1,
  },
});
