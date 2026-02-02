import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { bookApi } from '../services/api';
import type { Book, CreateBookDto } from '../types/book';

const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const useReadBooks = () => {
  return useQuery({
    queryKey: ['books', 'read'],
    queryFn: bookApi.getReadBooks,
  });
};

export const useNotReadBooks = () => {
  return useQuery({
    queryKey: ['books', 'notRead'],
    queryFn: bookApi.getNotReadBooks,
  });
};

export const useBook = (id: number) => {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery({
    queryKey: ['books', id],
    queryFn: async () => {
      const token = await getAccessTokenSilently({ authorizationParams: { audience } });
      return bookApi.getBook(id, token);
    },
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: CreateBookDto) => {
      const token = await getAccessTokenSilently({ authorizationParams: { audience } });
      return bookApi.createBook(book, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, book }: { id: number; book: Partial<Book> }) => {
      const token = await getAccessTokenSilently({ authorizationParams: { audience } });
      return bookApi.updateBook(id, book, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDeleteBook = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = await getAccessTokenSilently({ authorizationParams: { audience } });
      return bookApi.deleteBook(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
