import type { Note } from '../../types/note';
import { NoteListItem } from './NoteListItem';
import styles from './Sidebar.module.css';

interface NoteListProps {
  activeNoteId: string;
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onSelectNote: (id: string) => void;
}

export function NoteList({ activeNoteId, notes, onDeleteNote, onSelectNote }: NoteListProps) {
  if (notes.length === 0) {
    return <p className={styles.emptyState}>No notes match your filters.</p>;
  }

  return (
    <div className={styles.noteList}>
      {notes.map((note) => (
        <NoteListItem
          isActive={note.id === activeNoteId}
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          onSelect={onSelectNote}
        />
      ))}
    </div>
  );
}
