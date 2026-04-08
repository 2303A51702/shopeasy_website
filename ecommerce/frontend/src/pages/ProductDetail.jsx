import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../App';

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  back: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '20px', padding: 0 },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', display: 'flex', gap: '32px', padding: '32px', flexWrap: 'wrap' },
  img: { width: '340px', height: '340px', objectFit: 'cover', borderRadius: '8px', background: '#eee', flexShrink: 0 },
  info: { flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '12px' },
  category: { fontSize: '0.8rem', background: '#f0f0f0', color: '#555', padding: '3px 10px', borderRadius: '12px', display: 'inline-block', width: 'fit-content' },
  name: { fontSize: '1.6rem', fontWeight: 'bold' },
  price: { fontSize: '1.8rem', color: '#e94560', fontWeight: 'bold' },
  desc: { color: '#555', lineHeight: '1.6', fontSize: '0.95rem' },
  stock: (inStock) => ({ fontSize: '0.9rem', color: inStock ? 'green' : 'red', fontWeight: '500' }),
  qtyRow: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' },
  qtyBtn: { width: '34px', height: '34px', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', borderRadius: '4px', fontSize: '1.1rem' },
  addBtn: { padding: '12px 28px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' },
  loginBtn: { padding: '12px 28px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/cart/add', { productId: product._id, quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  if (loading) return <div style={s.page}><p>Loading...</p></div>;
  if (!product) return null;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.card}>
        {product.image
          ? <img src={product.image} alt={product.name} style={s.img} />
          : <div style={s.img} />
        }
        <div style={s.info}>
          <span style={s.category}>{product.category}</span>
          <div style={s.name}>{product.name}</div>
          <div style={s.price}>₹{Number(product.price).toLocaleString('en-IN')}</div>
          <div style={s.desc}>{product.description}</div>
          <div style={s.stock(product.stock > 0)}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
          </div>

          {product.stock > 0 && (
            <>
              <div style={s.qtyRow}>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>Quantity:</span>
                <button style={s.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                <button style={s.qtyBtn} onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              {user ? (
                <button style={{ ...s.addBtn, background: added ? '#2e7d32' : '#e94560' }} onClick={addToCart}>
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              ) : (
                <button style={s.loginBtn} onClick={() => navigate('/login')}>
                  Login to Add to Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
