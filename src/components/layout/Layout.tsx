import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-100 rounded-lg shadow-lg p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
