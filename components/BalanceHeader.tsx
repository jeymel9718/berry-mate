import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { ProgressBar } from "./home/ProgressBar";

export function BalanceHeader(){
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.centerContainer, {width: width*0.83}]}>
        <View style={styles.balanceContainer}>
          <View>
            <View style={styles.rowContainer}>
              <Icon size={17} source="bank-transfer-in" />
              <Text variant="labelMedium">
                Total Balance
              </Text>
            </View>
            <Text variant="titleLarge">$7,783.00</Text>
          </View>
          <Divider horizontalInset style={styles.divider}/>
          <View>
            <View style={styles.rowContainer}>
              <Icon size={17} source="bank-transfer-out" />
              <Text variant="labelMedium">
                Total Expense
              </Text>
            </View>
            <Text variant="titleLarge">
              -$1,187.40
            </Text>
          </View>
        </View>
        <View style={{gap: 6}}>
          <ProgressBar progress={20} amount={20000.0} />
          <View style={styles.rowContainer}>
            <Icon size={13} source="checkbox-outline" />
            <Text variant="labelMedium">
              20% Of Your Expenses
            </Text>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignSelf: "center",
    paddingHorizontal: 10,
    height: 30,
    gap: 15,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center"
  },
  divider: {
    height: '80%',
    width: 1,
    backgroundColor: 'white'
  },
});