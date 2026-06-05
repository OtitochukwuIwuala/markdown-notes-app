import type { Note } from '../types/note';

const welcomeBody = `# Welcome to Markdown Notes

This starter note shows the core workflow:

- Write Markdown in the editor.
- Watch the live preview update after a short pause.
- Add tags, search your notes, and export any note as a \`.md\` file.

\`\`\`ts
interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
\`\`\`

Try **bold**, *italic*, [links](https://marked.js.org/), and GitHub-flavoured Markdown tables.
`;

export function createNote(overrides: Partial<Note> = {}): Note {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: 'Untitled note',
    body: '',
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createWelcomeNote(): Note {
  const now = Date.now();

  return createNote({
    title: 'Welcome to Markdown Notes',
    body: welcomeBody,
    tags: ['welcome', 'markdown'],
    createdAt: now,
    updatedAt: now,
  });
}
