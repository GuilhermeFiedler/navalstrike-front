import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { PAGE_SIZE } from "../constants";

export default function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [res] = await Promise.all([
        api.get("/matches/history"),
        new Promise((r) => setTimeout(r, 800)),
      ]);
      setHistory(res.data);
      setPage(0);
    } catch {
      setError("Erro ao carregar histórico de partidas");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const victories = history.filter((m) => m.result === "VICTORY").length;
  const defeats = history.filter((m) => m.result === "DEFEAT").length;
  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const paginatedHistory = history.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return {
    history,
    paginatedHistory,
    loading,
    error,
    page,
    totalPages,
    victories,
    defeats,
    setPage,
    fetchHistory,
  };
}
