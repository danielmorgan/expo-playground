import { useEffect, useRef } from 'react';
import { RealtimeChannel, REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type BroadcastEvent = {
  event: string;
  callback: (payload: any) => void;
};

export function useSupabaseChannel(
  channelName: string,
  events: BroadcastEvent[],
  dependencies: any[] = []
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    events.forEach(({ event, callback }) => {
      channel.on('broadcast' as const, { event }, callback);
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to channel: ${channelName}`);
      }
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        console.log(`Unsubscribed from channel: ${channelName}`);
      }
    };
  }, [channelName, ...dependencies]);

  const broadcast = async (event: string, payload: any) => {
    if (!channelRef.current) return;
    
    channelRef.current.send({
      type: 'broadcast',
      event,
      payload,
    }).then(() => {
      console.log(`Broadcasted event: ${event} with payload:`, payload);
    })
  };

  return { channel: channelRef.current, broadcast };
}