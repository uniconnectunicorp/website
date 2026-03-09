"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Notificacao {
  id: string;
  userId: string;
  recipientName?: string | null;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  linkUrl?: string | null;
  createdAt: string;
}

export function useNotificacoes(initial: Notificacao[]) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initial);
  const prevCountRef = useRef(initial.filter((n) => !n.lida).length);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Two-tone notification chime
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playTone(880, 0, 0.15);
      playTone(1320, 0.12, 0.2);
    } catch {
      // Web Audio API not available
    }
  }, []);

  const fetchNotificacoes = useCallback(async () => {
    try {
      const res = await fetch("/api/notificacoes", { cache: "no-store" });
      if (!res.ok) return;
      const data: Notificacao[] = await res.json();
      setNotificacoes(data);

      const newUnread = data.filter((n) => !n.lida).length;
      if (newUnread > prevCountRef.current) {
        playSound();
      }
      prevCountRef.current = newUnread;
    } catch {
      // Silently fail
    }
  }, [playSound]);

  useEffect(() => {
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      const source = new EventSource("/api/notifications/stream");
      eventSourceRef.current = source;

      source.addEventListener("snapshot", ((event: MessageEvent) => {
        const payload = JSON.parse(event.data) as { notificacoes: Notificacao[] };
        setNotificacoes(payload.notificacoes);
        prevCountRef.current = payload.notificacoes.filter((n) => !n.lida).length;
      }) as EventListener);

      source.addEventListener("message", ((event: MessageEvent) => {
        const payload = JSON.parse(event.data) as
          | { type: "notificacao_criada"; notificacao: Notificacao }
          | { type: "notificacao_lida"; notificacaoId: string }
          | { type: "notificacoes_lidas" };

        setNotificacoes((current) => {
          let next = current;

          if (payload.type === "notificacao_criada") {
            if (current.some((item) => item.id === payload.notificacao.id)) return current;
            next = [payload.notificacao, ...current].slice(0, 20);
          }

          if (payload.type === "notificacao_lida") {
            next = current.map((item) => item.id === payload.notificacaoId ? { ...item, lida: true } : item);
          }

          if (payload.type === "notificacoes_lidas") {
            next = current.map((item) => ({ ...item, lida: true }));
          }

          const newUnread = next.filter((n) => !n.lida).length;
          if (newUnread > prevCountRef.current) {
            playSound();
          }
          prevCountRef.current = newUnread;
          return next;
        });
      }) as EventListener);

      source.onerror = () => {
        source.close();
        eventSourceRef.current = null;
        if (cancelled) return;
        reconnectTimeoutRef.current = setTimeout(() => {
          fetchNotificacoes();
          connect();
        }, 1500);
      };
    };

    connect();

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [fetchNotificacoes]);

  return { notificacoes, refetch: fetchNotificacoes };
}
