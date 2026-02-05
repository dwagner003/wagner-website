import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useReadBooks, useNotReadBooks } from '../hooks/useBooks';
import { BookList } from '../components/books/BookList';
import { SectionHeading } from '../components/ui/SectionHeading';

export const BooksPage = () => {
  const { isAuthenticated } = useAuth0();
  const { data: readBooks, isLoading: loadingRead } = useReadBooks();
  const { data: notReadBooks, isLoading: loadingNotRead } = useNotReadBooks();

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <SectionHeading as="h1">reading_list</SectionHeading>

      {isAuthenticated && (
        <div className="mb-6">
          <Link
            to="/books/add"
            className="inline-block px-4 py-2 bg-[var(--color-neon-cyan)] text-[var(--color-bg-primary)] font-mono rounded-md hover:opacity-80 transition-opacity"
          >
            Add Book
          </Link>
        </div>
      )}

      <blockquote className="text-center text-xl italic text-[var(--color-text-muted)] mb-6">
        "Wisdom is not a product of schooling but of the lifelong attempt to acquire it."
        <span className="block text-sm mt-1 not-italic text-[var(--color-text-secondary)]">– Albert Einstein</span>
      </blockquote>

      <p className="text-[var(--color-text-secondary)] mb-8">
        Below is a list of the books I am currently reading along with the ones that are now on my
        bookshelf. With a mix of technical, fiction, and non-fiction there is something for everyone.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-mono text-[var(--color-neon-cyan)] border-b border-[var(--color-border)] pb-2 mb-4">
          Currently Reading
        </h2>
        <BookList books={notReadBooks} isLoading={loadingNotRead} showEdit={isAuthenticated} />
      </section>

      <section>
        <h2 className="text-xl font-mono text-[var(--color-neon-cyan)] border-b border-[var(--color-border)] pb-2 mb-4">
          On The Bookshelf
        </h2>
        <BookList books={readBooks} isLoading={loadingRead} showEdit={isAuthenticated} />
      </section>
    </div>
  );
};
