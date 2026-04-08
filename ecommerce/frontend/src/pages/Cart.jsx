import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const s = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
  item: { background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  img: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', background: '#eee', flexShrink: 0 },
  info: { flex: 1 },
  qty: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' },
  qtyBtn: { width: '28px', height: '28px', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem' },
  removeBtn: { color: '#e94560', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' },
  total: { textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', margin: '16px 0' },
  section: { background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem', color: '#444' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', marginBottom: '12px' },
  radioRow: { display: 'flex', gap: '16px', marginBottom: '12px' },
  radioBtn: (active) => ({ flex: 1, padding: '12px', border: `2px solid ${active ? '#e94560' : '#ddd'}`, borderRadius: '6px', cursor: 'pointer', background: active ? '#fff5f7' : '#fff', textAlign: 'center', fontWeight: active ? 'bold' : 'normal', color: active ? '#e94560' : '#333' }),
  checkoutBtn: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  cardRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch { setCart([]); }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, quantity) => {
    await api.put('/cart/update', { productId, quantity });
    fetchCart();
  };

  const remove = async (productId) => {
    await api.delete(`/cart/remove/${productId}`);
    fetchCart();
  };

  const validateCard = () => {
    if (!card.number || card.number.replace(/\s/g, '').length < 16)
      return 'Enter a valid 16-digit card number';
    if (!card.name.trim()) return 'Enter cardholder name';
    if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry))
      return 'Enter expiry in MM/YY format';
    if (!card.cvv || card.cvv.length < 3) return 'Enter a valid CVV';
    return null;
  };

  const placeOrder = async () => {
    if (!address.trim()) return alert('Please enter a delivery address');
    if (paymentMethod === 'online') {
      const err = validateCard();
      if (err) return alert(err);
    }
    try {
      await api.post('/orders', { address, paymentMethod });
      alert(paymentMethod === 'online' ? 'Payment successful! Order placed.' : 'Order placed! Pay on delivery.');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const total = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  if (loading) return <div style={s.container}><p>Loading cart...</p></div>;

  return (
    <div style={s.container}>
      <h2 style={{ marginBottom: '20px' }}>Your Cart</h2>
      {cart.length === 0 ? (
        <p style={{ color: '#888' }}>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.product?._id} style={s.item}>
              {item.product?.image
                ? <img src={item.product.image} alt={item.product.name} style={s.img} />
                : <div style={s.img} />
              }
              <div style={s.info}>
                <div style={{ fontWeight: 'bold' }}>{item.product?.name}</div>
                <div style={{ color: '#e94560' }}>₹{Number(item.product?.price).toLocaleString('en-IN')}</div>
                <div style={s.qty}>
                  <button style={s.qtyBtn} onClick={() => updateQty(item.product._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button style={s.qtyBtn} onClick={() => updateQty(item.product._id, item.quantity + 1)}>+</button>
                  <button style={s.removeBtn} onClick={() => remove(item.product._id)}>Remove</button>
                </div>
              </div>
              <div style={{ fontWeight: 'bold' }}>₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</div>
            </div>
          ))}

          <div style={s.total}>Total: ₹{total.toLocaleString('en-IN')}</div>

          {/* Delivery Address */}
          <div style={s.section}>
            <h3 style={{ marginBottom: '14px' }}>Delivery Address</h3>
            <label style={s.label}>Full Address</label>
            <textarea
              style={{ ...s.input, height: '80px', resize: 'vertical' }}
              placeholder="House no, Street, City, State, PIN code"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div style={s.section}>
            <h3 style={{ marginBottom: '14px' }}>Payment Method</h3>
            <div style={s.radioRow}>
              <div style={s.radioBtn(paymentMethod === 'cod')} onClick={() => setPaymentMethod('cod')}>
                🚚 Cash on Delivery
              </div>
              <div style={s.radioBtn(paymentMethod === 'online')} onClick={() => setPaymentMethod('online')}>
                💳 Online Payment
              </div>
            </div>

            {paymentMethod === 'online' && (
              <div style={{ marginTop: '12px' }}>
                <label style={s.label}>Card Number</label>
                <input
                  style={s.input}
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  maxLength={19}
                  onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                />
                <label style={s.label}>Cardholder Name</label>
                <input
                  style={s.input}
                  placeholder="Name on card"
                  value={card.name}
                  onChange={e => setCard({ ...card, name: e.target.value })}
                />
                <div style={s.cardRow}>
                  <div>
                    <label style={s.label}>Expiry Date</label>
                    <input
                      style={s.input}
                      placeholder="MM/YY"
                      maxLength={5}
                      value={card.expiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCard({ ...card, expiry: v });
                      }}
                    />
                  </div>
                  <div>
                    <label style={s.label}>CVV</label>
                    <input
                      style={s.input}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    />
                  </div>
                </div>
                <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '4px', padding: '10px', fontSize: '0.82rem', color: '#795548', marginBottom: '8px' }}>
                  ⚠️ This is a demo. Do not enter real card details.
                </div>
              </div>
            )}
          </div>

          <button style={s.checkoutBtn} onClick={placeOrder}>
            {paymentMethod === 'cod' ? '🚚 Place Order (Cash on Delivery)' : '💳 Pay & Place Order'}
          </button>
        </>
      )}
    </div>
  );
}
