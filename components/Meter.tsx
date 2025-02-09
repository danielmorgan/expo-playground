import { AnimatedProp, Canvas, Color, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useState } from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface Props {
  progress: SharedValue<number>;
  colors: AnimatedProp<Color[]>;
  flipped?: boolean;
}

export default function Meter({ progress, colors, flipped = false }: Props) {
  const [meterMaxWidth, setMeterMaxWidth] = useState(0);

  const meterWidth = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      onLayout={(e) => setMeterMaxWidth(e.nativeEvent.layout.width)}
      style={localStyles.meterContainer}
    >
      <Animated.View style={[
        localStyles.meter,
        meterWidth,
        !flipped ? { left: 0 } : { right: 0 },
      ]}>
        <Canvas style={{ flex: 1 }}>
          <Rect x={0} y={0} width={meterMaxWidth} height={40}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(meterMaxWidth, 0)}
              colors={colors}
            />
          </Rect>
        </Canvas>
      </Animated.View>
    </View>
  );
}
const localStyles = StyleSheet.create({
  meterContainer: {
    height: 40,
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#eee',
    borderRadius: 20,
    overflow: 'hidden',
  },
  meter: {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: '100%',
    // minWidth: '100%',
  },
});
