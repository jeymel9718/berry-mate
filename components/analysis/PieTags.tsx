import { View, StyleSheet, Text } from "react-native";

export type PieTagsProps = {
  data: any
}

export function PieTags({data}: PieTagsProps) {
  return (
    <View style={styles.legendContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View
            style={[styles.colorBox, { backgroundColor: item.color }]}
          />
          <Text style={styles.legendLabel}>{item.x}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',          // Allows multiple rows if needed
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  colorBox: {
    width: 14,
    height: 14,
    marginRight: 6,
    borderRadius: 2,           // Slightly rounded corners
  },
  legendLabel: {
    fontSize: 14,
    color: '#333',
  },
});