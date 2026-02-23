'use client';

import './globals.css';
import React from 'react';

export default function Home() {
  return (
    <div className="app-container">
      <div className="overlay"></div>
      
      {/* LIVE STATUS */}
      <div className="live-status">
        <span className="dot"></span> STATUS: PRE-MINT RITUAL
      </div>

      <div className="main-content-box">
        {/* HERO SECTION */}
        <section className="hero">
          <p className="introducing-text">INTRODUCING</p>
          <img src="/logo.png" alt="Goryo Goose" className="main-logo" />
          <h1 className="main-title">GORYO GOOSE</h1>
          <p className="lore-text">3,333 PIXEL ART GEESE. COLLECTIBLES ON ETHEREUM.</p>
        </section>
      
        <div className="mint-dashboard">
          <h2 className="dashboard-title">MINT ACCESS</h2>
          <div className="phases-container">
            <div className="phase-card">
              <span className="phase-badge">PHASE 1</span>
              <h3>GTD</h3>
              <p className="phase-desc">RESERVED FOR THE TOP SUPPORTERS.</p>
            </div>
            <div className="phase-card">
              <span className="phase-badge">PHASE 2</span>
              <h3>WL</h3>
              <p className="phase-desc">FIRST COME, FIRST SERVED MINT.</p>
            </div>
            <div className="phase-card">
              <span className="phase-badge">PHASE 3</span>
              <h3>PUBLIC</h3>
              <p className="phase-desc">OPEN IF SUPPLY REMAINS.</p>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION - BIAR BERISI */}
        <div className="details-grid">
          <div className="detail-item">
            <h3>THE ART</h3>
            <p>3,333 HANDDRAWN PIXELS. 8-BIT AESTHETICS.</p>
          </div>
          <div className="detail-item">
            <h3>THE MISSION</h3>
            <p>FOCUSING ON ART QUALITY AND COMMUNITY GROWTH. ESTABLISHING A PERMANENT PRESENCE ON THE CHAIN.</p>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="faq-section">
          <h2 className="section-title">FAQ</h2>
          <div className="faq-item">
            <h3>WHAT IS GORYO GOOSE?</h3>
            <p>3,333 UNIQUE PIXEL ART GEESE ON ETHEREUM.</p>
          </div>
          <div className="faq-item">
            <h3>HOW TO JOIN THE FLOCK?</h3>
            <p>STAY ACTIVE ON X. WE ARE HAND PICKING THE MOST DEDICATED SUPPORTERS FOR THE ACCESS.</p>
          </div>
          <div className="faq-item">
            <h3>WHEN IS THE MINT?</h3>
            <p>THE DATE WILL BE ANNOUNCED ON OUR X FEED. KEEP YOUR NOTIFICATIONS ON.</p>
          </div>
        </div>

        {/* SOCIAL LINK */}
        <div className="social-box">
           <a href="https://twitter.com/GoryoGoose" target="_blank" rel="noreferrer" className="social-btn">
             FOLLOW US ON 𝕏
           </a>
        </div>
      </div>
      
      <footer className="main-footer">
        GORYO GOOSE © 2026
      </footer>
    </div>
  );
}