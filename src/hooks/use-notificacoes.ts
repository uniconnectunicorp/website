"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  linkUrl?: string | null;
  createdAt: string;
}

const POLL_INTERVAL = 15000; // 15 seconds

export function useNotificacoes(initial: Notificacao[]) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initial);
  const prevCountRef = useRef(initial.filter((n) => !n.lida).length);

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
    const interval = setInterval(fetchNotificacoes, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotificacoes]);

  return { notificacoes, refetch: fetchNotificacoes };
}
