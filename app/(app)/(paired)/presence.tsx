import { useDeviceCode } from "@/hooks/useDeviceCode";
import { supabase } from "@/lib/supabaseClient";
import { usePairing } from "@/ctx/PairingContext";
import { useFocusEffect } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface PresenceProps {
  prop: string;
}

export default function Presence({ prop }: PresenceProps) {
  const { currentPair } = usePairing();
  const roomId = useMemo(() => currentPair?.id, [currentPair]);
  const { deviceCode } = useDeviceCode();

  useFocusEffect(() => {
    if (!deviceCode || !roomId) return;
    console.log('focus', { deviceCode, roomId });

    const presenceChannel = supabase.channel(roomId, {
      config: {
        presence: {
          key: deviceCode,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'join' }, () => {
        console.log('join', deviceCode, roomId);
        const presenceState = presenceChannel.presenceState();
        Object.keys(presenceState).forEach((id) => {
          console.log(presenceState[id]);
        });
      })
      .on('presence', { event: 'leave' }, () => {
        console.log('join', deviceCode, roomId);
        const presenceState = presenceChannel.presenceState();
        Object.keys(presenceState).forEach((id) => {
          console.log(presenceState[id]);
        });
      })
      .subscribe();

    return () => {
      console.log('unfocus', { deviceCode, roomId });
      presenceChannel.unsubscribe();
    };
  });

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Presence</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
