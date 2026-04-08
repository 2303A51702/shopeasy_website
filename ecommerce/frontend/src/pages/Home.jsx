import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', "Men's Fashion", 'Kurtis', 'Sarees', 'Beauty', 'Accessories', 'Home & Kitchen', 'Books'];

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' },
  search: { display: 'flex', gap: '10px', marginBottom: '16px' },
  input: { flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  searchBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  cats: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  cat: (active) => ({
    padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: active ? 'bold' : 'normal',
    background: active ? '#e94560' : '#fff', color: active ? '#fff' : '#555',
    border: `1px solid ${active ? '#e94560' : '#ddd'}`, transition: 'all 0.2s'
  }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  empty: { textAlign: 'center', color: '#888', marginTop: '40px' },
  count: { fontSize: '0.85rem', color: '#888', marginBottom: '12px' }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (cat = activeCategory, q = search) => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.search = q;
      if (cat !== 'All') params.category = cat;
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearch('');
    fetchProducts(cat, '');
  };

  const handleSearch = () => {
    setActiveCategory('All');
    fetchProducts('All', search);
  };

  return (
    <div>
      {/* Hero Introduction */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #e94560 100%)', color: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '16px', fontWeight: 'bold' }}>Welcome to ShopEasy 🛍️</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          {[
            { icon: '👗', text: 'Trendy kurtis, sarees & fashion for every occasion' },
            { icon: '💄', text: 'Top beauty & skincare brands at best prices' },
            { icon: '📱', text: 'Latest electronics — phones, laptops & more' },
            { icon: '🚚', text: 'Fast delivery with Cash on Delivery option' },
            { icon: '🔒', text: 'Secure payments & easy returns guaranteed' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', minWidth: '220px' }}>
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <span style={{ color: '#e0e0e0' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      

      <div style={s.container}>
      <h2 style={{ marginBottom: '16px' }}>All Products</h2>

      {/* Search */}
      <div style={s.search}>
        <input
          style={s.input}
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} style={s.searchBtn}>Search</button>
      </div>

      {/* Category filters */}
      <div style={s.cats}>
        {CATEGORIES.map(cat => (
          <button key={cat} style={s.cat(activeCategory === cat)} onClick={() => handleCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && (
        <div style={s.count}>
          {products.length} product{products.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in ${activeCategory}` : 'found'}
        </div>
      )}

      {loading ? <p>Loading...</p> : products.length === 0
        ? <p style={s.empty}>No products found.</p>
        : <div style={s.grid}>{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
      }
      </div>
    </div>
  );
}
