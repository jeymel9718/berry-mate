import { Text, View, StyleSheet } from 'react-native';

export type ProgressBarProps = {
  progress: number
  amount: number
}

export function ProgressBar({ progress, amount }: ProgressBarProps) {
  const amountColor = progress >= 86 ? 'white': "#263238";
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${progress}%` }]}>
        <Text style={styles.progressText}>{`${progress}%`}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, { color: amountColor }]}>{`$${amount.toFixed(2)}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 30,
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
    position: 'relative'
  },
  progressBar: {
    backgroundColor: "#263238",
    height: "100%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  progressText: {
    color: "white",
    fontWeight: "bold",
  },
  amountContainer: {
    flex: 1,
    position: 'absolute',
    right: 0,
    zIndex: 1, 
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  amountText: {
    fontWeight: "bold",
  },
});
