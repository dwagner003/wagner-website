import { useParams, useNavigate } from 'react-router-dom';
import { useBook, useUpdateBook, useDeleteBook } from '../hooks/useBooks';
import { BookForm } from '../components/books/BookForm';
import type { CreateBookDto } from '../types/book';

export const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = parseInt(id || '0', 10);

  const { data: book, isLoading, isError } = useBook(bookId);
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const handleSubmit = (data: CreateBookDto) => {
    updateBook.mutate(
      { id: bookId, book: data },
      {
        onSuccess: () => {
          navigate('/books');
        },
      }
    );
  };

  const handleToggleRead = () => {
    if (book) {
      updateBook.mutate({ id: bookId, book: { read: !book.read } });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook.mutate(bookId, {
        onSuccess: () => {
          navigate('/books');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Book not found or error loading.</p>
        <button
          onClick={() => navigate('/books')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Book</h1>

      {(updateBook.isError || deleteBook.isError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          An error occurred. Please try again.
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <button
          onClick={handleToggleRead}
          disabled={updateBook.isPending}
          className={`px-4 py-2 rounded-md transition-colors ${
            book.read
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {book.read ? 'Mark as Not Read' : 'Mark as Read'}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteBook.isPending}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      <BookForm
        defaultValues={{
          title: book.title,
          author: book.author,
          description: book.description,
          read: book.read,
        }}
        onSubmit={handleSubmit}
        isLoading={updateBook.isPending}
        submitLabel="Update Book"
      />
    </div>
  );
};
