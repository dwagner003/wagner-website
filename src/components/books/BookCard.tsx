import { Link } from 'react-router-dom';
import type { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  showEdit?: boolean;
}

export const BookCard = ({ book, showEdit = false }: BookCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-primary-light px-4 py-3">
        <h4 className="text-lg font-semibold text-white">{book.title}</h4>
        <p className="text-sm text-gray-200">By {book.author}</p>
      </div>
      <div className="p-4">
        <p className="text-gray-700 text-sm">{book.description}</p>
      </div>
      {showEdit && (
        <div className="px-4 pb-4">
          <Link
            to={`/books/${book.id}`}
            className="inline-block px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
          >
            Edit
          </Link>
        </div>
      )}
    </div>
  );
};
