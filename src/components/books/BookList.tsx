import type { Book } from '../../types/book';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[] | undefined;
  isLoading: boolean;
  showEdit?: boolean;
}

export const BookList = ({ books, isLoading, showEdit = false }: BookListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No books found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} showEdit={showEdit} />
      ))}
    </div>
  );
};
