import styles from './Editor.module.css';

interface ToolbarProps {
  onBold: () => void;
  onCodeBlock: () => void;
  onExport: () => void;
  onHeading: () => void;
  onItalic: () => void;
  onLink: () => void;
}

export function Toolbar({
  onBold,
  onCodeBlock,
  onExport,
  onHeading,
  onItalic,
  onLink,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar} aria-label="Markdown toolbar">
      <button type="button" onClick={onBold} title="Bold">
        B
      </button>
      <button type="button" onClick={onItalic} title="Italic">
        I
      </button>
      <button type="button" onClick={onHeading} title="Heading">
        H
      </button>
      <button type="button" onClick={onLink} title="Link">
        Link
      </button>
      <button type="button" onClick={onCodeBlock} title="Code block">
        Code
      </button>
      <button className={styles.exportButton} type="button" onClick={onExport} title="Export note">
        Export
      </button>
    </div>
  );
}
