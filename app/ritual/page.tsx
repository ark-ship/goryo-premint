'use client';

import '../globals.css';
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

const SYMBOLS = ['⛩️', '💀', '🔥', '🦢', '👺', '🏮', '🌑', '👁️'];
const COLORS = ['#FF4136', '#85144b', '#FF851B', '#DDDDDD', '#B10DC9', '#FFDC00', '#555555', '#7FDBFF']; 
const TARGET_LEVEL = 20;

export default function RitualGame() {
  // GET TWITTER LOGIN SESSION STATUS FROM NEXTAUTH
  const { data: session, status } = useSession();
  const isXConnected = status === 'authenticated';
  const isConnecting = status === 'loading';

  // GAME STATES
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  
  // gameStatus: idle | playing | gameover | won | locked_out
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'gameover' | 'won' | 'locked_out'>('idle');
  
  // FORM STATES
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false); 

  // LIVES & COOLDOWN STATES
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3); 
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [cooldownText, setCooldownText] = useState<string>('');

  // INITIALIZE DATA FROM LOCAL STORAGE ON MOUNT
  useEffect(() => {
    // Check if player has already won
    if (localStorage.getItem('goryo_won') === 'true') {
      setIsWinner(true);
      setGameStatus('won');
    }

    // Check if player has already submitted their wallet
    if (localStorage.getItem('goryo_submitted') === 'true') {
      setHasSubmitted(true);
    }

    // Check if player is currently locked out
    const savedLockout = localStorage.getItem('goryo_lockout');
    if (savedLockout) {
      const lockoutEnd = parseInt(savedLockout, 10);
      if (Date.now() < lockoutEnd) {
        setLockoutTime(lockoutEnd);
        setGameStatus('locked_out');
        setAttemptsLeft(0);
      } else {
        // Lockout period is over, restore lives
        localStorage.removeItem('goryo_lockout');
        localStorage.setItem('goryo_attempts', '3');
        setAttemptsLeft(3);
      }
    } else {
      // Check remaining lives if not locked out
      const savedAttempts = localStorage.getItem('goryo_attempts');
      if (savedAttempts !== null) {
        setAttemptsLeft(parseInt(savedAttempts, 10));
      } else {
        localStorage.setItem('goryo_attempts', '3');
        setAttemptsLeft(3);
      }
    }
  }, []);

  // COOLDOWN TIMER INTERVAL (2 HOURS)
  useEffect(() => {
    if (!lockoutTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutTime) {
        // Lockout finished, allow retry
        setLockoutTime(null);
        setAttemptsLeft(3);
        setGameStatus('idle');
        localStorage.removeItem('goryo_lockout');
        localStorage.setItem('goryo_attempts', '3');
        clearInterval(interval);
      } else {
        // Calculate remaining time
        const diff = lockoutTime - now;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCooldownText(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime]);

  // PLAY THE SEQUENCE ANIMATION
  const playSequence = async (newSequence: number[]) => {
    setIsPlaying(true);
    await new Promise(res => setTimeout(res, 800)); 
    for (let i = 0; i < newSequence.length; i++) {
      setActiveButton(newSequence[i]);
      await new Promise(res => setTimeout(res, 500)); 
      setActiveButton(null);
      await new Promise(res => setTimeout(res, 300)); 
    }
    setIsPlaying(false);
  };

  // START GAME
  const startGame = () => {
    if (attemptsLeft <= 0) return;
    const firstStep = Math.floor(Math.random() * 8);
    const newSeq = [firstStep];
    setSequence(newSeq);
    setLevel(1);
    setPlayerStep(0);
    setGameStatus('playing');
    playSequence(newSeq);
  };

  // HANDLE USER SYMBOL CLICK
  const handleButtonClick = (index: number) => {
    if (isPlaying || gameStatus !== 'playing') return;

    // Quick flash animation on click
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 200);

    if (index === sequence[playerStep]) {
      // CORRECT GUESS
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        if (level === TARGET_LEVEL) {
          // PLAYER WINS THE GAME
          setGameStatus('won');
          setIsWinner(true);
          localStorage.setItem('goryo_won', 'true');
        } else {
          // PROCEED TO NEXT LEVEL
          const nextLevel = level + 1;
          const newSeq = [...sequence, Math.floor(Math.random() * 8)];
          setLevel(nextLevel);
          setSequence(newSeq);
          setPlayerStep(0);
          playSequence(newSeq);
        }
      }
    } else {
      // WRONG GUESS (LOSE A LIFE)
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      localStorage.setItem('goryo_attempts', newAttempts.toString());

      if (newAttempts <= 0) {
        // NO LIVES LEFT -> APPLY 2 HOUR LOCKOUT
        const lockoutEnd = Date.now() + (2 * 60 * 60 * 1000); 
        setLockoutTime(lockoutEnd);
        localStorage.setItem('goryo_lockout', lockoutEnd.toString());
        setGameStatus('locked_out');
      } else {
        // LIVES REMAINING -> GAME OVER STATE (CAN RETRY)
        setGameStatus('gameover');
      }
    }
  };

  // HANDLE GTD WALLET SUBMISSION
  const handleGTDSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;
    setIsSubmitting(true);

    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlVcahYRzevuMG2-ha091uENfm560-fFy-dy18tRwG-yQvSz7QTUcy_DhoaLhMRkgo/exec';

      // Include Twitter Handle in submission if available
      const twitterInfo = session?.user?.name ? `[@${session.user.name}]` : '[NO X ID]';

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "GTD_WINNER", 
          address: `${twitterInfo} [GTD WINNER] ${walletAddress}`,
          ip: ipData.ip
        }),
      });

      // MARK AS SUBMITTED IN STATE AND LOCAL STORAGE
      setHasSubmitted(true);
      localStorage.setItem('goryo_submitted', 'true');

    } catch (err) {
      console.error(err);
      alert("Spirits are busy. Try again.");
    } finally {
      setIsSubmitting(false);
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
            <h1 className="main-title" style={{ fontSize: '2rem', marginBottom: '10px' }}>THE SPIRIT RITUAL</h1>
            
            {/* TWITTER LOGIN LOGIC */}
            {!isXConnected && !isWinner ? (
              <div style={{ padding: '40px 0' }}>
                <p className="lore-text" style={{ marginBottom: '30px', lineHeight: '1.5' }}>
                  CONNECT YOUR X ACCOUNT TO PROVE YOU ARE NOT A BOT.
                </p>
                <button 
                  onClick={() => signIn('twitter')}
                  style={{ 
                    backgroundColor: '#1DA1F2', 
                    color: '#ffffff',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.8rem',
                    border: '2px solid #ffffff',
                    padding: '15px 30px',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 0px #000000',
                    textTransform: 'uppercase'
                  }}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'CONNECTING...' : 'CONNECT X TO PLAY'}
                </button>
              </div>
            ) : (
              // IF CONNECTED TO TWITTER OR ALREADY WON
              <>
                {isWinner ? (
                  hasSubmitted ? (
                    <div>
                      <h2 className="dashboard-title" style={{ color: '#00FF00', marginBottom: '20px' }}>RITUAL COMPLETE.</h2>
                      <p className="lore-text">YOUR GTD SPOT IS SECURED. WELCOME TO THE LEGION.</p>
                    </div>
                  ) : (
                    <div className="gtd-form">
                      <h2 className="dashboard-title" style={{ color: '#ff4d00', marginBottom: '20px' }}>YOU SURVIVED.</h2>
                      <p className="lore-text" style={{ marginBottom: '20px' }}>SUBMIT YOUR WALLET TO CLAIM YOUR GTD SPOT.</p>
                      <form onSubmit={handleGTDSubmit} className="wallet-form">
                        <input 
                          type="text" 
                          placeholder="0x..." 
                          value={walletAddress} 
                          onChange={(e) => setWalletAddress(e.target.value)} 
                          disabled={isSubmitting}
                          style={{ 
                            width: '100%', padding: '15px', marginBottom: '20px', 
                            background: 'rgba(0,0,0,0.8)', color: 'white', border: '2px solid #ff4d00',
                            fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem', textAlign: 'center'
                          }}
                        />
                        <button 
                          type="submit" 
                          style={{ 
                            backgroundColor: '#ff4d00', color: '#ffffff', border: '2px solid #ffffff', 
                            padding: '15px 30px', cursor: 'pointer', width: '100%',
                            fontFamily: "'Press Start 2P', cursive", fontSize: '1rem',
                            boxShadow: '4px 4px 0px #000000', textTransform: 'uppercase'
                          }} 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'CLAIMING...' : '🔥 CLAIM GTD 🔥'}
                        </button>
                      </form>
                    </div>
                  )
                ) : (
                  <>
                    <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                      <span style={{ color: '#ff4d00', fontFamily: "'Press Start 2P', cursive" }}>
                        LIVES: {'🩸'.repeat(attemptsLeft)}{'🖤'.repeat(3 - attemptsLeft)}
                      </span>
                    </div>

                    <p className="lore-text" style={{ marginBottom: '30px', minHeight: '40px' }}>
                      {gameStatus === 'idle' && (
                        <>
                          <span style={{ color: '#00FF00' }}>WELCOME, {session?.user?.name ? `@${session.user.name}` : 'MORTAL'}.</span><br/>
                          MEMORIZE THE SEQUENCE TO PROVE YOUR WORTH.
                        </>
                      )}
                      {gameStatus === 'playing' && `LEVEL: ${level} / ${TARGET_LEVEL}`}
                      {gameStatus === 'gameover' && <span style={{ color: '#FF4136' }}>WRONG SYMBOL. THE SPIRITS ARE ANGRY.</span>}
                      {gameStatus === 'locked_out' && (
                        <span style={{ color: '#FF4136' }}>
                          NO LIVES LEFT. SPIRITS ARE RESTING.<br/>
                          <span style={{ color: '#FFDC00', display: 'block', marginTop: '10px' }}>TRY AGAIN IN: {cooldownText}</span>
                        </span>
                      )}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '500px', margin: '0 auto 40px' }}>
                      {SYMBOLS.map((sym, index) => (
                        <button
                          key={index}
                          onClick={() => handleButtonClick(index)}
                          style={{
                            fontSize: '2.5rem',
                            padding: '20px 0',
                            background: activeButton === index ? COLORS[index] : 'rgba(0, 0, 0, 0.8)',
                            border: activeButton === index ? '2px solid white' : '2px solid #333',
                            borderRadius: '8px',
                            cursor: (isPlaying || gameStatus !== 'playing') ? 'not-allowed' : 'pointer',
                            transition: 'all 0.1s ease',
                            boxShadow: activeButton === index ? `0 0 20px ${COLORS[index]}` : 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: gameStatus === 'locked_out' ? 0.2 : 1 
                          }}
                          disabled={isPlaying || gameStatus !== 'playing'}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>

                    {(gameStatus === 'idle' || gameStatus === 'gameover') && (
                      <button 
                        onClick={startGame} 
                        style={{ 
                          backgroundColor: '#ff4d00',
                          color: '#ffffff',
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '1rem',
                          border: '2px solid #ffffff',
                          padding: '15px 30px',
                          cursor: 'pointer',
                          boxShadow: '4px 4px 0px #000000',
                          textTransform: 'uppercase'
                        }}
                      >
                        {gameStatus === 'gameover' ? 'RETRY RITUAL 💀' : 'BEGIN RITUAL ⛩️'}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* CLEAN MINIMALIST FOOTER */}
        <footer className="clean-footer">
          <div className="clean-footer-text">
            © 2026 Goryo Goose. All rights reserved.
          </div>
          <div className="clean-footer-links">
            <a href="https://twitter.com/GoryoGoose" target="_blank" rel="noopener noreferrer" className="clean-footer-link">X</a>
          </div>
        </footer>
      </div>
    </>
  );
}