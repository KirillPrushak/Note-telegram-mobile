export interface Tag {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTagDto {
  name: string;
}

export interface UpdateTagDto {
  name?: string;
}
