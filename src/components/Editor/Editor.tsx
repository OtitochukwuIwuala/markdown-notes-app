import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { Note } from '../../types/note';
import { MarkdownTextarea } from './MarkdownTextarea';
import { TagsInput } from './TagsInput';
import { TitleInput } from './TitleInput';
import { Toolbar } from './Toolbar';
import styles from './Editor.module.css';

type FormatKind = 'bold' | 'italic';

export interface EditorHandle {
  focusTitle: () => void;
  wrapSelection: (kind: FormatKind) => void;
}

interface EditorProps {
  note: Note;
  saveState: 'idle' | 'saving' | 'saved';
  onBodyChange: (body: string) => void;
  onDelete: () => void;
  onExport: () => void;
  onTagsChange: (tags: string[]) => void;
  onTitleChange: (title: string) => void;
}

function setSelection(
  element: HTMLTextAreaElement,
  start: number,
  end: number,
  onBodyChange: (body: string) => void,
  nextBody: string,
) {
  onBodyChange(nextBody);
  window.requestAnimationFrame(() => {
    element.focus();
    element.setSelectionRange(start, end);
  });
}

export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  { note, saveState, onBodyChange, onDelete, onExport, onTagsChange, onTitleChange },
  ref,
) {
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const replaceSelection = (before: string, after: string, placeholder = '') => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd) || placeholder;
    const nextBody =
      value.slice(0, selectionStart) + before + selectedText + after + value.slice(selectionEnd);
    const nextSelectionStart = selectionStart + before.length;
    const nextSelectionEnd = nextSelectionStart + selectedText.length;

    setSelection(textarea, nextSelectionStart, nextSelectionEnd, onBodyChange, nextBody);
  };

  const insertHeading = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const { selectionStart, value } = textarea;
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const nextBody = `${value.slice(0, lineStart)}## ${value.slice(lineStart)}`;

    setSelection(textarea, selectionStart + 3, selectionStart + 3, onBodyChange, nextBody);
  };

  const insertCodeBlock = () => {
    replaceSelection('```ts\n', '\n```', 'const message = "Hello Markdown";');
  };

  const insertLink = () => {
    replaceSelection('[', '](https://example.com)', 'link text');
  };

  useImperativeHandle(
    ref,
    () => ({
      focusTitle: () => titleRef.current?.focus(),
      wrapSelection: (kind) => {
        if (kind === 'bold') {
          replaceSelection('**', '**', 'bold text');
        }

        if (kind === 'italic') {
          replaceSelection('*', '*', 'italic text');
        }
      },
    }),
    [note.body],
  );

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <TitleInput inputRef={titleRef} value={note.title} onChange={onTitleChange} />
        <div className={styles.editorActions}>
          <span aria-live="polite">{saveState === 'saving' ? 'Saving...' : 'Autosaved'}</span>
          <button type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <TagsInput tags={note.tags} onChange={onTagsChange} />
      <Toolbar
        onBold={() => replaceSelection('**', '**', 'bold text')}
        onCodeBlock={insertCodeBlock}
        onExport={onExport}
        onHeading={insertHeading}
        onItalic={() => replaceSelection('*', '*', 'italic text')}
        onLink={insertLink}
      />
      <MarkdownTextarea textareaRef={textareaRef} value={note.body} onChange={onBodyChange} />
    </div>
  );
});
