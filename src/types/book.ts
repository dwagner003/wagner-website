export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  description: string;
  read?: boolean;
}
