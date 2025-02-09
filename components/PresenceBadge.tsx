import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useMemo, useEffect, useRef, useReducer, useState } from 'react';
import { timeAgo } from '@/lib/timeAgo';
import { usePairPresence } from '@/ctx/PairPresenceContext';
import { usePairing } from '@/ctx/PairingContext';
import { useDeviceCode } from '@/hooks/useDeviceCode';

export function PresenceBadge() {
  const { currentPair } = usePairing();
  const { pairStatus } = usePairPresence();
  const { deviceCode } = useDeviceCode();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [lastSeenText, setLastSeenText] = useState<string | null>(null);

  const otherDeviceCode = useMemo(() => {
    return [currentPair?.master_code, currentPair?.slave_code].find(
      (dc) => dc !== deviceCode
    );
  }, [currentPair?.master_code, currentPair?.slave_code, deviceCode]);

  // Force update every second to keep the "time ago" fresh
  useEffect(() => {
    const updateLastSeen = () => {
      if (!pairStatus) {
        setLastSeenText('Never seen');
        return;
      }

      // Check online state first
      if (pairStatus.isOnline) {
        setLastSeenText('Online');
        return;
      }

      // Then handle offline states
      if (pairStatus.lastSeen === null) {
        setLastSeenText('Never seen');
        return;
      }

      const lastSeenTime = new Date(pairStatus.lastSeen || '1970-01-01 00:00:00').getTime();
      if (lastSeenTime > Date.now() - 1000 * 10) {
        setLastSeenText('Last seen just now');
        return;
      }

      setLastSeenText(`Last seen ${timeAgo(pairStatus.lastSeen)}`);
    };

    // Update immediately
    updateLastSeen();

    // Then update every second
    const timer = setInterval(() => {
      updateLastSeen();
      forceUpdate();
    }, 1000);

    return () => clearInterval(timer);
  }, [pairStatus]); // Add pairStatus as dependency to react to changes

  // Pulse animation effect
  useEffect(() => {
    if (pairStatus?.isOnline) {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.8,
          duration: 400,
          easing: Easing.elastic(3),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(pulse).start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => pulseAnim.stopAnimation();
  }, [pairStatus?.isOnline]);

  if (!otherDeviceCode) return null;

  return (
    <View style={[
      styles.container,
      { backgroundColor: pairStatus?.isOnline ? '#CCECD7' : '#E3E4E6' }
    ]}>
      <View style={styles.dotContainer}>
        {pairStatus?.isOnline && (
          <Animated.View style={[
            styles.dotPulse,
            {
              backgroundColor: '#22C55E',
              opacity: 0.3,
              transform: [{ scale: pulseAnim }],
            }
          ]} />
        )}
        <View style={[
          styles.dot,
          { backgroundColor: pairStatus?.isOnline ? '#22C55E' : '#C1C5CB' }
        ]} />
      </View>
      <Text style={styles.deviceCode}>{otherDeviceCode}</Text>
      <Text style={styles.lastSeen}>{lastSeenText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    maxWidth: '100%',
  },
  dotContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  dotPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
  },
  deviceCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginRight: 12,
  },
  lastSeen: {
    fontSize: 10,
    color: '#6B7280',
  },
});