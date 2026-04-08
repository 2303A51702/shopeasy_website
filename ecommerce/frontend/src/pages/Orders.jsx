import React, { useEffect, useState } from 'react';
import api from '../api';

const statusColor = { pending: '#f0a500', processing: '#1a73e8', out_for_delivery: '#f57c00', delivered: '#2e7d32' };

const s = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
  card: { background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  badge: { padding: '3px 10px', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.container}><p>Loading orders...</p></div>;

  return (
    <div style={s.container}>
      <h2 style={{ marginBottom: '20px' }}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={{ color: '#888' }}>No orders yet.</p>
      ) : orders.map(order => (
        <div key={order._id} style={s.card}>
          <div style={s.header}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Order ID: {order._id}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Address: {order.address}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Payment: <strong>{order.paymentMethod === 'online' ? '💳 Online' : '🚚 Cash on Delivery'}</strong>
                {' · '}
                <span style={{ color: order.paymentStatus === 'paid' ? 'green' : '#f0a500' }}>
                  {order.paymentStatus === 'paid' ? '✓ Paid' : order.status === 'delivered' ? '✓ Paid' : 'Pay on delivery'}
                </span>
              </div>
            </div>
            <span style={{ ...s.badge, background: statusColor[order.status] || '#888' }}>
              {order.status?.replace('_', ' ')}
            </span>
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={s.item}>
              <span>{item.name} x{item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '8px' }}>
            Total: ₹{order.total.toLocaleString('en-IN')}
          </div>
        </div>
      ))}
    </div>
  );
}
