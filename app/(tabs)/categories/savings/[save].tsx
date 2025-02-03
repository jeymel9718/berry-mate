import { Transaction } from "@/components/categories/Transaction";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ProgressBar } from "@/components/home/ProgressBar";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { windowWidth } from "@/constants/Dimensions";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, List, Surface, Text } from "react-native-paper";

export default function SaveScreen() {
  const { save } = useLocalSearchParams<{ save: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: save,
    });
  }, [navigation]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<View />}
      headerHeight={100}
    >
      {/* Goal and Amount Saved */}
      <View style={styles.goalContainer}>
        <View style={styles.goalRowContainer}>
          <View>
            <Text style={styles.goalLabel}>Goal</Text>
            <Text style={styles.goalAmount}>$1,962.93</Text>
            <Text style={styles.savedLabel}>Amount Saved</Text>
            <Text style={styles.savedAmount}>$653.31</Text>
          </View>
          <Surface style={styles.iconContainer}>
            <CircularProgressBar
              size={windowWidth * 0.26}
              strokeWidth={4}
              progress={30}
              color="#0068FF"
              backgroundColor="#F1FFF3"
              iconName={"airplane"}
            />
            <Text>{save}</Text>
          </Surface>
        </View>

        {/* Progress Bar */}
        <ProgressBar progress={30} amount={1962.93} />
        <Text style={styles.progressText}>
          30% of Your Expenses, Looks Good.
        </Text>
      </View>

      <View>
        <List.Section>
          <List.Subheader>April</List.Subheader>
          <Transaction
            iconName="car-outline"
            date="April 30"
            name="Fuel"
            value={20000}
          />
          <Transaction
            iconName="car-outline"
            date="April 30"
            name="Fuel"
            value={20000}
          />
          <Transaction
            iconName="car-outline"
            date="April 30"
            name="Fuel"
            value={20000}
          />
          <Transaction
            iconName="car-outline"
            date="April 30"
            name="Fuel"
            value={20000}
          />
          <Transaction
            iconName="car-outline"
            date="April 30"
            name="Fuel"
            value={20000}
          />
        </List.Section>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  goalContainer: {
    alignItems: "center",
  },
  goalRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },
  iconContainer: {
    backgroundColor: "#6DB6FE",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
  },
  goalLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  goalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  savedLabel: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
  },
  savedAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#38B16C",
  },
  progressBarBackground: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    height: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  progressBarFill: {
    width: "40%",
    backgroundColor: "#38B16C",
    height: 12,
    borderRadius: 6,
  },
  progressText: {
    marginTop: 8,
    color: "#6B7280",
  },
});
