import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Note } from '../types/note';
import { createNote, createWelcomeNote } from '../utils/createNote';
import { useDebounce } from './useDebounce';

const NOTES_STORAGE_KEY = 'notes';
const ACTIVE_NOTE_STORAGE_KEY = 'lastActiveNoteId';

type SaveState = 'idle' | 'saving' | 'saved';

interface UseNotesOptions {
  searchQuery: string;
  activeTag: string | null;
}

function readNotesFromStorage(): Note[] {
  try {
    const rawNotes = window.localStorage.getItem(NOTES_STORAGE_KEY);
    const parsedNotes = rawNotes ? (JSON.parse(rawNotes) as Note[]) : [];

    if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
      return parsedNotes;
    }
  } catch {
    // Corrupt persisted data should not keep the app from booting.
  }

  return [createWelcomeNote()];
}

function getInitialActiveNoteId(notes: Note[]): string {
  try {
    const storedActiveNoteId = window.localStorage.getItem(ACTIVE_NOTE_STORAGE_KEY);
    if (storedActiveNoteId && notes.some((note) => note.id === storedActiveNoteId)) {
      return storedActiveNoteId;
    }
  } catch {
    // Fall back to the first note below.
  }

  return notes[0]?.id ?? createWelcomeNote().id;
}

export function useNotes({ searchQuery, activeTag }: UseNotesOptions) {
  const initialNotesRef = useRef<Note[] | null>(null);

  if (!initialNotesRef.current) {
    initialNotesRef.current = readNotesFromStorage();
  }

  const [notes, setNotes] = useState<Note[]>(initialNotesRef.current);
  const [activeNoteId, setActiveNoteId] = useState<string>(() =>
    getInitialActiveNoteId(initialNotesRef.current ?? []),
  );
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const debouncedNotes = useDebounce(notes, 500);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setSaveState('saving');
  }, [notes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(debouncedNotes));
      setSaveState('saved');
    } catch {
      setSaveState('idle');
    }
  }, [debouncedNotes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ACTIVE_NOTE_STORAGE_KEY, activeNoteId);
    } catch {
      // Non-critical preference persistence.
    }
  }, [activeNoteId]);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) ?? notes[0] ?? null,
    [activeNoteId, notes],
  );

  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap((note) => note.tags))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return notes
      .filter((note) => {
        const matchesSearch =
          !normalizedSearch ||
          note.title.toLowerCase().includes(normalizedSearch) ||
          note.body.toLowerCase().includes(normalizedSearch);
        const matchesTag = !activeTag || note.tags.includes(activeTag);

        return matchesSearch && matchesTag;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [activeTag, notes, searchQuery]);

  const createNewNote = useCallback(() => {
    const nextNote = createNote({
      title: 'Untitled note',
      body: '# Untitled note\n\nStart writing...',
    });

    setNotes((previousNotes) => [nextNote, ...previousNotes]);
    setActiveNoteId(nextNote.id);

    return nextNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id'>>) => {
    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: Date.now(),
            }
          : note,
      ),
    );
  }, []);

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((previousNotes) => {
        const remainingNotes = previousNotes.filter((note) => note.id !== id);
        const nextNotes = remainingNotes.length > 0 ? remainingNotes : [createNote()];

        if (activeNoteId === id) {
          setActiveNoteId(nextNotes[0].id);
        }

        return nextNotes;
      });
    },
    [activeNoteId],
  );

  const selectNote = useCallback((id: string) => {
    setActiveNoteId(id);
  }, []);

  const flushSave = useCallback(() => {
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      window.localStorage.setItem(ACTIVE_NOTE_STORAGE_KEY, activeNoteId);
      setSaveState('saved');
    } catch {
      setSaveState('idle');
    }
  }, [activeNoteId, notes]);

  return {
    notes,
    activeNote,
    activeNoteId,
    allTags,
    filteredNotes,
    saveState,
    createNewNote,
    updateNote,
    deleteNote,
    selectNote,
    flushSave,
  };
}
