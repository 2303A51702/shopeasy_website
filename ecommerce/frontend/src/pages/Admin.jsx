import React, { useEffect, useState } from 'react';
import api from '../api';

const s = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: (active) => ({ padding: '8px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: active ? '#e94560' : '#ddd', color: active ? '#fff' : '#333', fontWeight: active ? 'bold' : 'normal' }),
  form: { background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  input: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem' },
  btn: { padding: '8px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  delBtn: { padding: '4px 10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '10px', textAlign: 'left', fontSize: '0.9rem' },
  td: { padding: '10px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }
};

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', image: null };

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const fetchProducts = () => api.get('/admin/products').then(r => setProducts(r.data)).catch(err => alert('Products fetch failed: ' + (err.response?.data?.message || err.message)));
  const fetchOrders = () => api.get('/admin/orders').then(r => setOrders(r.data)).catch(err => alert('Orders fetch failed: ' + (err.response?.data?.message || err.message)));
  const fetchDeliveryPartners = () => api.get('/admin/delivery-partners').then(r => setDeliveryPartners(r.data)).catch(() => {});

  useEffect(() => { fetchProducts(); fetchOrders(); fetchDeliveryPartners(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') data.append(k, v); });
    try {
      if (editId) {
        await api.put(`/admin/products/${editId}`, data);
      } else {
        await api.post('/admin/products', data);
      }
      setForm(emptyForm);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = p => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, image: null });
    setEditId(p._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  const updateOrderStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}`, { status });
    fetchOrders();
  };

  const assignPartner = async (orderId, partnerId) => {
    if (!partnerId) return;
    try {
      await api.put(`/admin/orders/${orderId}/assign`, { partnerId });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning partner');
    }
  };
  return (
    <div style={s.container}>
      <h2 style={{ marginBottom: '16px' }}>Admin Panel</h2>
      <div style={s.tabs}>
        <button style={s.tab(tab === 'products')} onClick={() => setTab('products')}>Products</button>
        <button style={s.tab(tab === 'orders')} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <>
          <div style={s.form}>
            <h3 style={{ marginBottom: '14px' }}>{editId ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={s.row}>
                <input style={s.input} placeholder="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input style={s.input} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <textarea style={{ ...s.input, height: '70px', resize: 'vertical' }} placeholder="Description" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={s.row}>
                <input style={s.input} placeholder="Price (₹)" type="number" min="0" step="1" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <input style={s.input} placeholder="Stock" type="number" min="0" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={s.btn} type="submit">{editId ? 'Update' : 'Add Product'}</button>
                {editId && <button type="button" style={{ ...s.btn, background: '#888' }} onClick={() => { setForm(emptyForm); setEditId(null); }}>Cancel</button>}
              </div>
            </form>
          </div>

          <table style={s.table}>
            <thead>
              <tr>
                {['Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.category}</td>
                  <td style={s.td}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td style={s.td}>{p.stock}</td>
                  <td style={s.td}>
                    <button style={{ ...s.btn, fontSize: '0.8rem', padding: '4px 10px', marginRight: '6px' }} onClick={() => handleEdit(p)}>Edit</button>
                    <button style={s.delBtn} onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'orders' && (
        <table style={s.table}>
          <thead>
            <tr>
              {['Order ID', 'Customer', 'Total', 'Address', 'Payment', 'Assign Partner', 'Status', 'Update'].map(h => <th key={h} style={s.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="8" style={{ ...s.td, textAlign: 'center', color: '#888', padding: '24px' }}>No orders found</td></tr>
            ) : orders.map(o => (
              <tr key={o._id}>
                <td style={s.td}>{o._id.slice(-6)}</td>
                <td style={s.td}>{o.user?.name}<br /><small>{o.user?.email}</small></td>
                <td style={s.td}>₹{o.total.toLocaleString('en-IN')}</td>
                <td style={s.td}>{o.address}</td>
                <td style={s.td}>
                  {o.paymentMethod === 'online' ? '💳 Online' : '🚚 COD'}
                  <br />
                  <small style={{ color: (o.paymentStatus === 'paid' || o.status === 'delivered') ? 'green' : '#f0a500' }}>
                    {(o.paymentStatus === 'paid' || o.status === 'delivered') ? '✓ Paid' : 'Unpaid'}
                  </small>
                </td>
                <td style={s.td}>
                  {o.assignedTo
                    ? <span style={{ color: '#1a73e8', fontSize: '0.85rem' }}>🚚 {o.assignedTo.name || o.assignedTo}</span>
                    : <select defaultValue="" onChange={e => assignPartner(o._id, e.target.value)} style={{ padding: '4px', borderRadius: '4px', fontSize: '0.82rem' }}>
                        <option value="" disabled>Assign partner</option>
                        {deliveryPartners.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                  }
                </td>
                <td style={s.td}>
                  <span style={{ padding: '3px 10px', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', background: { pending: '#f0a500', processing: '#1a73e8', out_for_delivery: '#f57c00', delivered: '#2e7d32' }[o.status] || '#888' }}>
                    {o.status?.replace('_', ' ')}
                  </span>
                </td>
                <td style={s.td}>
                  <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} style={{ padding: '4px', borderRadius: '4px' }}>
                    {['pending', 'processing', 'out_for_delivery', 'delivered'].map(st => <option key={st} value={st}>{st.replace('_', ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
