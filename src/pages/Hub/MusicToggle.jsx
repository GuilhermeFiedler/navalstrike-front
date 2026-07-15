import useLobbyMusic from "../../hooks/useLobbyMusic";
import Button from "../../components/button/Button";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export default function MusicToggle() {
  const { playing, toggle } = useLobbyMusic();

  return (
    <Button
      variant="icon"
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Tocar música"}
      style={{ position: 'fixed', bottom: 'var(--space-5)', right: 'var(--space-5)', zIndex: 50 }}
    >
      {playing ? <FaVolumeUp /> : <FaVolumeMute />}
    </Button>
  );
}
