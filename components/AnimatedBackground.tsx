import { usePairing } from "@/ctx/PairingContext";
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  polar2Cartesian,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import {
  FrameInfo,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { clamp, mixColor } from "react-native-redash";
import colors from "@/lib/colors";
import { useCallback } from "react";

const BLUR_MIN = 15;
const BLUR_MULTIPLIER = 30;
const VELOCITY_MIN = 0.1;
const VELOCITY_MAX = 0.9;
const ORBIT_MIN = 0.04;
const ORBIT_MAX = 0.27;
const BODY_RADIUS_MIN = 50;
const BODY_RADIUS_MAX = 120;

interface Props {
  localProgress: SharedValue<number>;
  remoteProgress: SharedValue<number>;
  complete: SharedValue<boolean>;
}

export default function AnimatedBackground({
  localProgress,
  remoteProgress,
  complete,
}: Props) {
  const { isMaster } = usePairing();
  const { width: w, height: h } = Dimensions.get("screen");
  const orbitDistance = useSharedValue(ORBIT_MAX);
  const bodyRadius = useSharedValue(BODY_RADIUS_MIN);
  const masterOrbitTheta = useSharedValue(0);
  const slaveOrbitTheta = useSharedValue(0);
  const velocity = useSharedValue(VELOCITY_MIN);

  // Update loop
  useFrameCallback((frameInfo: FrameInfo) => {
    const dt = frameInfo.timeSincePreviousFrame;
    if (dt == null) return;
    const dtSeconds = dt / 1000;

    // Update positions
    masterOrbitTheta.value += velocity.value * dtSeconds;
    slaveOrbitTheta.value += velocity.value * dtSeconds;
  });

  const updateVelocity = useCallback(() => {
    "worklet";
    velocity.value = clamp(
      VELOCITY_MAX * ((localProgress.value + remoteProgress.value) / 2),
      VELOCITY_MIN,
      VELOCITY_MAX,
    );
  }, []);
  const updateOrbitDistance = useCallback(() => {
    "worklet";
    orbitDistance.value = clamp(
      ORBIT_MAX * (1 - (localProgress.value + remoteProgress.value) / 2),
      ORBIT_MIN,
      ORBIT_MAX,
    );
  }, []);
  const updateBodyRadius = useCallback(() => {
    "worklet";
    bodyRadius.value = clamp(
      BODY_RADIUS_MAX * ((localProgress.value + remoteProgress.value) / 2),
      BODY_RADIUS_MIN,
      BODY_RADIUS_MAX,
    );
  }, []);

  useAnimatedReaction(
    () => localProgress.value + remoteProgress.value,
    (newProgress) => {
      "worklet";
      updateVelocity();
      updateOrbitDistance();
      updateBodyRadius();
    },
  );

  // Convert to coordinates
  const masterPosCartesianX = useDerivedValue(() => {
    "worklet";
    return polar2Cartesian({
      theta: masterOrbitTheta.value * 2 * Math.PI,
      radius: orbitDistance.value * w,
    }).x;
  });
  const masterPosCartesianY = useDerivedValue(() => {
    "worklet";
    return polar2Cartesian({
      theta: masterOrbitTheta.value * 2 * Math.PI,
      radius: orbitDistance.value * w,
    }).y;
  });
  const slavePosCartesianX = useDerivedValue(() => {
    "worklet";
    return polar2Cartesian({
      theta: slaveOrbitTheta.value * 2 * Math.PI + Math.PI,
      radius: orbitDistance.value * w,
    }).x;
  });
  const slavePosCartesianY = useDerivedValue(() => {
    "worklet";
    return polar2Cartesian({
      theta: slaveOrbitTheta.value * 2 * Math.PI + Math.PI,
      radius: orbitDistance.value * w,
    }).y;
  });
  const masterGradient = useDerivedValue(() => {
    const p = isMaster ? localProgress.value : remoteProgress.value;
    const color = mixColor(
      p,
      colors.MIDPOINT_PRIMARY,
      colors.MASTER_PRIMARY,
      "HSV",
    );
    return [mixColor(0.2, color, 0xffffff57), color];
  });
  const slaveGradient = useDerivedValue(() => {
    const p = !isMaster ? localProgress.value : remoteProgress.value;
    const color = mixColor(
      p,
      colors.MIDPOINT_PRIMARY,
      colors.SLAVE_PRIMARY,
      "HSV",
    );
    return [mixColor(0.2, color, 0xffffff57), color];
  });
  const blur = useDerivedValue(() =>
    clamp(
      (localProgress.value + remoteProgress.value) * BLUR_MULTIPLIER,
      BLUR_MIN,
      BLUR_MULTIPLIER,
    ),
  );
  const lightRadius = useDerivedValue(() => orbitDistance.value * w * 1.4);

  return (
    <Canvas
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#223",
      }}
    >
      <Group
        transform={[{ translateX: w / 2 }, { translateY: h / 5 }]}
        blendMode="colorDodge"
      >
        {/* <Circle r={5} cx={0} cy={0} style="fill" color="orange" /> */}

        <BlurMask blur={blur} style="normal" />

        <Circle
          r={bodyRadius}
          cx={masterPosCartesianX}
          cy={masterPosCartesianY}
          style="fill"
          color={colors.MASTER_PRIMARY}
        >
          <RadialGradient
            c={vec(0, 0)}
            r={lightRadius}
            colors={masterGradient}
          />
        </Circle>

        <Circle
          r={bodyRadius}
          cx={slavePosCartesianX}
          cy={slavePosCartesianY}
          style="fill"
          color={colors.SLAVE_PRIMARY}
        >
          <RadialGradient
            c={vec(0, 0)}
            r={lightRadius}
            colors={slaveGradient}
          />
        </Circle>
      </Group>
    </Canvas>
  );
}
