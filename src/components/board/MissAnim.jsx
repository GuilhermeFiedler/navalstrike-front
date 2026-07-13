import { useState, useEffect } from "react";
import frame1 from "../../assets/missanimation/missanimation.png";
import frame2 from "../../assets/missanimation/missanimation2.png";
import frame3 from "../../assets/missanimation/missanimation3.png";
import frame4 from "../../assets/missanimation/missanimation4.png";
import frame5 from "../../assets/missanimation/missanimation5.png";
import frame6 from "../../assets/missanimation/missanimation6.png";
import frame7 from "../../assets/missanimation/missanimation7.png";
import styles from "./MissAnim.module.css";

const FRAMES = [frame1, frame2, frame3, frame4, frame5, frame6, frame7];
const FRAME_DURATION = 75;

export default function MissAnim({ onEnd }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (frame >= FRAMES.length) {
      onEnd?.();
      return;
    }
    const timer = setTimeout(() => setFrame((f) => f + 1), FRAME_DURATION);
    return () => clearTimeout(timer);
  }, [frame, onEnd]);

  if (frame >= FRAMES.length) return null;

  return (
    <div className={styles.wrapper}>
      <img src={FRAMES[frame]} alt="" className={styles.frame} draggable={false} />
    </div>
  );
}
