import { usePairing } from "@/ctx/PairingContext";
import { hexagon } from "@/lib/paths";
import {
  BlurMask,
  Canvas,
  Group,
  Path,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import { SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { clamp, mixColor } from "react-native-redash";

const HEXAGON_SIZE = 75;
const PADDING = 20;
const BLUR_MIN = 10;
const BLUR_MULTIPLIER = 20;

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
  const { width } = Dimensions.get("screen");

  const { isMaster } = usePairing();
  const masterTransform = useDerivedValue(() => {
    const z = isMaster ? localProgress.value : remoteProgress.value;
    return [{ rotateZ: z * Math.PI }];
  });
  const slaveTransform = useDerivedValue(() => {
    const z = !isMaster ? localProgress.value : remoteProgress.value;
    return [{ rotateZ: -z * Math.PI }];
  });
  const masterGradient = useDerivedValue(() => {
    if (complete.value) return ["#fff"];
    const p = isMaster ? localProgress.value : remoteProgress.value;
    const color = mixColor(p, "#3020d5", "#ff8400", "HSV");
    return [mixColor(0.3, color, "white"), color];
  });
  const slaveGradient = useDerivedValue(() => {
    if (complete.value) return ["#fff"];
    const p = !isMaster ? localProgress.value : remoteProgress.value;
    const color = mixColor(p, "#ed1e4e", "#ff8000", "HSV");
    return [mixColor(0.3, color, "white"), color];
  });
  const masterBlur = useDerivedValue(() =>
    isMaster
      ? clamp(BLUR_MULTIPLIER - localProgress.value * BLUR_MULTIPLIER, BLUR_MIN, BLUR_MULTIPLIER)
      : clamp(BLUR_MULTIPLIER - remoteProgress.value * BLUR_MULTIPLIER, BLUR_MIN, BLUR_MULTIPLIER)
  );
  const slaveBlur = useDerivedValue(() =>
    !isMaster
      ? clamp(BLUR_MULTIPLIER - localProgress.value * BLUR_MULTIPLIER, BLUR_MIN, BLUR_MULTIPLIER)
      : clamp(BLUR_MULTIPLIER - remoteProgress.value * BLUR_MULTIPLIER, BLUR_MIN, BLUR_MULTIPLIER)
  );

  const hex = useSharedValue(hexagon(vec(0, 0), HEXAGON_SIZE));

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
      <Group transform={[{ translateY: 200 }]}>
        <Group transform={[{ translateX: width / 2 - HEXAGON_SIZE - PADDING }]}>
          <BlurMask blur={masterBlur} style="normal" />
          <Path
            path={hexagon(vec(0, 0), HEXAGON_SIZE)}
            transform={masterTransform}
          >
            <RadialGradient
              c={vec(0, 0)}
              r={HEXAGON_SIZE}
              colors={masterGradient}
            />
          </Path>
        </Group>

        <Group transform={[{ translateX: width / 2 + HEXAGON_SIZE + PADDING }]}>
          <BlurMask blur={slaveBlur} style="normal" />
          <Path
            path={hex}
            strokeWidth={3}
            transform={slaveTransform}
          >
          <RadialGradient
            c={vec(0, 0)}
            r={HEXAGON_SIZE}
            colors={slaveGradient}
          />
          </Path>
        </Group>
      </Group>
    </Canvas>
  );
}
