import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const statusColor = { processing: '#1a73e8', out_for_delivery: '#f57c00', delivered: '#2e7d32' };
const statusLabel = { processing: 'Ready to Pick Up', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' };

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5' },
  nav: { background: '#1a1a2e', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#e94560', fontWeight: 'bold', fontSize: '1.1rem' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '24px 16px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: (a) => ({ padding: '8px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: a ? '#e94560' : '#fff', color: a ? '#fff' : '#333', fontWeight: a ? 'bold' : 'normal', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }),
  card: { background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  badge: (st) => ({ padding: '3px 10px', borderRadius: '12px', background: statusColor[st] || '#888', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }),
  btn: (c) => ({ padding: '8px 16px', background: c, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginRight: '8px' }),
  item: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.88rem', borderBottom: '1px solid #f5f5f5' },
  notify: { background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.88rem', color: '#2e7d32' }
};

export default function DeliveryDashboard() {
  const [tab, setTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const dpUser = JSON.parse(localStorage.getItem('dpUser') || 'null');
  const token = localStorage.getItem('dpToken');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/delivery/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [activeRes, histRes] = await Promise.all([
        axios.get(`${BASE}/delivery/orders`, { headers }),
        axios.get(`${BASE}/delivery/history`, { headers })
      ]);
      const prev = orders.length;
      setOrders(activeRes.data);
      setHistory(histRes.data);
      if (prev > 0 && activeRes.data.length > prev) {
        setNotification('🔔 New order assigned to you!');
        setTimeout(() => setNotification(''), 5000);
      }
    } catch { }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BASE}/delivery/orders/${id}`, { status }, { headers });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const logout = () => {
    localStorage.removeItem('dpToken');
    localStorage.removeItem('dpUser');
    navigate('/delivery/login');
  };

  const renderOrder = (order, showActions = true) => (
    <div key={order._id} style={s.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: 'bold' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
          <div style={{ fontSize: '0.85rem', color: '#555' }}>👤 {order.user?.name} ({order.user?.email})</div>
          <div style={{ fontSize: '0.85rem', color: '#555' }}>📍 {order.address}</div>
          <div style={{ fontSize: '0.85rem', color: '#555' }}>
            💳 {order.paymentMethod === 'cod' ? `COD — Collect ₹${order.total.toLocaleString('en-IN')}` : 'Online (Paid)'}
          </div>
        </div>
        <span style={s.badge(order.status)}>{statusLabel[order.status] || order.status}</span>
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
      {showActions && (
        <div>
          {order.status === 'processing' && (
            <button style={s.btn('#f57c00')} onClick={() => updateStatus(order._id, 'out_for_delivery')}>
              🚚 Out for Delivery
            </button>
          )}
          {order.status === 'out_for_delivery' && (
            <button style={s.btn('#2e7d32')} onClick={() => updateStatus(order._id, 'delivered')}>
              ✓ Mark Delivered
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.brand}>🚚 Delivery Partner</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Hi, {dpUser?.name}</span>
          <button onClick={logout} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={s.container}>
        {notification && <div style={s.notify}>{notification}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>My Deliveries</h2>
          <button onClick={fetchOrders} style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
            🔄 Refresh
          </button>
        </div>

        <div style={s.tabs}>
          <button style={s.tab(tab === 'active')} onClick={() => setTab('active')}>
            Active Orders ({orders.length})
          </button>
          <button style={s.tab(tab === 'history')} onClick={() => setTab('history')}>
            Delivery History ({history.length})
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            {tab === 'active' && (
              orders.length === 0
                ? <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                    <div style={{ fontSize: '3rem' }}>📦</div>
                    <p>No active orders assigned to you</p>
                  </div>
                : orders.map(o => renderOrder(o, true))
            )}
            {tab === 'history' && (
              history.length === 0
                ? <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                    <div style={{ fontSize: '3rem' }}>📋</div>
                    <p>No delivery history yet</p>
                  </div>
                : history.map(o => renderOrder(o, false))
            )}
          </>
        )}
      </div>
    </div>
  );
}
