import type { RefObject } from 'react';
import styles from './Editor.module.css';

interface MarkdownTextareaProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownTextarea({ textareaRef, value, onChange }: MarkdownTextareaProps) {
  return (
    <textarea
      ref={textareaRef}
      className={styles.textarea}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck="true"
      aria-label="Markdown body"
      placeholder="Write Markdown here..."
    />
  );
}
