interface PowerButtonProps {
  isPowered: boolean;
  isConnecting: boolean;
  onToggle: () => void;
}

export function PowerButton({ isPowered, isConnecting, onToggle }: PowerButtonProps) {
  const label = isPowered ? 'Turn radio off' : 'Turn radio on';

  return (
    <button
      type="button"
      className={`power-button ${isPowered ? 'is-on' : ''} ${isConnecting ? 'is-connecting' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isPowered}
      aria-keyshortcuts="Space"
    >
      <span className="power-button__lamp" aria-hidden="true" />
      <span className="power-button__text">{isPowered ? 'On Air' : 'Off Air'}</span>
    </button>
  );
}
