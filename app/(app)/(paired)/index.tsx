import { Animated, Easing, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useDeviceCode } from "@/hooks/useDeviceCode";
import { usePairing } from "@/ctx/PairingContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSupabaseChannel } from "@/hooks/useSupabaseChannel";

const FILL_DURATION = 5000;
const DRAIN_DURATION = 200;

export default function Index() {
  const { currentPair } = usePairing();
  const { deviceCode } = useDeviceCode();
  const isMaster = useMemo(() => {
    return currentPair?.master_code === deviceCode;
  }, [currentPair, deviceCode]);
  const [isPressed, setIsPressed] = useState(false);
  const masterValue = useRef(new Animated.Value(0)).current;
  const slaveValue = useRef(new Animated.Value(0)).current;
  const [meterWidth, setMeterWidth] = useState(0);
  const [pipWidth, setPipWidth] = useState(0);

  const handleMeterLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setMeterWidth(width);
  };

  const handlePipLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setPipWidth(width);
  };

  const fillMeter = () => {
    if (isMaster) {
      Animated.timing(masterValue, {
        toValue: 1,
        easing: Easing.linear,
        duration: FILL_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slaveValue, {
        toValue: 1,
        easing: Easing.linear,
        duration: FILL_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  const drainMeter = () => {
    if (isMaster) {
      Animated.timing(masterValue, {
        toValue: 0,
        easing: Easing.linear,
        duration: DRAIN_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slaveValue, {
        toValue: 0,
        easing: Easing.linear,
        duration: DRAIN_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  const fillRemoteMeter = () => {
    if (!isMaster) {
      Animated.timing(masterValue, {
        toValue: 1,
        easing: Easing.linear,
        duration: FILL_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slaveValue, {
        toValue: 1,
        easing: Easing.linear,
        duration: FILL_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  const drainRemoteMeter = () => {
    if (!isMaster) {
      Animated.timing(masterValue, {
        toValue: 0,
        easing: Easing.linear,
        duration: DRAIN_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slaveValue, {
        toValue: 0,
        easing: Easing.linear,
        duration: DRAIN_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  const { broadcast } = useSupabaseChannel(`power:${currentPair?.id}`, [
    {
      event: 'power-up',
      callback: fillRemoteMeter,
    },
    {
      event: 'power-down',
      callback: drainRemoteMeter,
    },
  ]);

  useEffect(() => {
    if (isPressed) {
      console.log("Powering up");
      fillMeter();
      broadcast('power-up', {});
    } else {
      console.log("Powering down");
      drainMeter();
      broadcast('power-down', {});
    }
  }, [isPressed]);

  const MasterPip = () => (
    <Animated.View
      onLayout={handlePipLayout}
      style={[
        styles.pip,
        {
          backgroundColor: '#ff0000',
          transform: [
            {
              translateX: masterValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, meterWidth / 2 - pipWidth / 2],
              }),
            }
          ]
        },
      ]}
    />
  )

  const SlavePip = () => (
    <Animated.View
      style={[
        styles.pip,
        {
          backgroundColor: '#0000ff',
          transform: [
            {
              translateX: slaveValue.interpolate({
                inputRange: [0, 1],
                outputRange: [meterWidth - pipWidth, meterWidth / 2 - pipWidth / 2],
              }),
            }
          ]
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Code: {deviceCode}</Text>
      <Text>{JSON.stringify(currentPair, null, 2)}</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          style={[
            styles.button,
            isPressed && styles.buttonPressed,
            {
              backgroundColor: isMaster ? '#ff0000' : '#0000ff',
            }
          ]}
        >
          <Text style={styles.buttonText}>Power up</Text>
        </Pressable>
      </View>

      <View
        style={styles.meterContainer}
        onLayout={handleMeterLayout}
      >
        <MasterPip />
        <SlavePip />
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
    margin: 50,
  },
  button: {
    borderRadius: "100%",
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
  },
  meterContainer: {
    height: 30,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#eee',
    borderRadius: 15,
  },
  pip: {
    position: "absolute",
    height: "100%",
    aspectRatio: 1,
    borderRadius: "100%",
    opacity: 0.5,
  },
});
