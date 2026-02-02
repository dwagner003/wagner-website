import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useReadBooks, useNotReadBooks } from '../hooks/useBooks';
import { BookList } from '../components/books/BookList';

export const BooksPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { data: readBooks, isLoading: loadingRead } = useReadBooks();
  const { data: notReadBooks, isLoading: loadingNotRead } = useNotReadBooks();

  // Debug - remove later
  console.log('Auth state:', { isAuthenticated, isLoading, user });

  return (
    <div>
      {/* Debug display - remove later */}
      <div className="mb-4 p-2 bg-yellow-100 text-sm">
        Auth: {isAuthenticated ? 'Yes' : 'No'} | Loading: {isLoading ? 'Yes' : 'No'} | User: {user?.email || 'none'}
      </div>

      {isAuthenticated && (
        <div className="mb-6">
          <Link
            to="/books/add"
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Add Book
          </Link>
        </div>
      )}

      <blockquote className="text-center text-xl italic text-gray-600 mb-6">
        "Wisdom is not a product of schooling but of the lifelong attempt to acquire it."
        <span className="block text-sm mt-1 not-italic">– Albert Einstein</span>
      </blockquote>

      <p className="text-gray-700 mb-8">
        Below is a list of the books I am currently reading along with the ones that are now on my
        bookshelf. With a mix of technical, fiction, and non-fiction there is something for everyone.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-primary border-b-2 border-primary pb-2 mb-4 inline-block">
          Currently Reading
        </h2>
        <BookList books={notReadBooks} isLoading={loadingNotRead} showEdit={isAuthenticated} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary border-b-2 border-primary pb-2 mb-4 inline-block">
          On The Bookshelf
        </h2>
        <BookList books={readBooks} isLoading={loadingRead} showEdit={isAuthenticated} />
      </section>
    </div>
  );
};
