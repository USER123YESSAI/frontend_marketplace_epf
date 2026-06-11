import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import { formatPrice, formatDate, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

// ✅ CORRIGÉ : valeurs exactes acceptées par l'API Laravel
// pending | confirmed | shipped | delivered | cancelled
// "processing" n'existe PAS dans l'API → erreur "The selected status is invalid"
const STATUS_OPTIONS = [
  { value: '',          label: 'Tous les statuts' },
  { value: 'pending',   label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped',   label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (status) params.status = status;
    orderService
      .getMyOrders(params)
      .then(({ data }) => {
        setOrders(data.data || data.orders || []);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page, status]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Mes commandes</h1>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'white', cursor: 'pointer', outline: 'none' }}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Aucune commande"
          description={status ? `Aucune commande avec le statut "${STATUS_OPTIONS.find(o => o.value === status)?.label}".` : 'Vos commandes apparaîtront ici.'}
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/buyer/orders/${order.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white', borderRadius: 14, border: '1.5px solid var(--border)',
                  padding: '16px 20px', transition: 'all .15s', boxShadow: 'var(--shadow-sm)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                        {order.order_number ?? `#${order.id}`}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{formatDate(order.created_at)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <StatusBadge status={order.status} />
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#6366f1' }}>
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </div>
                  {order.items?.length > 0 && (
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      {order.items[0]?.product?.title ? ` · ${order.items[0].product.title}${order.items.length > 1 ? '…' : ''}` : ''}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <OrdersList />;
}
