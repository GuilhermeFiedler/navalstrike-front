import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import OceanShader from "../../components/OceanShader";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/hub");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Erro ao fazer login.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <OceanShader className={styles.shaderBg} />
      <header className={styles.header}>
        <div className={styles.logo}>⚓</div>
        <h1 className={styles.title}>Naval Strike</h1>
        <span className={styles.subtitle}>Acesso ao sistema de combate</span>
      </header>

      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <span className={styles.lockIcon}>🔒</span>
          <h2>Login</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <input
                id="email"
                type="email"
                placeholder="comandante@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className={styles.inputIcon}>👤</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className={styles.inputIcon}>🔑</span>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Conectando..." : "Ingressar →"}
          </button>
        </form>

        <footer className={styles.footer}>
          <p>
            👤 Não tem uma conta?{" "}
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
              Cadastre-se
            </a>
          </p>
        </footer>

        <div className={styles.statusBar}>
          <span>&gt; Estabelecendo conexão segura...</span>
          <span className={styles.cursor}></span>
        </div>
      </div>

      <div className={styles.decorDot}></div>
    </div>
  );
}
