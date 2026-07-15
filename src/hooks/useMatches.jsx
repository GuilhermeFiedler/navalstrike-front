import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import api from "../utils/api";

const ERROR_MAP = {
  "Partida foi cancelada": "Esta partida foi cancelada pelo criador",
  "Partida já iniciada": "Esta partida já está em andamento",
  "Não é possível entrar na própria partida": "Você não pode entrar na sua própria partida",
};

export default function useMatches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        api.get("/matches"),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      const filtered = res.data.filter(
        (match) => match.hostId !== user?.id
      );
      setMatches(filtered);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/matches");
      const { matchId, code } = res.data;
      navigate(`/match/${matchId}`, { state: { code } });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar partida");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinByCode(code) {
    setError("");
    try {
      const res = await api.post("/matches/join-by-code", { code });
      navigate(`/match/${res.data.matchId}`);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      setError(ERROR_MAP[msg] || msg || "Código inválido ou partida indisponível");
    }
  }

  async function handleJoin(matchId) {
    setError("");
    try {
      await api.post(`/matches/${matchId}/join`);
      navigate(`/match/${matchId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível entrar na partida");
    }
  }

  function handleConnect(matchId) {
    navigate(`/match/${matchId}`);
  }

  return {
    matches,
    error,
    setError,
    loading,
    creating,
    userId: user?.id,
    fetchMatches,
    handleCreate,
    handleJoinByCode,
    handleJoin,
    handleConnect,
  };
}
