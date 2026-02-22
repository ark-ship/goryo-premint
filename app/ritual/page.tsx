'use client';

import '../globals.css';
import React, { useState, useEffect } from 'react';

// Sekarang ada 8 Simbol Ritual Goryo
const SYMBOLS = ['⛩️', '💀', '🔥', '🦢', '👺', '🏮', '🌑', '👁️'];
// Warna lampu saat nyala
const COLORS = ['#FF4136', '#85144b', '#FF851B', '#DDDDDD', '#B10DC9', '#FFDC00', '#555555', '#7FDBFF']; 
const TARGET_LEVEL = 10;

export default function RitualGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  
  // State form GTD
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Fungsi untuk mainkan urutan
  const playSequence = async (newSequence: number[]) => {
    setIsPlaying(true);
    // Jeda sebelum urutan mulai
    await new Promise(res => setTimeout(res, 800)); 
    
    for (let i = 0; i < newSequence.length; i++) {
      setActiveButton(newSequence[i]);
      await new Promise(res => setTimeout(res, 500)); // Lama nyala
      setActiveButton(null);
      await new Promise(res => setTimeout(res, 300)); // Jeda antar lampu
    }
    setIsPlaying(false);
  };

  const startGame = () => {
    const firstStep = Math.floor(Math.random() * 8); // Diubah jadi 8
    const newSeq = [firstStep];
    setSequence(newSeq);
    setLevel(1);
    setPlayerStep(0);
    setGameStatus('playing');
    playSequence(newSeq);
  };

  const handleButtonClick = (index: number) => {
    if (isPlaying || gameStatus !== 'playing') return;

    // Animasi klik cepat
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 200);

    if (index === sequence[playerStep]) {
      // Benar
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        // Lanjut level berikutnya
        if (level === TARGET_LEVEL) {
          setGameStatus('won');
        } else {
          const nextLevel = level + 1;
          const newSeq = [...sequence, Math.floor(Math.random() * 8)]; // Diubah jadi 8
          setLevel(nextLevel);
          setSequence(newSeq);
          setPlayerStep(0);
          playSequence(newSeq);
        }
      }
    } else {
      // Salah
      setGameStatus('gameover');
    }
  };

  const handleGTDSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;
    setIsSubmitting(true);

    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlVcahYRzevuMG2-ha091uENfm560-fFy-dy18tRwG-yQvSz7QTUcy_DhoaLhMRkgo/exec';

      // Hack pintar: Tambahkan tag GTD
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "GTD_WINNER", 
          address: `[GTD WINNER] ${walletAddress}`,
          ip: ipData.ip
        }),
      });

      setHasSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Spirits are busy. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container" style={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="overlay"></div>
      
      <div className="content-box" style={{ zIndex: 10, padding: '40px', background: 'rgba(0,0,0,0.8)', border: '2px solid #333', maxWidth: '800px' }}>
        <h1 className="title" style={{ fontSize: '2rem', marginBottom: '10px' }}>The Spirit Ritual</h1>
        
        {gameStatus === 'won' ? (
          hasSubmitted ? (
            <div>
              <h2 style={{ color: '#00FF00', marginBottom: '20px' }}>Ritual Complete.</h2>
              <p>Your GTD spot is secured. Welcome to the legion.</p>
            </div>
          ) : (
            <div className="gtd-form">
              <h2 style={{ color: '#FF851B', marginBottom: '20px' }}>YOU SURVIVED.</h2>
              <p style={{ marginBottom: '20px' }}>Submit your wallet to claim your GTD Spot.</p>
              <form onSubmit={handleGTDSubmit} className="wallet-form">
                <input 
                  type="text" 
                  placeholder="0x... (L1 Address)" 
                  value={walletAddress} 
                  onChange={(e) => setWalletAddress(e.target.value)} 
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: 'white', border: '1px solid #555' }}
                />
                <button type="submit" className="pixel-button submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'CLAIMING...' : '🔥 CLAIM GTD 🔥'}
                </button>
              </form>
            </div>
          )
        ) : (
          <>
            <p className="subtitle" style={{ marginBottom: '30px' }}>
              {gameStatus === 'idle' && "Memorize the sequence to prove your worth."}
              {gameStatus === 'playing' && `Level: ${level} / ${TARGET_LEVEL}`}
              {gameStatus === 'gameover' && <span style={{ color: '#FF4136' }}>The spirits rejected you. Try again.</span>}
            </p>

            {/* Grid diubah jadi 4 kolom untuk nampung 8 simbol */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '500px', margin: '0 auto 30px' }}>
              {SYMBOLS.map((sym, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(index)}
                  style={{
                    fontSize: '3rem',
                    padding: '20px 0',
                    background: activeButton === index ? COLORS[index] : '#111',
                    border: activeButton === index ? '2px solid white' : '2px solid #333',
                    borderRadius: '10px',
                    cursor: (isPlaying || gameStatus !== 'playing') ? 'not-allowed' : 'pointer',
                    transition: 'all 0.1s ease',
                    boxShadow: activeButton === index ? `0 0 20px ${COLORS[index]}` : 'none'
                  }}
                  disabled={isPlaying || gameStatus !== 'playing'}
                >
                  {sym}
                </button>
              ))}
            </div>

            {(gameStatus === 'idle' || gameStatus === 'gameover') && (
              <button onClick={startGame} className="pixel-button quest-btn" style={{ fontSize: '1.2rem', padding: '10px 30px' }}>
                {gameStatus === 'gameover' ? 'RETRY RITUAL 💀' : 'BEGIN RITUAL ⛩️'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}