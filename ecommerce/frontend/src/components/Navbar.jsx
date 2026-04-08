import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const styles = {
  nav: { background: '#1a1a2e', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#e94560', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>ShopEasy</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Products</Link>
        {user ? (
          <>
            <Link to="/cart" style={styles.link}>Cart</Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            {user.isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
