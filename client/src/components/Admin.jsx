import React from 'react';

function Admin() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Admin Login</h1>
        <input
          type="email"
          placeholder="Admin Email"
        />
        <input
          type="password"
          placeholder="Password"
        />
      <br/>
        <button className="login">Login</button>
      </div>
    </div>
  );
}

export default Admin;
