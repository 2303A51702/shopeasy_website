import React, { useEffect, useState } from 'react';
import api from '../api';

const statusColor = { processing: '#1a73e8', shipped: '#7b1fa2', delivered: '#2e7d32' };

const s = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '24px 16px' },
  card: { background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  badge: (status) => ({ padding: '4px 12px', borderRadius: '12px', background: statusColor[status] || '#888', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }),
  item: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.88rem' },
  btn: (color) => ({ padding: '7px 16px', background: color, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginRight: '8px' })
};

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/delivery/orders')
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/delivery/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div style={s.container}><p>Loading orders...</p></div>;

  return (
    <div style={s.container}>
      <h2 style={{ marginBottom: '6px' }}>🚚 Delivery Dashboard</h2>
      <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>Orders assigned for delivery</p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          <div style={{ fontSize: '3rem' }}>📦</div>
          <p>No orders pending for delivery</p>
        </div>
      ) : orders.map(order => (
        <div key={order._id} style={s.card}>
          <div style={s.header}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>Customer: {order.user?.name} ({order.user?.email})</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>📍 {order.address}</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>🗓️ {new Date(order.createdAt).toLocaleDateString()}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Payment: <strong>{order.paymentMethod === 'online' ? '💳 Online (Paid)' : '🚚 COD (Collect ₹' + order.total.toLocaleString('en-IN') + ')'}</strong>
              </div>
            </div>
            <span style={s.badge(order.status)}>{order.status}</span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={s.item}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '6px' }}>
              Total: ₹{order.total.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            {order.status === 'processing' && (
              <button style={s.btn('#7b1fa2')} onClick={() => updateStatus(order._id, 'shipped')}>
                Mark as Shipped
              </button>
            )}
            {order.status === 'shipped' && (
              <button style={s.btn('#2e7d32')} onClick={() => updateStatus(order._id, 'delivered')}>
                ✓ Mark as Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
