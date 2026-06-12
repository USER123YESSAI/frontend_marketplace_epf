export default function ProductFilters({ filters, categories, onChange }) {
  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Recherche</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Titre, description..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Catégorie</label>
        <select
          value={filters.category_id}
          onChange={(e) => onChange({ category_id: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Toutes</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Prix min</label>
        <input
          type="number"
          min="0"
          value={filters.min_price}
          onChange={(e) => onChange({ min_price: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Prix max</label>
        <input
          type="number"
          min="0"
          value={filters.max_price}
          onChange={(e) => onChange({ max_price: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Tri</label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="newest">Plus récents</option>
          <option value="popular">Populaires</option>
          <option value="cheapest">Moins chers</option>
          <option value="most_rated">Mieux notés</option>
        </select>
      </div>
    </div>
  );
}
