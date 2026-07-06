import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
export default function useMatchSocket(matchId, onEvent) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!matchId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/match/${matchId}`, (message) => {
          const event = JSON.parse(message.body);
          onEvent(event);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [matchId]);

  return { connected };
}
