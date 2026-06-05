import type { Note } from '../../types/note';
import { formatDate, formatTime } from '../../utils/formatDate';
import styles from './Sidebar.module.css';

interface NoteListItemProps {
  isActive: boolean;
  note: Note;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

function getExcerpt(body: string): string {
  return body
    .replace(/[#*_`>\-[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 110);
}

export function NoteListItem({ isActive, note, onDelete, onSelect }: NoteListItemProps) {
  return (
    <article className={`${styles.noteItem} ${isActive ? styles.activeNote : ''}`}>
      <button className={styles.noteButton} type="button" onClick={() => onSelect(note.id)}>
        <span className={styles.noteTitle}>{note.title || 'Untitled note'}</span>
        <span className={styles.noteMeta}>
          {formatDate(note.updatedAt)} at {formatTime(note.updatedAt)}
        </span>
        <span className={styles.noteExcerpt}>{getExcerpt(note.body) || 'No body text yet'}</span>
        {note.tags.length > 0 ? (
          <span className={styles.noteTags}>
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        ) : null}
      </button>
      <button
        className={styles.deleteButton}
        type="button"
        aria-label={`Delete ${note.title || 'note'}`}
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </article>
  );
}
