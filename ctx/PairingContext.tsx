import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useDeviceCode } from "@/hooks/useDeviceCode";
import { RealtimeChannel } from "@supabase/supabase-js";

type Pair = {
  id: string;
  master_code: string;
  slave_code: string;
  created_at: string;
};

type PairingContextType = {
  currentPair: Pair | null;
  isMaster: boolean;
  loading: boolean;
  error: string | null;
  initializePair: (remoteCode: string, localCode: string) => Promise<void>;
  unpair: () => Promise<void>;
};

const PairingContext = createContext<PairingContextType | null>(null);

export function PairingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<Pair | null>(null);
  const { deviceCode } = useDeviceCode();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Initialize subscription
  useEffect(() => {
    if (!deviceCode) return;

    if (!channel) {
      const newChannel = supabase
        .channel("pairs-channel")
        // Listen for master_code changes
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "pairs",
            filter: `master_code=eq.${deviceCode}`,
          },
          (payload) => {
            console.log("Master code change:", payload);
            setCurrentPair(payload.new as Pair);
          },
        )
        // Listen for slave_code changes
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "pairs",
            filter: `slave_code=eq.${deviceCode}`,
          },
          (payload) => {
            console.log("Slave code change:", payload);
            setCurrentPair(payload.new as Pair);
          },
        )
        // Listen for slave_code changes
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            tatble: "pairs",
            filter: `id=eq.${currentPair?.id}`,
          },
          (payload) => {
            console.log("PAIR DELETED", payload);
            setCurrentPair(null);
          },
        );

      newChannel.subscribe();
      setChannel(newChannel);
      console.log(`[${deviceCode}] +SUBSCRIBED postgres_changes`);
    }

    // Cleanup function
    return () => {
      if (channel) {
        channel.unsubscribe();
        setChannel(null);
        console.log(`[${deviceCode}] -UNSUBSCRIBED postgres_changes`);
      }
    };
  }, [deviceCode]);

  // Initial pair fetch
  useEffect(() => {
    (async () => {
      if (!deviceCode) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("pairs")
        .select()
        .or(`slave_code.eq.${deviceCode},master_code.eq.${deviceCode}`)
        .single();

      if (deviceCode === data?.master_code || deviceCode === data?.slave_code) {
        setCurrentPair(data);
      } else {
        setCurrentPair(null);
      }

      setLoading(false);
    })();
  }, [deviceCode]);

  const initializePair = async (remoteCode: string, localCode: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Pairing", { remoteCode, localCode });
      const { data: existingPair, error } = await supabase
        .from("pairs")
        .select()
        .eq("master_code", remoteCode)
        .single();

      if (existingPair) {
        console.log("Pair already exists", existingPair);
        await supabase
          .from("pairs")
          .update({
            slave_code: localCode,
          })
          .eq("id", existingPair.id);
      } else {
        console.log("Creating new pair");
        await supabase.from("pairs").insert({
          master_code: remoteCode,
          slave_code: localCode,
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const unpair = async () => {
    if (!currentPair?.id) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`[${deviceCode}] Unpairing device with code:`, deviceCode);

      const { error } = await supabase
        .from("pairs")
        .delete()
        .eq("id", currentPair.id);

      if (error) {
        throw new Error(`Failed to unpair: ${error.message}`);
      }

      // setCurrentPair(null);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const isMaster = useMemo(() => {
    return currentPair?.master_code === deviceCode;
  }, [currentPair, deviceCode]);

  return (
    <PairingContext.Provider
      value={{
        currentPair,
        isMaster,
        loading,
        error,
        initializePair,
        unpair,
      }}
    >
      {children}
    </PairingContext.Provider>
  );
}

// Create a new hook that uses the context
export function usePairing() {
  const context = useContext(PairingContext);
  if (!context) {
    throw new Error("usePairing must be used within a PairingProvider");
  }
  return context;
}
