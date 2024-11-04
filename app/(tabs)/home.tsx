import Header from "@/components/home/Header";
import { TopCategory } from "@/components/home/TopCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Transaction } from "@/components/Transaction";
import { View, StyleSheet } from 'react-native';
import { Card } from "react-native-paper";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
    >
      <Card elevation={4}>
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
      </Card>
      <View style={{marginTop: 20, gap: 5}}>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }
});
