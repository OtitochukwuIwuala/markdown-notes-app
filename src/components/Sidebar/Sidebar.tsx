import type { Note } from '../../types/note';
import { NoteList } from './NoteList';
import { SearchBar } from './SearchBar';
import { TagFilter } from './TagFilter';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeNoteId: string;
  activeTag: string | null;
  allTags: string[];
  notes: Note[];
  searchQuery: string;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onSearchChange: (value: string) => void;
  onSelectNote: (id: string) => void;
  onTagChange: (tag: string | null) => void;
}

export function Sidebar({
  activeNoteId,
  activeTag,
  allTags,
  notes,
  searchQuery,
  onCreateNote,
  onDeleteNote,
  onSearchChange,
  onSelectNote,
  onTagChange,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div>
          <p className={styles.count}>{notes.length} notes</p>
          <h2>Library</h2>
        </div>
        <button className={styles.newButton} type="button" onClick={onCreateNote}>
          New
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <TagFilter activeTag={activeTag} tags={allTags} onChange={onTagChange} />
      <NoteList
        activeNoteId={activeNoteId}
        notes={notes}
        onDeleteNote={onDeleteNote}
        onSelectNote={onSelectNote}
      />
    </aside>
  );
}
