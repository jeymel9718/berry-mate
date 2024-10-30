import { Separator, SizableText, XStack } from "tamagui";
import CircularProgressBar from "../CircularProgressBar";
import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { windowHeight, windowWidth } from "@/constants/Dimensions";

export type TopCategoryProps = {
  categoryName: string;
  budget: number;
  balance: number;
  iconName: ComponentProps<typeof Ionicons>['name'];
};

export function TopCategory({ categoryName, budget, balance, iconName }: TopCategoryProps) {
  const progress = (balance / budget) * 100;
  return (
    <XStack marginVertical="$1.5">
      <CircularProgressBar
        size={windowWidth*0.17}
        strokeWidth={5}
        progress={progress}
        color="#4caf50"
        backgroundColor="#e0e0e0"
        iconName={iconName}
      />
      <Separator alignSelf="stretch" vertical marginHorizontal={15}/>
      <SizableText>{categoryName}:</SizableText>
      <SizableText marginHorizontal="$2" theme="alt1">${balance}</SizableText>
      <SizableText>/</SizableText>
      <SizableText marginHorizontal="$2" theme="alt1">${budget}</SizableText>
    </XStack>
  );
}
