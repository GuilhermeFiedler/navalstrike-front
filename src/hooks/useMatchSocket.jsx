import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useMatchSocket(matchId, onEvent) {
  const [connected, setConnected] = useState(false);
  const onEventRef = useRef(onEvent);
  const prevClientRef = useRef(null);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!matchId) return;

    let cancelled = false;

    if (prevClientRef.current) {
      prevClientRef.current.deactivate();
      prevClientRef.current = null;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 3000,
      onConnect: () => {
        if (cancelled) return;
        setConnected(true);
        client.subscribe(`/topic/match/${matchId}`, (message) => {
          if (cancelled) return;
          const event = JSON.parse(message.body);
          onEventRef.current(event);
        });
        onEventRef.current({ type: "_SOCKET_CONNECTED" });
      },
      onDisconnect: () => {
        if (!cancelled) setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        if (!cancelled) setConnected(false);
      },
    });

    client.activate();
    prevClientRef.current = client;

    return () => {
      cancelled = true;
      setConnected(false);
      client.deactivate();
    };
  }, [matchId]);

  return { connected };
}
