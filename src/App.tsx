import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, type EditorHandle } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotes } from './hooks/useNotes';
import type { MobileView, ThemeMode } from './types/note';
import { exportMarkdown } from './utils/exportMarkdown';
import styles from './App.module.css';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const [showPreview, setShowPreview] = useState(true);
  const [manualSaveFlash, setManualSaveFlash] = useState(false);
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>('themeMode', 'system');
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebarCollapsed',
    false,
  );
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);
  const [supportsSidebarCollapse, setSupportsSidebarCollapse] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(min-width: 981px)').matches,
  );
  const editorRef = useRef<EditorHandle>(null);
  const manualSaveTimeoutRef = useRef<number | null>(null);

  const {
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
  } = useNotes({ searchQuery, activeTag });

  const resolvedTheme = themeMode === 'system' ? systemTheme : themeMode;
  const sidebarIsCollapsed = supportsSidebarCollapse && sidebarCollapsed;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 981px)');
    const handleChange = () => setSupportsSidebarCollapse(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const flashSaved = useCallback(() => {
    setManualSaveFlash(true);

    if (manualSaveTimeoutRef.current) {
      window.clearTimeout(manualSaveTimeoutRef.current);
    }

    manualSaveTimeoutRef.current = window.setTimeout(() => {
      setManualSaveFlash(false);
    }, 1100);
  }, []);

  const handleCreateNote = useCallback(() => {
    createNewNote();
    setMobileView('edit');
    window.setTimeout(() => editorRef.current?.focusTitle(), 0);
  }, [createNewNote]);

  const handleSelectNote = useCallback(
    (id: string) => {
      selectNote(id);
      setMobileView('edit');
    },
    [selectNote],
  );

  const handleDeleteNote = useCallback(
    (id: string) => {
      const note = filteredNotes.find((item) => item.id === id);
      const confirmed = window.confirm(`Delete "${note?.title ?? 'this note'}"?`);

      if (confirmed) {
        deleteNote(id);
      }
    },
    [deleteNote, filteredNotes],
  );

  const handleExport = useCallback(() => {
    if (activeNote) {
      exportMarkdown(activeNote);
    }
  }, [activeNote]);

  const toggleTheme = useCallback(() => {
    setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setThemeMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierPressed = event.ctrlKey || event.metaKey;

      if (!modifierPressed) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'n') {
        event.preventDefault();
        handleCreateNote();
      }

      if (key === 's') {
        event.preventDefault();
        flushSave();
        flashSaved();
      }

      if (key === 'b') {
        event.preventDefault();
        editorRef.current?.wrapSelection('bold');
      }

      if (key === 'i') {
        event.preventDefault();
        editorRef.current?.wrapSelection('italic');
      }

      if (event.shiftKey && key === 'p') {
        event.preventDefault();
        setShowPreview((currentValue) => !currentValue);
        setMobileView((currentView) => (currentView === 'preview' ? 'edit' : 'preview'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashSaved, flushSave, handleCreateNote]);

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <div>
          <h1>Markdown Notes</h1>
        </div>

        <div className={styles.topbarActions}>
          <span className={styles.saveStatus} aria-live="polite">
            {manualSaveFlash ? 'Saved manually' : saveState === 'saving' ? 'Saving...' : 'Saved'}
          </span>
          {supportsSidebarCollapse ? (
            <button
              className={styles.sidebarToggle}
              type="button"
              onClick={() => setSidebarCollapsed((currentValue) => !currentValue)}
            >
              {sidebarIsCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            </button>
          ) : null}
          <button className={styles.iconButton} type="button" onClick={toggleTheme}>
            {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <nav className={styles.mobileTabs} aria-label="Mobile view">
        <button
          className={mobileView === 'list' ? styles.activeTab : undefined}
          type="button"
          onClick={() => setMobileView('list')}
        >
          List
        </button>
        <button
          className={mobileView === 'edit' ? styles.activeTab : undefined}
          type="button"
          onClick={() => setMobileView('edit')}
        >
          Edit
        </button>
        {showPreview ? (
          <button
            className={mobileView === 'preview' ? styles.activeTab : undefined}
            type="button"
            onClick={() => setMobileView('preview')}
          >
            Preview
          </button>
        ) : null}
      </nav>

      <main
        className={`${styles.workspace} ${!showPreview ? styles.workspaceWithoutPreview : ''} ${
          sidebarIsCollapsed ? styles.workspaceSidebarCollapsed : ''
        }`}
      >
        <section
          className={`${styles.pane} ${styles.sidebarPane} ${
            sidebarIsCollapsed ? styles.sidebarCollapsedPane : ''
          } ${
            mobileView !== 'list' ? styles.mobileHidden : ''
          }`}
          aria-label="Notes"
        >
          {sidebarIsCollapsed ? (
            <button
              className={styles.collapsedRail}
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Expand sidebar"
            >
              <span>Notes</span>
            </button>
          ) : (
            <Sidebar
              activeNoteId={activeNoteId}
              activeTag={activeTag}
              allTags={allTags}
              notes={filteredNotes}
              searchQuery={searchQuery}
              onCreateNote={handleCreateNote}
              onDeleteNote={handleDeleteNote}
              onSearchChange={setSearchQuery}
              onSelectNote={handleSelectNote}
              onTagChange={setActiveTag}
            />
          )}
        </section>

        <section
          className={`${styles.pane} ${styles.editorPane} ${
            mobileView !== 'edit' ? styles.mobileHidden : ''
          }`}
          aria-label="Editor"
        >
          {activeNote ? (
            <Editor
              ref={editorRef}
              note={activeNote}
              saveState={saveState}
              onBodyChange={(body) => updateNote(activeNote.id, { body })}
              onDelete={() => handleDeleteNote(activeNote.id)}
              onExport={handleExport}
              onTagsChange={(tags) => updateNote(activeNote.id, { tags })}
              onTitleChange={(title) => updateNote(activeNote.id, { title })}
            />
          ) : null}
        </section>

        {showPreview ? (
          <section
            className={`${styles.pane} ${styles.previewPane} ${
              mobileView !== 'preview' ? styles.mobileHidden : ''
            }`}
            aria-label="Preview"
          >
            <Preview body={activeNote?.body ?? ''} title={activeNote?.title ?? 'Preview'} />
          </section>
        ) : null}
      </main>
    </div>
  );
}
