import { Link } from 'react-router-dom';
import type { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  showEdit?: boolean;
}

export const BookCard = ({ book, showEdit = false }: BookCardProps) => {
  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-neon-cyan)]/20 hover:border-[var(--color-neon-cyan)] hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] backdrop-blur-sm rounded-lg p-6 transition-all duration-300">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">{book.title}</h4>
        <p className="text-sm text-[var(--color-text-secondary)]">By {book.author}</p>
      </div>
      <div className="mb-4">
        <p className="text-[var(--color-text-muted)] text-sm">{book.description}</p>
      </div>
      {showEdit && (
        <div>
          <Link
            to={`/books/${book.id}`}
            className="inline-block px-3 py-1 bg-[var(--color-neon-cyan)]/20 text-[var(--color-neon-cyan)] text-sm rounded hover:bg-[var(--color-neon-cyan)]/30 transition-colors border border-[var(--color-neon-cyan)]/50"
          >
            Edit
          </Link>
        </div>
      )}
    </div>
  );
};
