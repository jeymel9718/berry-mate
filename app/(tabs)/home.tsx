import Header from "@/components/home/Header";
import { TopCategory } from "@/components/home/TopCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Transaction } from "@/components/Transaction";
import { Card, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
    >
      <Card elevate size="$4" bordered padding="$2">
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
      </Card>
      <YStack marginTop={20}>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
        <Transaction iconName="car-outline" date="April 30" category="Transportation" transaction="Fuel" value={20000}/>
      </YStack>
    </ParallaxScrollView>
  );
}
