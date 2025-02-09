import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { SharedValue, useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

interface Props {
  localProgress: SharedValue<number>;
  remoteProgress: SharedValue<number>;
}

export default function AnimatedBackground({ localProgress, remoteProgress }: Props) {
  const size = 256;
  const r = useSharedValue(0);
  const c = useDerivedValue(() => size - r.value);
  useEffect(() => {
    r.value = withRepeat(withTiming(size * 0.33, { duration: 1000 }), -1);
  }, [r, size]);

  return (
    <Canvas style={{
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#222'
    }}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={c} cy={r} r={r} color="magenta" />
        <Circle
          cx={size/2}
          cy={c}
          r={r}
          color="yellow"
        />
      </Group>
    </Canvas>
  )
}