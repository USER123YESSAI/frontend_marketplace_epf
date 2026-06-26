import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import ProductImage from '../../components/ui/ProductImage';
import Pagination from '../../components/ui/Pagination';
import { formatPrice, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('published');

  const load = () => {
    setLoading(true);
    productService
      .getAll({ page, status: status || undefined })
      .then(({ data }) => {
        setProducts(data.data || []);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, status]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    try {
      await adminService.updateProductStatus(selectedProductId, selectedStatus);
      toast.success('Statut produit mis à jour');
      setSelectedProductId('');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm('Suppression forcée de ce produit ?')) return;
    try {
      await adminService.forceDeleteProduct(id);
      toast.success('Produit supprimé');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Modération produits</h1>

      {/* Filtres */}
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="sold">Vendu</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      {/* Liste des produits */}
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : products.length === 0 ? (
        <p className="text-slate-500">Aucun produit trouvé.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Produit</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3">Vendeur</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {p.image && <ProductImage src={p.image} alt="" className="h-10 w-10 rounded object-cover" />}
                        <span className="font-medium">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-3">{formatPrice(p.price)}</td>
                    <td className="p-3">{p.seller?.name || '-'}</td>
                    <td className="p-3"><StatusBadge status={p.status} /></td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => { setSelectedProductId(p.id); setSelectedStatus(p.status); }}
                        className="mr-2 text-indigo-600 hover:underline text-xs"
                      >
                        Modifier statut
                      </button>
                      <button
                        type="button"
                        onClick={() => handleForceDelete(p.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Formulaire rapide de modification de statut */}
      {selectedProductId && (
        <div className="mt-6 rounded-xl border bg-white p-6 max-w-lg">
          <h3 className="mb-4 font-semibold">Modifier le statut du produit #{selectedProductId}</h3>
          <form onSubmit={handleStatusUpdate} className="space-y-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="sold">Vendu</option>
              <option value="inactive">Inactif</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                Appliquer
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductId('')}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return <AdminProducts />;
}
