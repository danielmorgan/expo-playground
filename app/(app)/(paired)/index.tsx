import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDeviceCode } from "@/hooks/useDeviceCode";
import { usePairing } from "@/ctx/PairingContext";
import { useEffect, useMemo, useState } from "react";
import { useSupabaseChannel } from "@/hooks/useSupabaseChannel";
import Animated, { clamp, Easing, interpolate, ReduceMotion, runOnJS, SharedValue, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Meter from "@/components/Meter";
import { ReText } from "react-native-redash";

const FILL_DURATION = 3000;
const DRAIN_DURATION = 2000;
const FILL_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
const DRAIN_EASING = Easing.bezier(0.42, 0, 1, 1);
const GRADIENT_MASTER = ['#1e18d3', '#3020d5', '#ae20cf', '#ff49c9', '#ff8400'];
const GRADIENT_SLAVE = ['#ff8000', '#ff453a', '#ed1e4e', '#bb1e66', '#74175d'];

export default function Index() {
  const { currentPair } = usePairing();
  const { deviceCode } = useDeviceCode();
  const [localPressed, setLocalPressed] = useState(false);
  const [remotePressed, setRemotePressed] = useState(false);
  const [complete, setComplete] = useState(false);
  const isMaster = useMemo(() => {
    return currentPair?.master_code === deviceCode;
  }, [currentPair, deviceCode]);

  const localMeterProgress = useSharedValue(0);
  const remoteMeterProgress = useSharedValue(0);
  const buttonPressProgress = useSharedValue(0);

  const { broadcast } = useSupabaseChannel(`power:${currentPair?.id}`, [
    {
      event: 'meter-update',
      callback: ({ payload }) => {
        setRemotePressed(payload.pressed);
      },
    },
  ]);

  useEffect(() => {
    if (localPressed) {
      localMeterProgress.value = withTiming(1, {
        duration: FILL_DURATION,
        easing: FILL_EASING,
        reduceMotion: ReduceMotion.System,
      });
      buttonPressProgress.value = withTiming(1, {
        duration: 500,
        easing: Easing.elastic(1),
        reduceMotion: ReduceMotion.System,
      });
    } else {
      localMeterProgress.value = withTiming(0, {
        duration: DRAIN_DURATION,
        easing: DRAIN_EASING,
        reduceMotion: ReduceMotion.System,
      });
      buttonPressProgress.value = withTiming(0, {
        duration: 500,
        easing: Easing.elastic(2),
        reduceMotion: ReduceMotion.System,
      });
    }
    broadcast('meter-update', { pressed: localPressed });
  }, [localPressed]);

  useEffect(() => {
    if (remotePressed) {
      remoteMeterProgress.value = withTiming(1, {
        duration: FILL_DURATION,
        easing: FILL_EASING,
      });
    } else {
      remoteMeterProgress.value = withTiming(0, {
        duration: DRAIN_DURATION,
        easing: DRAIN_EASING,
      });
    }
  }, [remotePressed]);

  const animatedButtonStyles = useAnimatedStyle(() => {
    const translateY = interpolate(buttonPressProgress.value, [0, 1], [0, 10]);
    const elevation = interpolate(buttonPressProgress.value, [0, 1], [20, 0]);
    return {
      transform: [
        { translateY },
      ],
      elevation,
    };
  });

  useAnimatedReaction(() => {
    return localMeterProgress.value + remoteMeterProgress.value;
  }, (currentValue) => {
    runOnJS(setComplete)(currentValue >= 2);
  });

  const percentageText = useDerivedValue(() => {
    const combinedProgress = localMeterProgress.value / 2 + remoteMeterProgress.value / 2;
    const clampedCombinedProgress = clamp(combinedProgress, 0, 1);

    if (localMeterProgress.value === 0) {
      return 'Power up'
    }

    return `${Math.round(clampedCombinedProgress * 100)}%`;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Code: {deviceCode}</Text>
      <Text>{JSON.stringify(currentPair, null, 2)}</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          onPressIn={() => setLocalPressed(true)}
          onPressOut={() => setLocalPressed(false)}
          style={{ position: 'absolute', zIndex: 20 }}
        >
          <Animated.View
            style={[
              styles.button,
              isMaster ? { backgroundColor: '#3020d5' } : { backgroundColor: '#ed1e4e' },
              animatedButtonStyles
            ]}
          >
            <ReText
              text={percentageText}
              style={styles.percentage}
            />
          </Animated.View>
        </Pressable>

        <View style={[
          styles.buttonShadow,
          isMaster ? { backgroundColor: '#06005c' } : { backgroundColor: '#b8062f' }
        ]} />
      </View>

      <View style={styles.metersContainer}>
        <Meter
          progress={isMaster ? localMeterProgress : remoteMeterProgress}
          colors={GRADIENT_MASTER}
        />
        <Meter
          progress={!isMaster ? localMeterProgress : remoteMeterProgress}
          colors={GRADIENT_SLAVE}
          flipped
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  buttonContainer: {
    position: 'relative',
    maxHeight: 250,
    flex: 1,
    alignSelf: 'center',
    aspectRatio: 1,
  },
  buttonShadow: {
    position: 'absolute',
    left: 0,
    bottom: -15,
    zIndex: 10,
    width: '100%',
    aspectRatio: 1,
    borderRadius: "100%",
  },
  button: {
    position: 'relative',
    zIndex: 20,
    width: '100%',
    aspectRatio: 1,
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  metersContainer: {
    marginTop: 50,
    flexDirection: 'row',
    gap: 5,
  },
  percentage: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 32,
    fontVariant: ["tabular-nums"],
  }
});
