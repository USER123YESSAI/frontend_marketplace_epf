import { useEffect, useState } from 'react';
import { sellerService } from '../../services/sellerService';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import InlineChat from '../../components/messages/InlineChat';
import { formatPrice, formatDate, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChats, setOpenChats] = useState({}); // { orderId: true/false }

  useEffect(() => {
    sellerService
      .getOrders()
      .then(({ data }) => setOrders(data.data || data.orders || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      toast.success('Statut mis à jour');
      const { data } = await sellerService.getOrders();
      setOrders(data.data || data.orders || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleChat = (orderId) => {
    setOpenChats(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Commandes reçues</h1>

      {orders.length === 0 ? (
        <p className="text-slate-500">Aucune commande pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                  {order.buyer && (
                    <p className="text-xs text-slate-400 mt-1">
                      Acheteur : {order.buyer.name}
                    </p>
                  )}
                </div>
                <StatusBadge status={order.status} />
                <p className="font-bold text-indigo-600">{formatPrice(order.total_amount)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['confirmed', 'shipped', 'delivered'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(order.id, s)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    {s}
                  </button>
                ))}

                {/* Bouton contacter l'acheteur */}
                {order.buyer && (
                  <button
                    type="button"
                    onClick={() => toggleChat(order.id)}
                    style={{
                      padding: '4px 12px', borderRadius: 8,
                      border: '1.5px solid #6366f1',
                      background: openChats[order.id] ? '#eef2ff' : 'white',
                      color: '#6366f1', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
                    onMouseLeave={e => { if (!openChats[order.id]) e.currentTarget.style.background = 'white'; }}
                  >
                    💬 Contacter {order.buyer.name}
                  </button>
                )}
              </div>

              {/* Chat inline avec l'acheteur */}
              {openChats[order.id] && order.buyer && (
                <div style={{ marginTop: 12 }}>
                  <InlineChat
                    recipientId={order.buyer.id}
                    recipientName={order.buyer.name}
                    title={`💬 Discussion avec ${order.buyer.name}`}
                    maxHeight={280}
                    accentColor="#6366f1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return <SellerOrders />;
}
