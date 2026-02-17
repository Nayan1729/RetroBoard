import { useState, useEffect, useRef, useCallback } from "react";

function getWsUrl() {
    if (import.meta.env.DEV) {
        return "ws://localhost:3001";
    }
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
    }
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}`;
}

export default function useWebSocket(roomId) {
    const [cards, setCards] = useState([]);
    const [connected, setConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimer = useRef(null);
    const isMounted = useRef(false);

    const connect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const ws = new WebSocket(getWsUrl());
        wsRef.current = ws;

        ws.onopen = () => {
            if (!isMounted.current) {
                ws.close();
                return;
            }
            setConnected(true);
            ws.send(JSON.stringify({ type: "join", roomId }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case "init":
                    setCards(msg.cards);
                    break;

                case "card-added":
                    setCards((prev) => [...prev, msg.card]);
                    break;

                case "card-edited":
                    setCards((prev) =>
                        prev.map((c) =>
                            c.id === msg.id ? { ...c, text: msg.text } : c
                        )
                    );
                    break;

                case "card-deleted":
                    setCards((prev) => prev.filter((c) => c.id !== msg.id));
                    break;

                default:
                    break;
            }
        };

        ws.onclose = () => {
            setConnected(false);
            if (isMounted.current) {
                reconnectTimer.current = setTimeout(() => {
                    connect();
                }, 2000);
            }
        };

        ws.onerror = () => {
            ws.close();
        };
    }, [roomId]);

    useEffect(() => {
        isMounted.current = true;
        connect();

        return () => {
            isMounted.current = false;
            clearTimeout(reconnectTimer.current);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    function sendMessage(msg) {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ ...msg, roomId }));
        }
    }

    return { cards, connected, sendMessage };
}
