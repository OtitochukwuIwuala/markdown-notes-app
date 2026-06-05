import { useState } from 'react';
import styles from './Editor.module.css';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function TagsInput({ tags, onChange }: TagsInputProps) {
  const [draftTag, setDraftTag] = useState('');

  const addTag = (value: string) => {
    const nextTag = normalizeTag(value);

    if (!nextTag || tags.includes(nextTag)) {
      return;
    }

    onChange([...tags, nextTag]);
    setDraftTag('');
  };

  return (
    <div className={styles.tagsInput}>
      <div className={styles.tagChips}>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tags.filter((item) => item !== tag))}
            title={`Remove ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={draftTag}
        onBlur={() => addTag(draftTag)}
        onChange={(event) => setDraftTag(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTag(draftTag);
          }
        }}
        placeholder="Add tag"
        aria-label="Add tag"
      />
    </div>
  );
}
