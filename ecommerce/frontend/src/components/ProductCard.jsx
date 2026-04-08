import React from 'react';
import api from '../api';
import { useAuth } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const s = {
  card: { background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
  img: { width: '100%', height: '200px', objectFit: 'cover', background: '#eee', cursor: 'pointer', display: 'block' },
  body: { padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  name: { fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', color: '#1a1a2e', textDecoration: 'none' },
  desc: { color: '#666', fontSize: '0.85rem', flex: 1 },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '1.1rem' },
  btn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }
};

export default function ProductCard({ product, onAdded }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/cart/add', { productId: product._id });
      onAdded && onAdded();
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  return (
    <div style={s.card}>
      {product.image
        ? <img src={product.image} alt={product.name} style={s.img} onClick={() => navigate(`/product/${product._id}`)} />
        : <div style={{ ...s.img, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', cursor: 'pointer' }} onClick={() => navigate(`/product/${product._id}`)}>No Image</div>
      }
      <div style={s.body}>
        <Link to={`/product/${product._id}`} style={s.name}>{product.name}</Link>
        <div style={s.desc}>{product.description}</div>
        <div style={s.price}>₹{Number(product.price).toLocaleString('en-IN')}</div>
        <div style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'green' : 'red' }}>
          {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
        </div>
        <button style={s.btn} onClick={addToCart} disabled={product.stock === 0}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
