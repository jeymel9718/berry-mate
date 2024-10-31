import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Separator, SizableText, View, XStack, YStack } from "tamagui";

export type TransactionProps = {
  iconName: ComponentProps<typeof Ionicons>["name"];
  date: string;
  category: string;
  transaction: string;
  value: number;
};

export function Transaction({
  iconName,
  category,
  date,
  transaction,
  value,
}: TransactionProps) {
  return (
    <XStack alignItems="center" marginVertical={10}>
      <View
        bg="$blue7Light"
        borderRadius={20}
        height={50}
        width={50}
        alignItems="center"
        justifyContent="center"
      >
        <Ionicons name={iconName} size={25} />
      </View>
      <YStack marginLeft={15} >
        <SizableText size="$2">{category}</SizableText>
        <SizableText size="$1">{date}</SizableText>
      </YStack>
      <Separator alignSelf="stretch" vertical marginHorizontal={15} />
      <SizableText overflow="hidden" size="$2">{transaction}</SizableText>
      <Separator alignSelf="stretch" vertical={true} marginHorizontal={15}/>
      <SizableText size="$3">{value}</SizableText>
    </XStack>
  );
}
