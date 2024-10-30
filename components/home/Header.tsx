import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { H3, H6, Separator, SizableText, View, XStack, YStack } from "tamagui";
import { ProgressBar } from "./ProgressBar";

export default function Header() {
  const { height, width } = useWindowDimensions();
  return (
    <YStack marginTop="$6" marginHorizontal="$4" gap="$4">
      <YStack gap="$0">
        <H3>Welcome Back!</H3>
        <H6>Good Morning</H6>
      </YStack>
      <YStack alignSelf="center" height={30} gap="$4" width={width * 0.85}>
        <XStack justifyContent="space-around">
          <YStack>
            <XStack alignItems="center">
              <Ionicons name="enter-outline" size={15} />
              <SizableText size="$3" paddingLeft="$1.5">
                Total Balance
              </SizableText>
            </XStack>
            <SizableText size="$7">$7,783.00</SizableText>
          </YStack>
          <Separator vertical marginHorizontal={15} />
          <YStack>
            <XStack alignItems="center">
              <Ionicons name="exit-outline" size={15} />
              <SizableText size="$3" paddingLeft="$1.5">
                Total Expense
              </SizableText>
            </XStack>
            <SizableText size="$7" theme="alt2">
              -$1,187.40
            </SizableText>
          </YStack>
        </XStack>
        <YStack>
          <ProgressBar progress={20} amount={20000.0} />
          <XStack alignItems="center" alignSelf="center">
            <Ionicons size={13} name="checkbox-outline" />
            <SizableText size="$2" paddingLeft="$1.5">
              20% Of Your Expenses
            </SizableText>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
