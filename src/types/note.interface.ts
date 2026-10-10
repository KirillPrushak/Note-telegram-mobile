export interface Note {
  id: number;
  message?: string;
  tag?: string;
  tag_id?: number;
  username?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNoteDto {
  // user_id?: number;
  username?: string;
  message: string;
  tag_id: number;
  tag?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateNoteDto {
  // user_id?: number;
  message: string;
  tag_id: number;
  // username?: string;
  // tag?: string;
  // created_at?: string;
  // updated_at?: string;
}

// A note parsed locally from a Telegram export file (JSON/HTML/ZIP) —
// distinct from the API's `Note`: it has a client-generated string id and
// hasn't been created on the server yet (see utils/parser.ts).
export interface ImportedNote {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  connections: never[];
  photo?: string;
  isFavorite: boolean;
}
