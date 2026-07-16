import { useEffect, useRef, useState } from "react";
import lobbySong from "../assets/lobby/oceanlobbysong.mp3";

const MUSIC_PREF_KEY = "lobbyMusicEnabled";

function getMusicPref() {
  const stored = localStorage.getItem(MUSIC_PREF_KEY);
  if (stored === null) return true;
  return stored === "true";
}

export default function useLobbyMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(lobbySong);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const shouldPlay = getMusicPref();
    if (shouldPlay) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem(MUSIC_PREF_KEY, "false");
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
      localStorage.setItem(MUSIC_PREF_KEY, "true");
    }
  }

  function setVolume(vol) {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, vol));
    }
  }

  return { playing, toggle, setVolume };
}
