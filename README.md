# Markdown Notes

Live demo: _[https://markdown-notes-app-26.vercel.app](https://markdown-notes-app-26.vercel.app)_

![Markdown Notes screenshot](./docs/screenshot.png)

A responsive Markdown note-taking portfolio project built with React, TypeScript, Vite, CSS Modules, marked, DOMPurify, and highlight.js.

## Features

- Split-pane note list, Markdown editor, and live preview.
- 300ms debounced Markdown preview with sanitised HTML rendering.
- 500ms debounced localStorage autosave and last active note restore.
- Create, rename, delete, search, tag, and filter notes.
- Export the active note as a `.md` file.
- Dark mode that respects `prefers-color-scheme` on first load, with a toggle override.
- Keyboard shortcuts: `Ctrl+N`, `Ctrl+S`, `Ctrl+B`, `Ctrl+I`, and `Ctrl+Shift+P`.
- Responsive tabbed view under 768px.

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Architecture

The planning diagram is included at [`docs/architecture.svg`](./docs/architecture.svg).
