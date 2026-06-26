import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { formatPrice, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

function CheckoutForm() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const items = cart?.items || [];
  const total = cart?.total ?? items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setSubmitting(true);
    try {
      // Le backend Laravel génère les order_items depuis le panier de l'utilisateur connecté.
      // On n'envoie donc pas de champ `items`.
      const orderPayload = {
        ...data,
      };

      const { data: res } = await orderService.create(orderPayload);
      await fetchCart();
      toast.success(res.message || 'Commande créée');
      navigate(`/buyer/orders/${res.order.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Finaliser la commande</h1>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">{items.length} article(s)</p>
        <p className="text-xl font-bold text-indigo-600">{formatPrice(total)}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Adresse de livraison</label>
          <input
            {...register('shipping_address', { required: 'Adresse requise' })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
          {errors.shipping_address && <p className="mt-1 text-sm text-red-600">{errors.shipping_address.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Ville</label>
            <input
              {...register('shipping_city', { required: 'Ville requise' })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
            {errors.shipping_city && <p className="mt-1 text-sm text-red-600">{errors.shipping_city.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Code postal</label>
            <input
              {...register('shipping_postal_code', { required: 'Code postal requis' })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
            {errors.shipping_postal_code && <p className="mt-1 text-sm text-red-600">{errors.shipping_postal_code.message}</p>}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <input
            {...register('shipping_phone', { required: 'Téléphone requis' })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
          {errors.shipping_phone && <p className="mt-1 text-sm text-red-600">{errors.shipping_phone.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Code promo (optionnel)</label>
          <input
            {...register('coupon_code')}
            placeholder="Ex: DEMO10"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Notes (optionnel)</label>
          <textarea
            rows={2}
            {...register('notes')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute roles={['buyer', 'admin']}>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
