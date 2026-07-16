import './Button.css'
import useSoundFX from '../../hooks/useSoundFX'

export default function Button({ children, onClick, type = "button", variant = "primary", className = "", ...rest }) {
  const { playClick } = useSoundFX();

  const handleClick = (e) => {
    playClick();
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`btn btn-${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
