'use client';

import '../globals.css';
import React from 'react';

export default function RitualClosed() {
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
        @media (max-width: 768px) {
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
          <div className="main-content-box mint-dashboard" style={{ zIndex: 10, maxWidth: '700px', width: '100%', textAlign: 'center' }}>
            {/* MAIN TITLE: White Text with Orange Outline using text-shadow trick */}
            <h1 className="main-title" style={{ 
              fontSize: '2rem', 
              marginBottom: '20px', 
              color: '#ffffff', // White fill
              lineHeight: '1.5', // Fixes overlapping text
              // Creates the hard orange outline effect:
              textShadow: '3px 0 0 #ff4d00, -3px 0 0 #ff4d00, 0 3px 0 #ff4d00, 0 -3px 0 #ff4d00, 2px 2px 0 #ff4d00, -2px -2px 0 #ff4d00, 2px -2px 0 #ff4d00, -2px 2px 0 #ff4d00'
            }}>
              THE RITUAL HAS CONCLUDED
            </h1>
            
            <div style={{ padding: '20px 0' }}>
              {/* LORE TEXT: Plain white for readability */}
              <p className="lore-text" style={{ marginBottom: '30px', lineHeight: '1.8', fontSize: '1.2rem', color: '#ffffff' }}>
                THE GATES ARE OFFICIALLY CLOSED. <br /><br />
                THE SPIRITS HAVE CHOSEN THE WORTHY.<br />
                WELCOME TO THE LEGION.
              </p>
            </div>
          </div>
        </div>

        <footer className="clean-footer">
          <div className="clean-footer-text">
            © 2026 Goryo Goose. All rights reserved.
          </div>
          <div className="clean-footer-links">
            <a href="https:/x.com/GoryoGoose" target="_blank" rel="noopener noreferrer" className="clean-footer-link">X</a>
          </div>
        </footer>
      </div>
    </>
  );
}