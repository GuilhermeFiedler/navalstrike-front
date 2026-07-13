import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";
import Sidebar from "../../components/sidebar/Sidebar";
import MatchCard from "./MatchCard";
import JoinByCode from "./JoinByCode";
import styles from "./Hub.module.css";

export default function Hub() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

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
      setError(err.response?.data?.message || "Código inválido ou partida indisponível");
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

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Listagem de Partidas</h1>
          <div className={styles.headerActions}>
            <button
              className={styles.btnRefresh}
              onClick={fetchMatches}
              disabled={loading}
            >
              Atualizar Lista
            </button>
            <button
              className={styles.btnCreate}
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Criando..." : "Nova Partida"}
            </button>
          </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        <JoinByCode onJoin={handleJoinByCode} onError={setError} />

        <div className={styles.matchList}>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              userId={user?.id}
              onConnect={handleConnect}
              onJoin={handleJoin}
            />
          ))}

          {loading && (
            <div className={styles.loadingCard}>
              <span className={styles.loadingIcon}>⟳</span>
              <span className={styles.loadingText}>Buscando novos setores...</span>
            </div>
          )}

          {!loading && matches.length === 0 && (
            <div className={styles.emptyState}>
              <span>⚓</span>
              <span className={styles.emptyText}>
                Nenhuma partida disponível no momento.
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
