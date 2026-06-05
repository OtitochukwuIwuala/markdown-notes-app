import { useDebounce } from '../../hooks/useDebounce';
import { useMarkdown } from '../../hooks/useMarkdown';
import styles from './Preview.module.css';

interface PreviewProps {
  body: string;
  title: string;
}

export function Preview({ body, title }: PreviewProps) {
  const debouncedBody = useDebounce(body, 300);
  const html = useMarkdown(debouncedBody);

  return (
    <div className={styles.preview}>
      <header className={styles.previewHeader}>
        <p>Live preview</p>
        <h2>{title || 'Untitled note'}</h2>
      </header>
      <article
        className={styles.previewBody}
        dangerouslySetInnerHTML={{ __html: html }}
        aria-label="Sanitised Markdown preview"
      />
    </div>
  );
}
