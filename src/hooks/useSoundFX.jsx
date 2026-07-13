import { useRef, useCallback } from "react";

function createNoiseBuffer(ctx, duration, decay) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, decay);
  }
  return buffer;
}

function createFilteredNoise(ctx, { duration, decay, filterType, freqStart, freqEnd, Q, volume }) {
  const now = ctx.currentTime;
  const buffer = createNoiseBuffer(ctx, duration, decay);

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(freqStart, now);
  filter.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
  if (Q) filter.Q.value = Q;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration);
}

function createTone(ctx, { type, freqStart, freqEnd, duration, volume }) {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

export default function useSoundFX() {
  const ctxRef = useRef(null);

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }

  const playHit = useCallback(() => {
    const ctx = getCtx();
    createFilteredNoise(ctx, {
      duration: 0.4,
      decay: 3,
      filterType: "lowpass",
      freqStart: 800,
      freqEnd: 100,
      volume: 0.6,
    });
    createTone(ctx, {
      type: "sine",
      freqStart: 150,
      freqEnd: 40,
      duration: 0.3,
      volume: 0.4,
    });
  }, []);

  const playMiss = useCallback(() => {
    const ctx = getCtx();
    createFilteredNoise(ctx, {
      duration: 0.3,
      decay: 2,
      filterType: "bandpass",
      freqStart: 2000,
      freqEnd: 400,
      Q: 1.5,
      volume: 0.3,
    });
  }, []);

  const playSunk = useCallback(() => {
    const ctx = getCtx();
    createFilteredNoise(ctx, {
      duration: 0.8,
      decay: 2,
      filterType: "lowpass",
      freqStart: 1200,
      freqEnd: 60,
      volume: 0.7,
    });
    createTone(ctx, {
      type: "sawtooth",
      freqStart: 300,
      freqEnd: 30,
      duration: 0.7,
      volume: 0.25,
    });
  }, []);

  return { playHit, playMiss, playSunk };
}
