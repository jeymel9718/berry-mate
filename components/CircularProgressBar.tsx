// CircularProgressBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressBarProps {
  size: number;
  strokeWidth: number;
  progress: number; // Progress percentage (0 to 100)
  color: string;
  backgroundColor: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  strokeWidth,
  progress,
  color,
  backgroundColor,
  iconName,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={{transform: [{rotate: '270deg'}]}}>
        <Svg width={size} height={size}>
          <Circle
            stroke={backgroundColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={styles.textContainer}>
        <Ionicons name={iconName} size={size*0.54} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CircularProgressBar;
