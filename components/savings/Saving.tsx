import { windowWidth } from "@/constants/Dimensions";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { CategoryProps } from "../categories/Category";

export function Saving({ name, iconName }: CategoryProps) {
  return (
    <View style={styles.container}>
      <Link href={`/categories/savings/${name}`} asChild>
        <Pressable style={styles.iconContainer}>
          <Icon source={iconName} size={windowWidth * 0.18} color="white" />
        </Pressable>
      </Link>
      <Text variant="labelLarge">{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#6DB6FE",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
