export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page } = pagination;

  const pages = [];
  const start = Math.max(1, current_page - 2);
  const end = Math.min(last_page, current_page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={current_page <= 1}
        onClick={() => onPageChange(current_page - 1)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
      >
        Précédent
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            page === current_page
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={current_page >= last_page}
        onClick={() => onPageChange(current_page + 1)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
      >
        Suivant
      </button>
    </nav>
  );
}
