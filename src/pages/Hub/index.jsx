import Sidebar from "../../components/sidebar/Sidebar";
import OceanBackground from "../../components/OceanBackground";
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
        <OceanBackground />
        <HubHeader
          onRefresh={fetchMatches}
          onCreate={handleCreate}
          loading={loading}
          creating={creating}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.codeWrapper}>
          <JoinByCode onJoin={handleJoinByCode} onError={setError} />
        </div>

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
