import Sidebar from "../../components/sidebar/Sidebar";
import useMatches from "../../hooks/useMatches";
import HubHeader from "./HubHeader";
import MatchList from "./MatchList";
import JoinByCode from "./JoinByCode";
import MusicToggle from "./MusicToggle";
import styles from "./Hub.module.css";

export default function Hub() {
  const {
    matches,
    error,
    setError,
    loading,
    creating,
    userId,
    fetchMatches,
    handleCreate,
    handleJoinByCode,
    handleJoin,
    handleConnect,
  } = useMatches();

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <HubHeader
          onRefresh={fetchMatches}
          onCreate={handleCreate}
          loading={loading}
          creating={creating}
        />

        {error && <p className={styles.error}>{error}</p>}

        <JoinByCode onJoin={handleJoinByCode} onError={setError} />

        <MatchList
          matches={matches}
          loading={loading}
          userId={userId}
          onConnect={handleConnect}
          onJoin={handleJoin}
        />

        <MusicToggle />
      </main>
    </div>
  );
}
