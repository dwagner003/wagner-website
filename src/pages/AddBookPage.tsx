import { useNavigate } from 'react-router-dom';
import { useCreateBook } from '../hooks/useBooks';
import { BookForm } from '../components/books/BookForm';
import type { CreateBookDto } from '../types/book';

export const AddBookPage = () => {
  const navigate = useNavigate();
  const createBook = useCreateBook();

  const handleSubmit = (data: CreateBookDto) => {
    createBook.mutate(data, {
      onSuccess: () => {
        navigate('/books');
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h1>

      {createBook.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to create book. Please try again.
        </div>
      )}

      <BookForm
        onSubmit={handleSubmit}
        isLoading={createBook.isPending}
        submitLabel="Add Book"
      />
    </div>
  );
};
