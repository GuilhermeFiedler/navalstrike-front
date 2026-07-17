import { useState } from "react";
import styles from "./Hub.module.css";
import Button from "../../components/button/Button";
import NavalCard from "../../components/NavalCard/NavalCard";

export default function JoinByCode({ onJoin, onError }) {
  const [code, setCode] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 6) {
      onError("O código deve ter 6 caracteres");
      return;
    }
    onJoin(code.toUpperCase());
  }

  return (
    <NavalCard className={styles.codeSection}>
      <form className={styles.codeForm} onSubmit={handleSubmit}>
        <label className={styles.codeLabel} htmlFor="matchCode">
          Entrar por código
        </label>
        <div className={styles.codeInputGroup}>
          <input
            id="matchCode"
            className={styles.codeInput}
            type="text"
            maxLength={6}
            placeholder="EX: A3X9K2"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button type="submit" variant="primary">
            Ingressar
          </Button>
        </div>
      </form>
    </NavalCard>
  );
}
