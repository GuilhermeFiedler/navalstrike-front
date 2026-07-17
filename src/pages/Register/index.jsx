import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import OceanShader from "../../components/oceanShader/OceanShader";
import styles from "./Register.module.css";
import { GiPirateFlag, GiMailbox, GiKeyLock, GiLockedChest } from "react-icons/gi";

export default function Register() {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !passwordConfirmation) {
      setError("Preencha todos os campos");
      return;
    }

    if (name.trim().length < 3 || name.trim().length > 15) {
      setError("Nome de usuário deve ter entre 3 e 15 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de email inválido");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("A senha deve ter entre 8 e 128 caracteres");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate("/hub");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Erro ao cadastrar usuário";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <OceanShader className={styles.shaderBg} />

      <div className={styles.formTag}>Form: 1040-Navy</div>


      <div className={styles.decorDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>


      <div className={styles.registerCard}>
        <header className={styles.cardHeader}>
          <h1>Portal de Alistamento</h1>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome de Usuário</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><GiPirateFlag /></span>
              <input
                id="name"
                type="text"
                placeholder="Insira seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={15}
                autoComplete="username"
              />
            </div>
          </div>


          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><GiMailbox /></span>
              <input
                id="email"
                type="text"
                placeholder="navio@strike.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>


          <div className={styles.passwordRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha de segurança</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><GiKeyLock /></span>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="passwordConfirmation">Confirmar Senha</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><GiKeyLock /></span>
                <input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="********"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Cadastrando..." : " Cadastrar-se →"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <footer className={styles.footer}>
          <p>
            Já cadastrado?{" "}
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Faça Login
            </a>
          </p>
        </footer>
      </div>


      <div className={styles.bottomDots}>
        <div className={styles.bottomDot}></div>
        <div className={styles.bottomDot}></div>
        <div className={styles.bottomDot}></div>
      </div>
    </div>
  );
}
