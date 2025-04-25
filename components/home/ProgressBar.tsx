import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Surface, Text } from 'react-native-paper'
import { windowHeight } from '@/constants/Dimensions';
import { useEffect } from 'react';

export type ProgressBarProps = {
  progress: number
  amount: number
}

export function ProgressBar({ progress, amount }: ProgressBarProps) {
  const amountColor = progress >= 86 ? 'white': "#263238";
  const progressWidth = useSharedValue<number>(100);

  const animatedWidth = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }));

  useEffect(() => {
    progressWidth.value = withTiming(100 - progress, {
      duration: 1000
    });
  }, [progress]);

  return (
    <Surface style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={{color: 'white'}}>{progress}%</Text>
        <Text style={{color: amountColor}}>${amount.toFixed(2)}</Text>
      </View>
      <Animated.View style={[styles.progressContainer, animatedWidth]} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#052224',
    height: windowHeight*0.043,
    borderRadius: 15, 
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  progressContainer: {
    backgroundColor: '#F1FFF3',
    alignSelf: 'stretch',
    position: 'absolute',
    height: "100%",
    borderRadius: 15,
    right: 0,
  }
});
