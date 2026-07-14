import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export default function useSkins() {
  const [packs, setPacks] = useState([]);
  const [equippedSlug, setEquippedSlug] = useState(null);
  const [equippedId, setEquippedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSkins = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [packsRes, equippedRes] = await Promise.all([
        api.get("/skins"),
        api.get("/skins/equipped"),
      ]);
      setPacks(packsRes.data);
      setEquippedId(equippedRes.data.skinPackId || null);
      setEquippedSlug(equippedRes.data.slug || null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar skins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkins();
  }, [fetchSkins]);

  async function equip(skinPackId) {
    setError("");
    try {
      await api.put("/skins/equip", { skinPackId });
      setEquippedId(skinPackId);
      const pack = packs.find((p) => p.id === skinPackId);
      setEquippedSlug(pack?.slug || null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao equipar skin");
      throw err;
    }
  }

  async function unequip() {
    setError("");
    try {
      await api.put("/skins/equip", { skinPackId: null });
      setEquippedId(null);
      setEquippedSlug(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao desequipar skin");
      throw err;
    }
  }

  return {
    packs,
    equippedSlug,
    equippedId,
    loading,
    error,
    equip,
    unequip,
    refresh: fetchSkins,
  };
}
