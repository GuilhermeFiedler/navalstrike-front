import { useEffect, useRef, useState } from "react";
import lobbySong from "../assets/lobby/oceanlobbysong.mp3";

export default function useLobbyMusic(autoplay = true) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(lobbySong);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    if (autoplay) {
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
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function setVolume(vol) {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, vol));
    }
  }

  return { playing, toggle, setVolume };
}
