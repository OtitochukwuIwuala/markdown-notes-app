import styles from './Sidebar.module.css';

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
}

export function TagFilter({ tags, activeTag, onChange }: TagFilterProps) {
  return (
    <div className={styles.tagFilter} aria-label="Filter by tag">
      <button
        className={!activeTag ? styles.activeTag : undefined}
        type="button"
        onClick={() => onChange(null)}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          className={activeTag === tag ? styles.activeTag : undefined}
          key={tag}
          type="button"
          onClick={() => onChange(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
