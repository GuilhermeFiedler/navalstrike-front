import { useEffect } from "react";
import Button from "../button/Button";
import styles from "./Modal.module.css";

export default function Modal({ open, title, children, onConfirm, onCancel, confirmLabel = "Confirmar", cancelLabel = "Cancelar", variant = "danger" }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.body}>{children}</div>
        <div className={styles.actions}>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          {onConfirm && (
            <Button variant={variant} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
