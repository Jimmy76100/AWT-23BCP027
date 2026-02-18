import React, { useState } from 'react';

// --- 1. ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ user, onLogout }) => {
  // State to track which section is active: 'menu', 'users', 'logs', 'settings'
  const [activeView, setActiveView] = useState('menu');

  // content for "Manage Users"
  if (activeView === 'users') {
    return (
      <div style={styles.card}>
        <h3>👥 User Management</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>John Doe (User) <button style={styles.smBtn}>Edit</button></li>
          <li style={styles.listItem}>Jane Smith (User) <button style={styles.smBtn}>Edit</button></li>
          <li style={styles.listItem}>Bob Johnson (Guest) <button style={styles.smBtn}>Edit</button></li>
        </ul>
        <button onClick={() => setActiveView('menu')} style={styles.backBtn}>⬅ Back to Menu</button>
      </div>
    );
  }

  // content for "View Logs"
  if (activeView === 'logs') {
    return (
      <div style={styles.card}>
        <h3>📜 System Logs</h3>
        <div style={styles.logBox}>
          <p>10:00 AM - System Startup</p>
          <p>10:05 AM - User Login: John</p>
          <p>10:15 AM - Database Backup</p>
          <p style={{color: 'red'}}>10:20 AM - Failed Login Attempt</p>
        </div>
        <button onClick={() => setActiveView('menu')} style={styles.backBtn}>⬅ Back to Menu</button>
      </div>
    );
  }

  // content for "Settings"
  if (activeView === 'settings') {
    return (
      <div style={styles.card}>
        <h3>⚙️ System Settings</h3>
        <div style={{textAlign: 'left', margin: '20px 0'}}>
          <label><input type="checkbox" defaultChecked /> Enable Notifications</label><br/><br/>
          <label><input type="checkbox" /> Maintenance Mode</label><br/><br/>
          <label><input type="checkbox" defaultChecked /> Dark Theme</label>
        </div>
        <button onClick={() => alert('Settings Saved!')} style={styles.actionBtn}>Save Changes</button>
        <button onClick={() => setActiveView('menu')} style={styles.backBtn}>⬅ Back to Menu</button>
      </div>
    );
  }

  // DEFAULT: Main Admin Menu
  return (
    <div style={{...styles.card, ...styles.adminTheme}}>
      <div style={styles.badge}>ADMINISTRATOR</div>
      <h2>Admin Panel</h2>
      <p>Welcome, <strong>{user.name}</strong></p>
      
      <div style={styles.dashboardGrid}>
        <button onClick={() => setActiveView('users')} style={styles.adminBtn}>Manage Users 👥</button>
        <button onClick={() => setActiveView('logs')} style={styles.adminBtn}>View Logs 📜</button>
        <button onClick={() => setActiveView('settings')} style={styles.adminBtn}>System Settings ⚙️</button>
      </div>

      <button onClick={onLogout} style={styles.logoutButton}>Logout Admin</button>
    </div>
  );
};

// --- 2. USER DASHBOARD COMPONENT ---
const UserDashboard = ({ user, onLogout }) => {
  const [status, setStatus] = useState('Active ✅');

  const handleRefresh = () => {
    setStatus('Updating...');
    setTimeout(() => setStatus('Active ✅ (Updated just now)'), 1000);
  };

  return (
    <div style={styles.card}>
      <div style={{...styles.badge, backgroundColor: '#28a745'}}>USER</div>
      <h2>My Profile</h2>
      <p>Welcome back, <strong>{user.name}</strong>!</p>
      
      <div style={styles.profileBox}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>

      <button onClick={handleRefresh} style={styles.actionBtn}>🔄 Refresh Status</button>
      <button onClick={onLogout} style={styles.logoutButton}>Sign Out</button>
    </div>
  );
};

// --- 3. MAIN COMPONENT (Login Logic) ---
const UserProfile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); 

    setTimeout(() => {
      if (email === "admin@test.com" && password === "admin123") {
        setUser({ name: "Super Admin", email, role: "admin" });
      } else if (email === "user@test.com" && password === "user123") {
        setUser({ name: "John Doe", email, role: "user" });
      } else {
        setError("Invalid email or password!");
      }
      setIsLoading(false); 
    }, 1500); 
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  if (isLoading) {
    return (
      <div style={styles.card}>
        <div style={styles.spinner}></div>
        <p>Verifying credentials...</p>
      </div>
    );
  }

  if (user) {
    return user.role === 'admin' 
      ? <AdminDashboard user={user} onLogout={handleLogout} />
      : <UserDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={styles.card}>
      <h2>Login Portal</h2>
      <p style={{color: '#666'}}>Please sign in to continue</p>
      <form onSubmit={handleLogin} style={styles.form}>
        <input 
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required style={styles.input}
        />
        <input 
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.loginButton}>Log In</button>
      </form>
      <div style={styles.hintBox}>
        <small>Admin: admin@test.com / admin123</small><br/>
        <small>User: user@test.com / user123</small>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  card: {
    backgroundColor: 'white', padding: '2rem', borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '350px',
    margin: '50px auto', textAlign: 'center', fontFamily: 'Segoe UI, sans-serif', color: '#333'
  },
  adminTheme: { backgroundColor: '#1a1a2e', color: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  loginButton: {
    padding: '12px', backgroundColor: '#4361ee', color: 'white', fontWeight: 'bold',
    border: 'none', borderRadius: '8px', cursor: 'pointer'
  },
  logoutButton: {
    marginTop: '20px', padding: '8px 16px', backgroundColor: '#ef233c', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%'
  },
  actionBtn: {
    marginTop: '10px', padding: '8px 16px', backgroundColor: '#4361ee', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', marginBottom: '10px'
  },
  backBtn: {
    marginTop: '10px', padding: '8px', backgroundColor: '#666', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%'
  },
  adminBtn: { 
    padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', 
    backgroundColor: '#16213e', color: 'white', border: '1px solid #0f3460',
    transition: '0.2s', fontWeight: 'bold'
  },
  dashboardGrid: { display: 'grid', gap: '10px', marginTop: '20px' },
  list: { listStyle: 'none', padding: 0, textAlign: 'left' },
  listItem: { padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  smBtn: { fontSize: '0.7rem', padding: '4px 8px', cursor: 'pointer' },
  logBox: { backgroundColor: '#f8f9fa', padding: '10px', textAlign: 'left', fontSize: '0.8rem', borderRadius: '5px', border: '1px solid #ddd', fontFamily: 'monospace' },
  badge: { display: 'inline-block', padding: '5px 10px', borderRadius: '20px', backgroundColor: '#ef233c', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' },
  error: { color: '#ef233c', fontSize: '0.9rem', margin: 0 },
  hintBox: { marginTop: '20px', color: '#888', fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' },
  profileBox: { backgroundColor: '#f1f1f1', padding: '15px', borderRadius: '10px', marginTop: '15px', textAlign: 'left' },
  spinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }
};

// Keyframes
const styleSheet = document.styleSheets[0];
const keyframes = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
try { styleSheet.insertRule(keyframes, styleSheet.cssRules.length); } catch(e){}

export default UserProfile;
