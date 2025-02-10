import { Pressable, StyleSheet, Vibration, View } from "react-native";
import { usePairing } from "@/ctx/PairingContext";
import { useEffect, useState } from "react";
import { useSupabaseChannel } from "@/hooks/useSupabaseChannel";
import Animated, {
  clamp,
  Easing,
  interpolate,
  ReduceMotion,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Meter from "@/components/Meter";
import { ReText } from "react-native-redash";
import AnimatedBackground from "@/components/AnimatedBackground";
import { PresenceBadge } from "@/components/PresenceBadge";
import colors from "@/lib/colors";

const FILL_DURATION = 3000;
const DRAIN_DURATION = 2000;
const FILL_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
const DRAIN_EASING = Easing.elastic(1);
const GRADIENT_MASTER = [colors.MASTER_PRIMARY, colors.SLAVE_PRIMARY];
const GRADIENT_SLAVE = [colors.SLAVE_PRIMARY, colors.MASTER_PRIMARY];

export default function Index() {
  const { currentPair, isMaster } = usePairing();
  const [localPressed, setLocalPressed] = useState(false);
  const [remotePressed, setRemotePressed] = useState(false);

  const complete = useSharedValue(false);
  const localMeterProgress = useSharedValue(0);
  const remoteMeterProgress = useSharedValue(0);
  const buttonPressProgress = useSharedValue(0);

  const { broadcast } = useSupabaseChannel(`power:${currentPair?.id}`, [
    {
      event: "meter-update",
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

    broadcast("meter-update", { pressed: localPressed });
  }, [broadcast, buttonPressProgress, localMeterProgress, localPressed]);

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
  }, [remoteMeterProgress, remotePressed]);

  const animatedButtonStyles = useAnimatedStyle(() => {
    const translateY = interpolate(buttonPressProgress.value, [0, 1], [0, 10]);
    const elevation = interpolate(buttonPressProgress.value, [0, 1], [20, 0]);
    return {
      transform: [{ translateY }],
      elevation,
    };
  });

  useAnimatedReaction(
    () => {
      return localMeterProgress.value + remoteMeterProgress.value;
    },
    (currentValue) => {
      if (localPressed) {
        runOnJS(Vibration.vibrate)(clamp(3 * currentValue, 1, 1000));
      }
      complete.value = currentValue >= 2;
    },
  );

  const percentageText = useDerivedValue(() => {
    const combinedProgress =
      localMeterProgress.value / 2 + remoteMeterProgress.value / 2;
    const clampedCombinedProgress = clamp(combinedProgress, 0, 1);

    if (localMeterProgress.value < 0.01) {
      return "Power up";
    }

    return `${Math.round(clampedCombinedProgress * 100)}%`;
  });

  return (
    <>
      <AnimatedBackground
        localProgress={localMeterProgress}
        remoteProgress={remoteMeterProgress}
        complete={complete}
      />

      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* <View style={styles.metersContainer}>
            <Meter
              progress={isMaster ? localMeterProgress : remoteMeterProgress}
              colors={GRADIENT_MASTER}
            />
            <Meter
              progress={!isMaster ? localMeterProgress : remoteMeterProgress}
              colors={GRADIENT_SLAVE}
              flipped
            />
          </View> */}

          <View style={styles.buttonContainer}>
            <Pressable
              onPressIn={() => setLocalPressed(true)}
              onPressOut={() => setLocalPressed(false)}
              style={{ position: "absolute", zIndex: 20 }}
            >
              <Animated.View
                style={[
                  styles.button,
                  isMaster
                    ? { backgroundColor: colors.MASTER_PRIMARY }
                    : { backgroundColor: colors.SLAVE_PRIMARY },
                  animatedButtonStyles,
                ]}
              >
                <ReText text={percentageText} style={styles.percentage} />
              </Animated.View>
            </Pressable>

            <View
              style={[
                styles.buttonShadow,
                isMaster
                  ? { backgroundColor: colors.MASTER_SHADOW }
                  : { backgroundColor: colors.SLAVE_SHADOW },
              ]}
            />
          </View>
        </View>
        
        <View style={{ alignItems: "center" }}>
          <PresenceBadge />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  buttonContainer: {
    position: "relative",
    maxHeight: 250,
    flex: 1,
    alignSelf: "center",
    aspectRatio: 1,
    marginVertical: 30,
  },
  buttonShadow: {
    position: "absolute",
    left: 0,
    bottom: -15,
    zIndex: 10,
    width: "100%",
    aspectRatio: 1,
    borderRadius: "100%",
  },
  button: {
    position: "relative",
    zIndex: 20,
    width: "100%",
    aspectRatio: 1,
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  metersContainer: {
    marginTop: 50,
    flexDirection: "row",
    gap: 20,
  },
  percentage: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 32,
    fontVariant: ["tabular-nums"],
  },
});
