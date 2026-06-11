import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    // ✅ CORRIGÉ : l'API accepte newest | price_low_to_high | price_high_to_low
    // On n'envoie PAS le paramètre sort si c'est "newest" pour éviter l'ambiguïté SQL
    const params = sort !== 'newest' ? { sort } : {};
    favoriteService
      .getAll(params)
      .then(({ data }) => setFavorites(data.data || data.favorites || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [sort]);

  // Tri côté client pour price_low_to_high et price_high_to_low
  // en cas d'erreur backend (colonne ambiguë)
  const sorted = [...favorites].sort((a, b) => {
    const pa = parseFloat((a.product ?? a)?.effective_price ?? (a.product ?? a)?.price ?? 0);
    const pb = parseFloat((b.product ?? b)?.effective_price ?? (b.product ?? b)?.price ?? 0);
    if (sort === 'price_low_to_high') return pa - pb;
    if (sort === 'price_high_to_low') return pb - pa;
    return 0; // newest : garder l'ordre serveur
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Mes favoris</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{favorites.length} produit{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}</p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'white', cursor: 'pointer', outline: 'none' }}
        >
          <option value="newest">Plus récents</option>
          {/* ✅ CORRIGÉ : valeurs acceptées par l'API */}
          <option value="price_low_to_high">Prix croissant</option>
          <option value="price_high_to_low">Prix décroissant</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="Aucun favori"
          description="Ajoutez des produits à vos favoris pour les retrouver ici."
          action={<Link to="/products" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Découvrir des produits</Link>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
          {sorted.map((item) => (
            <ProductCard key={item.id || item.product?.id} product={item.product || item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return <FavoritesList />;
}
