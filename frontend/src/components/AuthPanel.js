import React from 'react';

function AuthPanel({ user, onLogin, onLogout }) {
  return (
    <div aria-label="Authentication Panel" tabIndex={0} style={{ margin: '1rem 0' }}>
      <h3>User Authentication</h3>
      {user ? (
        <div>
          <span>Logged in as <strong>{user.name}</strong></span>
          <button onClick={onLogout} style={{ marginLeft: '1rem' }}>Logout</button>
        </div>
      ) : (
        <button onClick={onLogin}>Login (stub)</button>
      )}
    </div>
  );
}

export default AuthPanel;
