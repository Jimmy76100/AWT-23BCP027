import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCheckout, setIsCheckout] = useState(false); 
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  useEffect(() => {
    axios.get('http://localhost:8080/api/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  // 📸 NEW: 100% Unique Images for every product
  const getProductImage = (name) => {
    const images = {
      'Quantum Gaming Laptop': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
      'Nebula Smartphone Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=600&q=80',
      'Sonic Noise-Canceling Headphones': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
      'Cyber Mechanical Keyboard': 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80',
      'Titan Smartwatch': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      'Aero Tablet Ultra': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      'Vortex 4K Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
      'Stealth Gaming Mouse': 'https://images.unsplash.com/photo-1527814050087-37938154791f?w=600&q=80',
      'Lumina DSLR Camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'
    };
    return images[name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
  };

  // 🛒 NEW: Remove item from cart by its index
  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginScreen ? '/api/login' : '/api/register';
    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, { username, password });
      if (response.data.success) {
        if (isLoginScreen) {
          setCurrentUser(response.data.user);
          setAuthMessage('');
        } else {
          setAuthMessage(response.data.message);
          setIsLoginScreen(true);
        }
      }
    } catch (error) {
      setAuthMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  const logout = () => {
    setCurrentUser(null); setCart([]); setUsername(''); setPassword(''); setIsCheckout(false);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
        setCart([]); setPaymentSuccess(false); setIsCheckout(false);
    }, 3000);
  };

  const cartTotal = cart.reduce((total, item) => total + Number(item.price), 0);

  // --- UI RENDER: LOGIN ---
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: current.bg, color: current.text, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.6s ease' }}>
        <div style={{ backgroundColor: current.card, padding: '40px', borderRadius: '15px', boxShadow: current.glow, width: '350px', textAlign: 'center' }}>
          <h2 style={{ color: current.accent, letterSpacing: '2px', marginBottom: '20px' }}>{current.title}</h2>
          <h3 style={{ marginBottom: '20px' }}>{isLoginScreen ? 'Secure Login' : 'Create Account'}</h3>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
            <button type="submit" style={{ background: current.button, border: 'none', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {isLoginScreen ? 'LOGIN TO STORE' : 'REGISTER'}
            </button>
          </form>
          <p style={{ color: '#e63946', marginTop: '15px', fontWeight: 'bold' }}>{authMessage}</p>
          <p style={{ marginTop: '20px', cursor: 'pointer', opacity: 0.8 }} onClick={() => setIsLoginScreen(!isLoginScreen)}>
            {isLoginScreen ? "Don't have an account? Register here." : "Already have an account? Login here."}
          </p>
        </div>
      </div>
    );
  }

  // --- UI RENDER: CHECKOUT SCREEN ---
  if (isCheckout) {
      return (
        <div style={{ backgroundColor: current.bg, color: current.text, minHeight: '100vh', transition: 'all 0.6s ease', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => setIsCheckout(false)} style={{ background: 'transparent', border: `2px solid ${current.accent}`, color: current.accent, padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '30px' }}>
                    ← Back to Store
                </button>
                
                {paymentSuccess ? (
                    <div style={{ backgroundColor: current.card, padding: '50px', borderRadius: '15px', boxShadow: current.glow, textAlign: 'center' }}>
                        <h1 style={{ color: '#4CAF50', fontSize: '3rem', margin: '0 0 20px 0' }}>✅ Payment Successful!</h1>
                        <h3>Thank you, {currentUser.username}! Your order is on the way.</h3>
                        <p style={{ opacity: 0.7 }}>Redirecting you back to the store...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ backgroundColor: current.card, padding: '30px', borderRadius: '15px', boxShadow: current.glow }}>
                            <h2 style={{ borderBottom: `1px solid ${current.accent}`, paddingBottom: '10px' }}>Order Summary</h2>
                            {cart.length === 0 ? <p>Your cart is empty.</p> : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {/* 🗑️ UPDATED CART LIST WITH DELETE BUTTON */}
                                    {cart.map((item, index) => (
                                        <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', paddingBottom: '10px', borderBottom: isDarkMode ? '1px solid #333' : '1px solid #eee', fontSize: '1.1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={getProductImage(item.name)} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} />
                                                {item.name}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <strong style={{ color: current.accent }}>₹{item.price}</strong>
                                                <button onClick={() => removeFromCart(index)} style={{ background: '#e63946', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title="Remove item">
                                                    ×
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <h2 style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                                Total: <span style={{ color: current.accent }}>₹{cartTotal}</span>
                            </h2>
                        </div>

                        <div style={{ backgroundColor: current.card, padding: '30px', borderRadius: '15px', boxShadow: current.glow }}>
                            <h2 style={{ borderBottom: `1px solid ${current.accent}`, paddingBottom: '10px' }}>Payment Details</h2>
                            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                <input type="text" placeholder="Cardholder Name" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
                                <input type="text" placeholder="Card Number (16 Digits)" required maxLength="16" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" placeholder="MM/YY" required style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
                                    <input type="password" placeholder="CVV" required maxLength="3" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: isDarkMode ? '#222' : '#fff', color: current.text }} />
                                </div>
                                <button disabled={cart.length === 0} type="submit" style={{ background: current.button, border: 'none', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', cursor: cart.length === 0 ? 'not-allowed' : 'pointer', marginTop: '20px', opacity: cart.length === 0 ? 0.5 : 1 }}>
                                    PAY ₹{cartTotal} NOW
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- UI RENDER: STOREFRONT ---
  return (
    <div style={{ backgroundColor: current.bg, color: current.text, minHeight: '100vh', transition: 'all 0.6s ease', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${current.accent}`, boxShadow: current.glow, backgroundColor: current.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
            <h1 style={{ margin: 0, color: current.accent, textTransform: 'uppercase', letterSpacing: '2px' }}>{current.title}</h1>
            <small style={{ color: current.text, opacity: 0.8 }}>Welcome, <strong>{currentUser.username}</strong>!</small>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setIsCheckout(true)} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '25px', backgroundColor: current.accent, color: current.bg, border: 'none', fontWeight: 'bold', boxShadow: current.glow, transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
            🛒 Cart: {cart.length} | ₹{cartTotal} ➔
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '25px', border: `2px solid ${current.accent}`, backgroundColor: 'transparent', color: current.accent, fontWeight: 'bold' }}>
            {isDarkMode ? '🌙 SUNSET' : '⚡ ELECTRIC'}
          </button>
          <button onClick={logout} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '25px', border: 'none', backgroundColor: '#e63946', color: 'white', fontWeight: 'bold' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '35px' }}>
        {products.map(product => (
          <div key={product.id} 
               style={{ backgroundColor: current.card, padding: '25px', borderRadius: '15px', boxShadow: current.glow, textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 15px 30px ${isDarkMode ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 94, 0, 0.4)'}`; }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = current.glow; }}>
            
            <div style={{ height: '200px', width: '100%', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden', backgroundColor: '#222' }}>
                <img src={getProductImage(product.name)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                     onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}/>
            </div>

            <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>{product.name}</h3>
            <p style={{ fontSize: '1.8rem', color: current.accent, fontWeight: '900', margin: '15px 0' }}>₹{product.price}</p>
            
            <button onClick={() => setCart([...cart, product])} 
                    style={{ background: current.button, border: 'none', color: 'white', padding: '14px', width: '100%', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'transform 0.1s' }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
