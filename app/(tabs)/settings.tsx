import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useState } from "react";
import { View, Text, Switch, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function SettingsScreen() {
  const [notifyCategoryTarget, setNotifyCategoryTarget] = useState(true);
  const [notifyGeneralBudget, setNotifyGeneralBudget] = useState(false);

  // Expense target
  const [expenseTarget, setExpenseTarget] = useState('500');

  // Example: Pressing "Help & FAQ" just shows an alert
  // In a real app, you might navigate to a new screen or open a URL
  const handleHelpFAQ = () => {
    Alert.alert(
      'Help & FAQ',
      'This is where you would provide help info or link to an FAQ page.'
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<View />}
      headerHeight={100}
    >
      <Text style={styles.header}>Settings</Text>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>
            Notify when a category reaches its target
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#1FC76A" }}
            thumbColor={notifyCategoryTarget ? "#fff" : "#f4f3f4"}
            onValueChange={(value) => setNotifyCategoryTarget(value)}
            value={notifyCategoryTarget}
          />
        </View>

        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>
            Notify when general expense budget is exceeded
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#1FC76A" }}
            thumbColor={notifyGeneralBudget ? "#fff" : "#f4f3f4"}
            onValueChange={(value) => setNotifyGeneralBudget(value)}
            value={notifyGeneralBudget}
          />
        </View>
      </View>

      {/* Expense Target Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Target</Text>
        <Text style={styles.itemLabel}>
          Set your total expense target (per month)
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={expenseTarget}
          onChangeText={setExpenseTarget}
          placeholder="e.g. 500"
        />
      </View>

      {/* Help & FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & FAQ</Text>
        <TouchableOpacity style={styles.helpButton} onPress={handleHelpFAQ}>
          <Text style={styles.helpButtonText}>View Help & FAQ</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#0E2B17',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#F3F5F4',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0E2B17',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  helpButton: {
    backgroundColor: '#1FC76A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  helpButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
