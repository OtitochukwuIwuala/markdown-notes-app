import type { RefObject } from 'react';
import styles from './Editor.module.css';

interface TitleInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ inputRef, value, onChange }: TitleInputProps) {
  return (
    <input
      ref={inputRef}
      className={styles.titleInput}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Untitled note"
      aria-label="Note title"
    />
  );
}
