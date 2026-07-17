import Sidebar from "../../components/sidebar/Sidebar";
import OceanBackground from "../../components/OceanBackground";
import useSkins from "../../hooks/useSkins";
import SkinCard from "./SkinCard";
import DefaultSkinCard from "./DefaultSkinCard";
import styles from "./Dock.module.css";

export default function Dock() {
  const { packs, equippedId, loading, error, equip, unequip } = useSkins();

  const isDefaultEquipped = !equippedId;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <OceanBackground />
        <header className={styles.header}>
          <h1 className={styles.title}>Doca de Skins</h1>
          <span className={styles.subtitle}>
            Escolha o visual da sua frota
          </span>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.loadingIcon}>⟳</span>
            <span className={styles.loadingText}>Carregando pacotes...</span>
          </div>
        ) : (
          <div className={styles.skinGrid}>
            <DefaultSkinCard
              isEquipped={isDefaultEquipped}
              onSelect={unequip}
            />

            {packs.map((pack) => (
              <SkinCard
                key={pack.id}
                pack={pack}
                isEquipped={equippedId === pack.id}
                onEquip={equip}
                onUnequip={unequip}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
