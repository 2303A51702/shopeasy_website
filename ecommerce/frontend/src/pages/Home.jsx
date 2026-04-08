import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' },
  search: { display: 'flex', gap: '10px', marginBottom: '24px' },
  input: { flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  empty: { textAlign: 'center', color: '#888', marginTop: '40px' }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', { params: { search } });
      setProducts(res.data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div style={s.container}>
      <h2 style={{ marginBottom: '16px' }}>All Products</h2>
      <div style={s.search}>
        <input
          style={s.input}
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchProducts()}
        />
        <button onClick={fetchProducts} style={{ padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Search
        </button>
      </div>
      {loading ? <p>Loading...</p> : products.length === 0
        ? <p style={s.empty}>No products found.</p>
        : <div style={s.grid}>{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
      }
    </div>
  );
}
