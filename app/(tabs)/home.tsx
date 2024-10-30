import Header from "@/components/home/Header";
import { TopCategory } from "@/components/home/TopCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Card, XStack } from "tamagui";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
    >
      <Card elevate size="$4" bordered>
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
        <TopCategory categoryName="Groceries" budget={300} balance={120} iconName="fast-food-outline" />
      </Card>
    </ParallaxScrollView>
  );
}
