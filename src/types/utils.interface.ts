import type { Note } from "./note.interface";

export interface IColumnWithNotes {
  id: number;
  title: string;
  tag_id: number;
  notes: Note[];
  user_name?: string;
}
