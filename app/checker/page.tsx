'use client';

import '../globals.css';
import React, { useState } from 'react';
import { gtdRaw, fcfsRaw } from './data';

// --- LOGIC ---
const gtdData = gtdRaw.split('\n').map(w => w.trim().toLowerCase()).filter(w => w !== '');
const fcfsData = fcfsRaw.split('\n').map(w => w.trim().toLowerCase()).filter(w => w !== '');

export default function CheckerPage() {
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<string | null>(null);

  const checkWallet = () => {
    const cleanAddress = address.toLowerCase().trim();
    
    if (!cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
      setStatus('INVALID WALLET FORMAT');
      return;
    }

    const isGtd = gtdData.includes(cleanAddress);
    const isFcfs = fcfsData.includes(cleanAddress);

    if (isGtd && isFcfs) {
      setStatus('🎉 CONGRATS! YOU HAVE BOTH GTD & FCFS ACCESS ⛩️🩸');
    } else if (isGtd) {
      setStatus('🎉 CONGRATS! YOU HAVE GUARANTEED ACCESS (GTD) ⛩️');
    } else if (isFcfs) {
      setStatus('🎉 CONGRATS! YOU HAVE FCFS ACCESS 🩸');
    } else {
      setStatus('NOT WHITELISTED.');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .ritual-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .ritual-game-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }
        .clean-footer {
          width: 100%;
          background: #000000;
          padding: 25px 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #222;
          font-family: 'Outfit', sans-serif;
          position: relative;
          z-index: 20;
        }
        .clean-footer-text {
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 400;
        }
        .clean-footer-links {
          display: flex;
          gap: 30px;
        }
        .clean-footer-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        .clean-footer-link:hover {
          color: #ff4d00;
        }
        
        .checker-input {
          width: 100%;
          max-width: 400px;
          background: #000000;
          border: 3px solid #333;
          color: #ffffff;
          padding: 15px;
          font-size: 1rem;
          text-align: center;
          outline: none;
          font-family: 'Press Start 2P', 'VT323', 'Courier New', monospace;
          text-transform: uppercase;
          margin-bottom: 25px;
          transition: all 0.2s;
        }
        .checker-input:focus {
          border: 3px solid #ff4d00;
          box-shadow: inset 4px 4px 0 rgba(255, 77, 0, 0.2);
        }
        .checker-btn {
          background: transparent;
          color: #ffffff;
          border: 3px solid #ffffff;
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          font-family: 'Press Start 2P', 'VT323', 'Courier New', monospace;
          text-transform: uppercase;
          box-shadow: 4px 4px 0px #ff4d00;
          transition: all 0.1s ease-in-out;
        }
        .checker-btn:hover {
          background: #ff4d00;
          color: #000000;
          border: 3px solid #ff4d00;
          box-shadow: 4px 4px 0px #ffffff;
        }
        .checker-btn:active {
          box-shadow: 0px 0px 0px transparent;
          transform: translateY(4px) translateX(4px);
        }

        /* --- MOBILE RESPONSIVE FIX (HANYA UKURAN) --- */
        @media (max-width: 768px) {
          .main-title {
            font-size: 1.4rem !important; /* Supaya teks judul gak kepotong */
          }
          .checker-input {
            font-size: 0.7rem !important; /* Input lebih kecil di HP */
            max-width: 280px;
          }
          .checker-btn {
            font-size: 0.8rem !important;
            padding: 12px 25px !important;
          }
          .lore-text {
            font-size: 0.7rem !important;
          }
          .clean-footer {
            flex-direction: column;
            gap: 15px;
            padding: 20px;
            text-align: center;
          }
        }
      `}} />

      <div className="app-container ritual-page-wrapper">
        <div className="overlay"></div>
        
        <div className="ritual-game-area">
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', zIndex: 10 }}>
            <img 
              src="/logo.png" 
              alt="Goryo Goose Logo" 
              style={{ width: '250px', maxWidth: '80%', height: 'auto', objectFit: 'contain' }} 
            />
          </div>

          <div className="main-content-box mint-dashboard" style={{ zIndex: 10, maxWidth: '700px', width: '100%', textAlign: 'center' }}>
            
            <h1 className="main-title" style={{ 
              fontSize: '2.5rem', 
              fontWeight: '400', 
              letterSpacing: '2px', 
              marginBottom: '30px', 
              color: '#ffffff', 
              lineHeight: '1.5',
              textShadow: '1px 1px 0 #ff4d00, -1px -1px 0 #ff4d00, 1px -1px 0 #ff4d00, -1px 1px 0 #ff4d00'
            }}>
              WHITELIST CHECKER
            </h1>
            
            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <input 
                type="text"
                className="checker-input"
                placeholder="ENTER WALLET (0x...)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setStatus(null);
                }}
              />

              <button 
                className="checker-btn"
                onClick={checkWallet}
              >
                VERIFY
              </button>

              {status && (
                <p className="lore-text" style={{ 
                  marginTop: '30px', 
                  lineHeight: '1.8', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  fontFamily: "'Press Start 2P', 'Courier New', monospace",
                  color: status.includes('NOT') || status.includes('INVALID') ? '#ff3333' : '#ffffff',
                  textShadow: status.includes('NOT') ? 'none' : '1px 1px 2px #000'
                }}>
                  {status}
                </p>
              )}

            </div>
          </div>
        </div>

        <footer className="clean-footer">
          <div className="clean-footer-text">
            © 2026 Goryo Goose. All rights reserved.
          </div>
          <div className="clean-footer-links">
            <a href="https://x.com/GoryoGoose" target="_blank" rel="noopener noreferrer" className="clean-footer-link">X</a>
          </div>
        </footer>
      </div>
    </>
  );
}