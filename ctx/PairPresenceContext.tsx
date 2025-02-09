import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePairing } from "./PairingContext";
import { useDeviceCode } from "@/hooks/useDeviceCode";
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import { AppState } from "react-native";

type PresenceStatus = {
  isOnline: boolean;
  lastSeen: string;
};

type PairPresenceContextType = {
  pairStatus: PresenceStatus | null;
  isConnected: boolean;
};

const PairPresenceContext = createContext<PairPresenceContextType>({
  pairStatus: null,
  isConnected: false,
});

export function PairPresenceProvider({ children }: { children: React.ReactNode }) {
  const { currentPair } = usePairing();
  const { deviceCode } = useDeviceCode();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pairStatus, setPairStatus] = useState<PresenceStatus | null>(null);
  const appState = useRef(AppState.currentState);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      console.log('App State changed:', { from: appState.current, to: nextAppState });

      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        // App has come to foreground
        console.log('App has come to foreground');
        if (channel) {
          try {
            await channel.track({
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Failed to update presence on resume:', error);
          }
        }
      } else if (
        appState.current === 'active' && 
        nextAppState.match(/inactive|background/)
      ) {
        // App has gone to background
        console.log('App has gone to background');
        if (channel) {
          try {
            await channel.untrack();
          } catch (error) {
            console.error('Failed to untrack presence:', error);
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [channel]);

  useEffect(() => {
    if (!deviceCode || !currentPair?.id) {
      setPairStatus(null);
      return;
    }

    console.log("Initializing presence channel", `pair:${currentPair.id}`);

    const presenceChannel = supabase.channel(`pair:${currentPair.id}`, {
      config: {
        presence: {
          key: deviceCode,
        },
      },
    });

    const updatePairStatus = () => {
      const state = presenceChannel.presenceState();

      const otherDevice = Object.entries(state).find(
        ([key]) => key !== deviceCode
      );

      if (otherDevice) {
        const [_, presence] = otherDevice;
        setPairStatus({
          isOnline: true,
          lastSeen: new Date().toISOString(),
        });
      } else {
        setPairStatus((prev) =>
          prev
            ? { ...prev, isOnline: false, lastSeen: new Date().toISOString() }
            : null
        );
      }
    };

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        updatePairStatus();
      })
      .on("presence", { event: "join" }, ({ key }) => {
        console.log("Presence join:", key);
        updatePairStatus();
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.log("Presence leave:", key);
        updatePairStatus();
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && AppState.currentState === 'active') {
          setIsConnected(true);
          await presenceChannel.track({
            timestamp: new Date().toISOString(),
          });
        } else {
          setIsConnected(false);
        }
      });

    setChannel(presenceChannel);

    return () => {
      console.log("Cleaning up presence channel");
      presenceChannel.untrack().then(() => {
        supabase.removeChannel(presenceChannel);
      });
      setChannel(null);
      setIsConnected(false);
      setPairStatus(null);
    };
  }, [deviceCode, currentPair?.id]);

  // Heartbeat only when app is active
  useEffect(() => {
    if (!channel || !isConnected || AppState.currentState !== 'active') return;

    const heartbeat = setInterval(async () => {
      try {
        await channel.track({
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to update presence:", error);
      }
    }, 8000);

    return () => clearInterval(heartbeat);
  }, [channel, isConnected]);

  return (
    <PairPresenceContext.Provider value={{ pairStatus, isConnected }}>
      {children}
    </PairPresenceContext.Provider>
  );
}

export const usePairPresence = () => {
  const context = useContext(PairPresenceContext);
  if (!context) {
    throw new Error("usePairPresence must be used within a PairPresenceProvider");
  }
  return context;
};