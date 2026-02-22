'use client';

import './globals.css';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="app-container">
      <div className="overlay"></div>

      <div className="content-box">
        <img src="/logo.png" alt="Goryo Goose" className="logo" />
        
        <h1 className="title">WHITELIST CLOSED</h1>
        <p className="subtitle">The resurrection of 3333 Goryo Goose is full.</p>

        <div className="twitter-section" style={{ marginTop: '20px' }}>
          <button 
            disabled={true} 
            className="pixel-button"
            style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#444', color: '#ccc' }}
          >
            🔒 SUBMISSION CLOSED
          </button>
        </div>

        {/* Tombol disconnect tetap ada kalau ada user yang kebetulan masih login */}
        {session && (
          <button onClick={() => signOut()} className="pixel-button logout-btn" style={{marginTop: '15px'}}>
            Disconnect
          </button>
        )}
      </div>
      <div className="footer">© 2026 Goryo Goose.</div>
    </div>
  );
}