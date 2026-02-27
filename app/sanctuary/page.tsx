'use client';

import '../globals.css';
import React, { useState } from 'react';

export default function SanctuaryPixelPro() {
  // SET THIS TO 'false' WHEN YOU ARE READY TO LAUNCH
  const isLocked = true; 

  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Dummy Data (Preserved)
  const [goryoHeld, setGoryoHeld] = useState(2);
  const [spiritPoints, setSpiritPoints] = useState(150);
  const [txHash, setTxHash] = useState('');
  const walletAddress = '0x4550...1DC0';

  const renderContent = () => {
    // If locked, override everything with the Coming Soon message
    if (isLocked) {
      return (
        <div className="pixel-panel fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <div className="status-tag">SYSTEM OFFLINE</div>
          <h2 className="pixel-title-large">THE SANCTUARY <br/> ⛩️ COMING SOON ⛩️</h2>
          <p className="pixel-desc">
            THE GORYO SPIRITS ARE CURRENTLY SLUMBERING. <br/>
            ACCESS TO THE ALTAR, GRAVEYARD, AND RAFFLES IS RESTRICTED.
          </p>
          <button className="pixel-btn-locked">🔒 CONNECTION UNAVAILABLE</button>
        </div>
      );
    }

    // Original logic remains here (Hidden until isLocked = false)
    switch (activeTab) {
      case 'profile':
        return (
          <div className="pixel-content fade-in">
            <h2 className="pixel-title-large">PROFILE</h2>
            <div className="profile-layout">
              <div className="pixel-panel">
                <div className="panel-header">IDENTITY</div>
                <div className="panel-body">
                  <p className="pixel-label">LEGION ALIAS:</p>
                  <h3 className="pixel-value" style={{ color: '#fff', marginBottom: '20px' }}>Unknown_Spirit</h3>
                  <p className="pixel-label">CONNECTED WALLET:</p>
                  <p className="pixel-value" style={{ color: '#aaa' }}>{walletAddress}</p>
                  <button className="pixel-btn-outline" style={{ marginTop: '30px' }}>EDIT IDENTITY</button>
                </div>
              </div>
              <div className="pixel-panel">
                <div className="panel-header">YOUR ASSETS</div>
                <div className="panel-body stats-grid-pro">
                  <div className="stat-box-pro">
                    <p className="pixel-label" style={{ color: '#ff4d00' }}>GORYO HELD</p>
                    <h3 className="pixel-stat-number">{goryoHeld}</h3>
                  </div>
                  <div className="stat-box-pro">
                    <p className="pixel-label" style={{ color: '#ff4d00' }}>SPIRIT POINTS 🩸</p>
                    <h3 className="pixel-stat-number">{spiritPoints}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'sacrifice':
        return (
          <div className="pixel-content fade-in">
            <h2 className="pixel-title-large" style={{ color: '#ff4136' }}>THE ALTAR OF SACRIFICE</h2>
            <div className="sacrifice-layout">
              <div className="pixel-panel" style={{ borderColor: '#ff4136' }}>
                <div className="panel-header" style={{ backgroundColor: '#85144b' }}>1. THE BURN ADDRESS</div>
                <div className="panel-body" style={{ textAlign: 'center' }}>
                  <div className="burn-address-pro">0x000000000000000000000000000000000000dEaD</div>
                </div>
              </div>
              <div className="pixel-panel" style={{ borderColor: '#ff4136' }}>
                <div className="panel-header" style={{ backgroundColor: '#85144b' }}>2. PROOF OF SACRIFICE</div>
                <div className="panel-body">
                  <input type="text" placeholder="0x..." value={txHash} onChange={(e) => setTxHash(e.target.value)} className="pixel-input-pro" />
                  <button className="pixel-btn-solid" style={{ width: '100%', marginTop: '20px' }}>🩸 SUBMIT OFFERING 🩸</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="pixel-content fade-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2 className="pixel-title-large">AREA LOCKED</h2>
            <div style={{ fontSize: '4rem', margin: '40px 0' }}>🔒</div>
          </div>
        );
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pro-wrapper {
          min-height: 100vh;
          background-color: #050108;
          font-family: "'Press Start 2P', cursive";
          color: #fff;
          display: flex;
          flex-direction: column;
        }

        .pro-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 2, 15, 0.9);
          z-index: 1;
        }

        .pro-topbar {
          position: relative;
          z-index: 10;
          background: rgba(0, 0, 0, 0.95);
          border-bottom: 4px solid #333;
          padding: 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .topbar-logo { height: 50px; }

        .pro-nav-menu { display: flex; gap: 15px; }

        .pro-nav-btn {
          background: transparent;
          color: #aaa;
          border: none;
          font-family: inherit;
          font-size: 0.6rem;
          padding: 15px 20px;
          cursor: pointer;
        }

        .pro-nav-btn.active {
          color: #ff4d00;
          box-shadow: inset 0 -4px 0 #ff4d00;
        }

        .pro-main-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px; 
          margin: 0 auto;
          padding: 50px 20px;
          flex: 1;
        }

        .pixel-panel {
          background: rgba(0, 0, 0, 0.8);
          border: 4px solid #444;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.8);
        }

        .panel-header { background: #333; padding: 15px; font-size: 0.6rem; border-bottom: 4px solid #444; }
        .panel-body { padding: 30px; }

        .pixel-title-large { font-size: 1.2rem; color: #fff; text-shadow: 3px 3px 0 #85144b; margin-bottom: 20px; text-align: center;}
        .pixel-desc { font-size: 0.7rem; color: #888; line-height: 1.8; text-align: center; }

        .pixel-btn-locked { background: #222; border: 4px solid #444; color: #555; padding: 15px 30px; font-family: inherit; cursor: not-allowed; font-size: 0.6rem; }
        .status-tag { display: inline-block; background: #85144b; padding: 8px 15px; font-size: 0.5rem; border: 2px solid #ff4136; margin-bottom: 15px;}

        /* Grid Layouts Preserved */
        .profile-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin-top: 40px; }
        .stats-grid-pro { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-box-pro { background: rgba(20, 5, 10, 0.8); border: 2px dashed #ff4d00; padding: 20px; text-align: center; }
        .pixel-stat-number { font-size: 1.8rem; color: #ff4d00; margin-top: 10px; }

        .pixel-wallet-btn { background: #ff4d00; color: #000; border: 4px solid #fff; padding: 10px 20px; font-family: inherit; font-size: 0.6rem; cursor: pointer; }
        
        .fade-in { animation: fadeIn 0.4s steps(5); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr; }
          .pro-topbar { flex-direction: column; gap: 10px; }
        }
      `}} />

      <div className="pro-wrapper">
        <div className="pro-overlay"></div>
        
        {/* TOPBAR */}
        <div className="pro-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="/logo.png" alt="Logo" className="topbar-logo" />
            
            {/* Nav Menu stays in code, but only shows if NOT locked and CONNECTED */}
            {!isLocked && isConnected && (
              <div className="pro-nav-menu">
                <button className={`pro-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>PROFILE</button>
                <button className={`pro-nav-btn ${activeTab === 'sacrifice' ? 'active' : ''}`} onClick={() => setActiveTab('sacrifice')}>SACRIFICE</button>
              </div>
            )}
          </div>
          
          <div>
            {isLocked ? (
              <button className="pixel-btn-locked">LOCKED</button>
            ) : !isConnected ? (
              <button className="pixel-wallet-btn" onClick={() => setIsConnected(true)}>CONNECT</button>
            ) : (
              <button className="pixel-wallet-btn" style={{ background: '#333', color: '#fff' }}>{walletAddress}</button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="pro-main-container">
          {renderContent()}
        </div>
      </div>
    </>
  );
}