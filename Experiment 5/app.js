
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // Application States
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Auth States
  const [currentUser, setCurrentUser] = useState(null); // Tracks who is logged in
  const [isLoginScreen, setIsLoginScreen] = useState(true); // Toggles Login vs Register UI
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const theme = {
    dark: {
      bg: '#0a0b10', text: '#e0e0e0', accent: '#00d4ff', card: '#161b22',
      glow: '0 0 15px rgba(0, 212, 255, 0.6)',
      button: 'linear-gradient(45deg, #00d4ff, #0055ff)',
      title: 'PRIME MERIDIAN VISTA'
    },
    light: {
      bg: '#fff0e6', text: '#4a2511', accent: '#ff5e00', card: '#ffffff',
      glow: '0 8px 25px rgba(255, 94, 0, 0.25)', 
      button: 'linear-gradient(45deg, #ff8c00, #e63946)', 
      title: 'PRIME MERIDIAN VISTA'
    }
  };

  const current = isDarkMode ? theme.dark : theme.light;

  // Load products when the app starts
  useEffect(() => {
    axios.get('http://localhost:8080/api/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  // --- AUTHENTICATION FUNCTIONS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginScreen ? '/api/login' : '/api/register';
    
    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, { username, password });
      
      if (response.data.success) {
        if (isLoginScreen) {
          setCurrentUser(response.data.user); // Log the user in!
          setAuthMessage('');
        } else {
          setAuthMessage(response.data.message);
          setIsLoginScreen(true); // Switch to login after registering
        }
      }
    } catch (error) {
      setAuthMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]); // Clear cart on logout
    setUsername('');
    setPassword('');
  };

  // --- UI RENDER: If Not Logged In ---
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: current.bg, color: current.text, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.6s ease' }}>
        <div style={{ backgroundColor: current.card, padding: '40px', borderRadius: '15px', boxShadow: current.glow, width: '350px', textAlign: 'center' }}>
          <h2 style={{ color: current.accent, letterSpacing: '2px', marginBottom: '20px' }}>{current.title}</h2>
          <h3 style={{ marginBottom: '20px' }}>{isLoginScreen ? 'Welcome Back' : 'Create Account'}</h3>
          
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
            <button type="submit" style={{ background: current.button, border: 'none', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {isLoginScreen ? 'LOGIN' : 'REGISTER'}
            </button>
          </form>

          <p style={{ color: current.statusColor, marginTop: '15px', fontWeight: 'bold' }}>{authMessage}</p>

          <p style={{ marginTop: '20px', cursor: 'pointer', opacity: 0.8 }} onClick={() => setIsLoginScreen(!isLoginScreen)}>
            {isLoginScreen ? "Don't have an account? Register here." : "Already have an account? Login here."}
          </p>

          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ marginTop: '20px', padding: '8px 15px', cursor: 'pointer', borderRadius: '25px', border: `1px solid ${current.accent}`, backgroundColor: 'transparent', color: current.accent, transition: '0.4s' }}>
            {isDarkMode ? '🌙 Sunset Mode' : '⚡ Electric Mode'}
          </button>
        </div>
      </div>
    );
  }

  // --- UI RENDER: If Logged In (The Store) ---
  return (
    <div style={{ backgroundColor: current.bg, color: current.text, minHeight: '100vh', transition: 'all 0.6s ease', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${current.accent}`, boxShadow: current.glow, backgroundColor: current.card }}>
        <div>
            <h1 style={{ margin: 0, color: current.accent, textTransform: 'uppercase', letterSpacing: '2px' }}>{current.title}</h1>
            <small style={{ color: current.text, opacity: 0.8 }}>Welcome, <strong>{currentUser.username}</strong>!</small>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ padding: '10px 20px', borderRadius: '25px', backgroundColor: current.accent, color: current.bg, fontWeight: 'bold' }}>
            🛒 Cart: {cart.length} | ₹{cart.reduce((total, item) => total + Number(item.price), 0)}
          </div>
          <button onClick={logout} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '25px', border: 'none', backgroundColor: '#e63946', color: 'white', fontWeight: 'bold' }}>Logout</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '25px', border: `2px solid ${current.accent}`, backgroundColor: 'transparent', color: current.accent, fontWeight: 'bold' }}>
            {isDarkMode ? '🌙 SUNSET' : '⚡ ELECTRIC'}
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '35px' }}>
        {products.map(product => (
          <div key={product.id} style={{ backgroundColor: current.card, padding: '25px', borderRadius: '15px', boxShadow: current.glow, textAlign: 'center' }}>
            <div style={{ height: '160px', backgroundColor: isDarkMode ? '#222' : '#f8dbd5', borderRadius: '10px', marginBottom: '15px' }}></div>
            <h3 style={{ marginBottom: '10px' }}>{product.name}</h3>
            <p style={{ fontSize: '1.6rem', color: current.accent, fontWeight: '900', margin: '15px 0' }}>₹{product.price}</p>
            <button onClick={() => setCart([...cart, product])} style={{ background: current.button, border: 'none', color: 'white', padding: '14px', width: '100%', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
