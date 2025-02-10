import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

interface Props {
  localProgress: SharedValue<number>;
  remoteProgress: SharedValue<number>;
}

export default function AnimatedBackground({
  localProgress,
  remoteProgress,
}: Props) {
  const size = 300;
  const r = useSharedValue(120);
  const rot = useSharedValue(0);
  const c = useDerivedValue(() => size - r.value);

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
        blendMode="multiply"
        transform={[
          { translateX: 78 },
          { translateY: 408 },
          { rotateZ: rot.value },
        ]}
        origin={{ x: size / 3, y: size / 2 }}
      >
        <Circle cx={r} cy={r} r={r} color="cyan" opacity={1} />
        <Circle cx={c} cy={r} r={r} color="magenta" opacity={1} />
        <Circle cx={size / 2} cy={c} r={r} color="yellow" opacity={1} />
      </Group>
    </Canvas>
  );
}
