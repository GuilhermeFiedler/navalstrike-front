import { useState, useCallback } from "react";

export default function useAnimations() {
  const [explosions, setExplosions] = useState([]);
  const [missAnims, setMissAnims] = useState([]);

  const addExplosion = useCallback((x, y, isMyAttack) => {
    setExplosions((prev) => [...prev, { x, y, id: `${x}-${y}-${Date.now()}`, isMyAttack }]);
  }, []);

  const addMissAnim = useCallback((x, y, isMyAttack) => {
    setMissAnims((prev) => [...prev, { x, y, id: `${x}-${y}-${Date.now()}`, isMyAttack }]);
  }, []);

  const removeExplosion = useCallback((x, y) => {
    setExplosions((prev) => prev.filter((e) => !(e.x === x && e.y === y)));
  }, []);

  const removeMissAnim = useCallback((x, y) => {
    setMissAnims((prev) => prev.filter((e) => !(e.x === x && e.y === y)));
  }, []);

  return {
    explosions,
    missAnims,
    addExplosion,
    addMissAnim,
    removeExplosion,
    removeMissAnim,
  };
}
