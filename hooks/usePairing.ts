import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useDeviceCode } from '@/hooks/useDeviceCode';

export function usePairing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<string | null>(null);
  const { deviceCode } = useDeviceCode();

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
        return await supabase
          .from("pairs")
          .update({
            slave_code: localCode,
          })
          .eq("id", existingPair.id);
      } else {
        console.log("Creating new pair");
        return await supabase.from("pairs").insert({
          master_code: remoteCode,
          slave_code: localCode,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
    
      const { data, error } = await supabase
        .from("pairs")
        .select()
        .or(`slave_code.eq.${deviceCode},master_code.eq.${deviceCode}`)
        .single();
      
      if (deviceCode === data?.master_code) {
        setCurrentPair(data.slave_code);
      } else if (deviceCode === data?.slave_code) {
        setCurrentPair(data.master_code);
      } else {
        setCurrentPair(null);
      }

      setLoading(false);
    })();
  }, [deviceCode]);

  return { initializePair, currentPair, loading, error };
}
