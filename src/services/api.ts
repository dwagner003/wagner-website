import type { Book, CreateBookDto } from '../types/book';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const bookApi = {
  getReadBooks: async (): Promise<Book[]> => {
    const res = await fetch(`${BASE_URL}/read`);
    if (!res.ok) throw new Error('Failed to fetch read books');
    return res.json();
  },

  getNotReadBooks: async (): Promise<Book[]> => {
    const res = await fetch(`${BASE_URL}/notRead`);
    if (!res.ok) throw new Error('Failed to fetch unread books');
    return res.json();
  },

  getBook: async (id: number, token: string): Promise<Book> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch book');
    return res.json();
  },

  createBook: async (book: CreateBookDto, token: string): Promise<Book> => {
    console.log('Creating book with token:', token.substring(0, 50) + '...');
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Create book failed:', res.status, errorText);
      throw new Error(`Failed to create book: ${res.status} ${errorText}`);
    }
    return res.json();
  },

  updateBook: async (id: number, book: Partial<Book>, token: string): Promise<Book> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error('Failed to update book');
    return res.json();
  },

  deleteBook: async (id: number, token: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete book');
  },
};
