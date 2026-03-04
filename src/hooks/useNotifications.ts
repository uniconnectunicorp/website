"use client";

import { useEffect, useRef, useCallback } from "react";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  linkUrl?: string | null;
  createdAt: string;
}

const POLL_INTERVAL = 15000; // 15 segundos

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playTone = (freq: number, startTime: number, duration: number, gain: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(880, now, 0.15, 0.4);
    playTone(1100, now + 0.15, 0.15, 0.4);
    playTone(1320, now + 0.30, 0.25, 0.5);
  } catch {}
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch {
    return null;
  }
}

async function requestPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

async function showBrowserNotification(
  sw: ServiceWorkerRegistration | null,
  title: string,
  body: string,
  url: string,
  tag: string
) {
  if (Notification.permission !== "granted") return;

  if (sw) {
    sw.active?.postMessage({ type: "SHOW_NOTIFICATION", title, body, url, tag });
  } else {
    new Notification(title, {
      body,
      icon: "/android-chrome-192x192.png",
      tag,
    });
  }
}

export function useNotifications() {
  const swRef = useRef<ServiceWorkerRegistration | null>(null);
  const lastCheckRef = useRef<string>(new Date().toISOString());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const permissionGranted = useRef(false);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/notifications/poll?since=${encodeURIComponent(lastCheckRef.current)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const { notificacoes } = await res.json() as { notificacoes: Notificacao[] };

      const newOnes = notificacoes.filter((n) => !seenIdsRef.current.has(n.id));
      if (newOnes.length === 0) return;

      lastCheckRef.current = new Date().toISOString();

      for (const n of newOnes) {
        seenIdsRef.current.add(n.id);

        playNotificationSound();

        if (permissionGranted.current) {
          await showBrowserNotification(
            swRef.current,
            n.titulo,
            n.mensagem,
            n.linkUrl || "/admin/crm-pipeline",
            n.id
          );
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      swRef.current = await registerServiceWorker();
      permissionGranted.current = await requestPermission();

      if (cancelled) return;

      // Poll imediato ao montar
      await poll();

      intervalRef.current = setInterval(poll, POLL_INTERVAL);
    }

    init();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [poll]);
}
