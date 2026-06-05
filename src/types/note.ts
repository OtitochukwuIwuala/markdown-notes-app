export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type MobileView = 'list' | 'edit' | 'preview';

export type ThemeMode = 'system' | 'light' | 'dark';
