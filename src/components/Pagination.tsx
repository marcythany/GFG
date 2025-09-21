'use client';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) {
    return null;
  }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      role="navigation"
      aria-label="Pagination navigation"
      aria-describedby="pagination-info"
    >
      <div id="pagination-info" className="sr-only">
        Page {currentPage} of {totalPages}, showing {itemsPerPage} items per
        page
      </div>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
            currentPage === page
              ? 'bg-accent text-primary font-bold shadow-md hover:shadow-lg'
              : 'bg-primary text-accent hover:bg-secondary border border-secondary hover:border-accent'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}
          aria-label={`Go to page ${page}${currentPage === page ? ' (current page)' : ''}`}
          role="tab"
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
