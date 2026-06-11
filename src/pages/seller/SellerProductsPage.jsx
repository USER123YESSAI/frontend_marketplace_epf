import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import ProductImage from '../../components/ui/ProductImage';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const load = () => {
    setLoading(true);
    const params = status ? { status } : {};
    productService
      .getMyProducts(params)
      .then(({ data }) => setProducts(data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      toast.success('Produit supprimé');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Mes produits</h1>
        <Link to="/seller/products/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
          + Ajouter
        </Link>
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mb-4 rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">Tous</option>
        <option value="draft">Brouillon</option>
        <option value="published">Publié</option>
        <option value="sold">Vendu</option>
      </select>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState title="Aucun produit" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3">Produit</th>
                <th className="p-3">Prix</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image && <ProductImage src={p.image} alt="" className="h-10 w-10 rounded object-cover" />}
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3">
                    <Link to={`/seller/products/${p.id}/edit`} className="mr-2 text-indigo-600 hover:underline">
                      Modifier
                    </Link>
                    <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function SellerProductsPage() {
  return <SellerProducts />;
}
