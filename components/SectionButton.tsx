import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export type SectionButtonProps = {
  segments: string[];
  value: string;
  onValueChange: (value: string) => void
};

export function SectionButton({ segments, value, onValueChange }: SectionButtonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        {segments.map((segment) => {
          const isSelected = segment === value;
          return (
            <TouchableOpacity
              key={segment}
              onPress={() => onValueChange(segment)}
              style={[
                styles.segmentButton,
                isSelected && styles.segmentButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  isSelected && styles.segmentTextSelected,
                ]}
              >
                {segment}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#CFFFD9", // Light green background for unselected
    borderRadius: 24,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },
  segmentButtonSelected: {
    backgroundColor: "#1FC76A", // Darker green for selected
  },
  segmentText: {
    color: "#333", // Dark text for unselected
    fontWeight: "500",
  },
  segmentTextSelected: {
    color: "#fff", // White text for selected
  },
});
