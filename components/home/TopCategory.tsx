import CircularProgressBar from "../CircularProgressBar";
import { View, StyleSheet } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { windowHeight, windowWidth } from "@/constants/Dimensions";
import { TopCategoryIcon } from "@/db/services/categories";

export type TopCategoryProps = {
  firstCategory: TopCategoryIcon;
  secondCategory: TopCategoryIcon;
  revenue: number;
};

export function TopCategory({
  firstCategory,
  secondCategory,
  revenue
}: TopCategoryProps) {
  const progress = (firstCategory.total_expense / firstCategory.target) * 100;
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CircularProgressBar
          size={windowWidth * 0.17}
          strokeWidth={4}
          progress={progress}
          color="#4caf50"
          backgroundColor="#e0e0e0"
          iconName={firstCategory.icon}
        />
        <Text variant="labelMedium">{firstCategory.name}</Text>
      </View>
      <Divider horizontalInset style={styles.divider} />
      <View>
        <View style={styles.itemContainer}>
          <Icon
            source="cash-multiple"
            size={32}
            color="#0E2B17"
          />
          <View>
            <Text style={styles.label}>Revenue Last Week</Text>
            <Text style={styles.amount}>${revenue}</Text>
          </View>
        </View>
        <Divider style={styles.horizontalDivider} />
        <View style={styles.itemContainer}>
        <Icon
          source={secondCategory.icon}
          size={32}
          color="#0E2B17"
        />
        <View>
          <Text style={styles.label}>{secondCategory.name} Last Week</Text>
          <Text style={[styles.amount, { color: '#E02424' }]}>
            -${secondCategory.total_expense}
          </Text>
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    padding: 10,
  },
  center: {
    alignItems: "center",
    justifyContent: 'center'
  },
  row: {
    flexDirection: "row",
  },
  divider: {
    height: windowWidth * 0.19,
    width: 2,
  },
  horizontalDivider: {
    margin: 5,
    height: 2,
    width: windowHeight * 0.25,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#0E2B17',
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E2B17',
  },
});
