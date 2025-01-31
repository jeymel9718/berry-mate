import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

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
      {/* Goal and Progress */}
      <View style={styles.goalContainer}>
        <View style={styles.iconWrapper}>
          <Icon source="airplane" size={48} color="blue" />
        </View>
        <Text style={styles.goalText}>$1,962.93</Text>
        <Text style={styles.savedText}>$653.31</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '40%' }]} />
          </View>
          <Text style={styles.progressText}>30% of Your Expenses, Looks Good.</Text>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  goalContainer: { alignItems: 'center', marginVertical: 20 },
  iconWrapper: {
    backgroundColor: '#DCEEFB',
    padding: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
  goalText: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  savedText: { color: '#39D39F', fontSize: 18, fontWeight: 'bold' },
  progressBarContainer: { marginTop: 10, alignItems: 'center', width: '80%' },
  progressBar: {
    height: 10,
    backgroundColor: '#D0D0D0',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  progress: { height: '100%', backgroundColor: '#39D39F' },
  progressText: { marginTop: 5, fontSize: 12, color: '#555' },
});