'use client';

import './globals.css';
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmited, setHasSubmited] = useState<boolean>(false);

  const [questFollow, setQuestFollow] = useState<boolean>(false);
  const [questLikeRT, setQuestLikeRT] = useState<boolean>(false);

  
  useEffect(() => {
    const checkStatus = async () => {
      
      const localCheck = localStorage.getItem('goryo_submited');
      if (localCheck === 'true') {
        setHasSubmited(true);
        return;
      }

      
      if (session?.user?.name) {
        try {
          const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlVcahYRzevuMG2-ha091uENfm560-fFy-dy18tRwG-yQvSz7QTUcy_DhoaLhMRkgo/exec';
          const res = await fetch(`${SCRIPT_URL}?checkUser=${encodeURIComponent(session.user.name)}`);
          const result = await res.json();
          
          if (result.exists) {
            localStorage.setItem('goryo_submited', 'true');
            setHasSubmited(true);
          }
        } catch (err) {
          console.error("Spirits are busy checking the book...");
        }
      }
    };

    checkStatus();
  }, [session]);

  const handleFollowClick = () => {
    window.open('https://twitter.com/intent/follow?screen_name=GoryoGoose', '_blank', 'width=550,height=450');
    setTimeout(() => setQuestFollow(true), 2000);
  };

  const handleLikeRTClick = () => {
    const tweetId = '2024519345146060814';
    window.open(`https://twitter.com/intent/retweet?tweet_id=${tweetId}`, '_blank', 'width=550,height=450');
    setTimeout(() => setQuestLikeRT(true), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || questFollow === false || questLikeRT === false) return;
    
    setIsSubmitting(true);
    setStatusMessage('Verifying with the spirits...');

    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();

      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLOdEwLRlw5udfZCn9D8v-YchDIjb_bzmhIb0I7pExmr2LBGttnODSTvoTDBQkht8G/exec';

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: session.user?.name,
          address: walletAddress,
          ip: ipData.ip
        }),
      });

      localStorage.setItem('goryo_submited', 'true');
      setHasSubmited(true);
      setStatusMessage('');
      
    } catch (error) {
      console.error(error);
      setStatusMessage('❌ Connection error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="overlay"></div>

      <div className="content-box">
        <img src="/logo.png" alt="Goryo Goose" className="logo" />
        
        {hasSubmited ? (
          <div className="congrats-section">
            <h1 className="title">CONGRATULATIONS!</h1>
            <div className="success-badge">🔥 YOUR ADDRESS SUBMITTED 🔥</div>
            <p className="subtitle" style={{marginTop: '20px'}}>
              Welcome to the legion, <span className="handle">{session?.user?.name}</span>. 
              The spirits have recorded your soul.
            </p>
            <button onClick={() => signOut()} className="pixel-button logout-btn">Disconnect</button>
          </div>
        ) : (
          <>
            <h1 className="title">Whitelist Submission</h1>
            <p className="subtitle">The resurrection of 3333 Goryo Goose.</p>

            {!session ? (
              <div className="twitter-section">
                {status === 'loading' ? <p className="status-message">Loading...</p> : (
                  <button onClick={() => signIn('twitter')} className="pixel-button twitter-btn">🐦 Connect X</button>
                )}
              </div>
            ) : (
              <div className="unlocked-content">
                <div className="twitter-connected">
                  <p>✅ Connected: <span className="handle">{session.user?.name}</span></p>
                </div>

                <div className="quest-container">
                  <h2 className="quest-title">Mandatory Quests</h2>
                  <div className="quest-item">
                    <span className="quest-name">1. Follow @GoryoGoose</span>
                    {questFollow ? <span className="quest-done">✅ DONE</span> : <button onClick={handleFollowClick} className="pixel-button quest-btn">GO</button>}
                  </div>
                  <div className="quest-item">
                    <span className="quest-name">2. Like & RT Pinned</span>
                    {questLikeRT ? <span className="quest-done">✅ DONE</span> : <button onClick={handleLikeRTClick} className="pixel-button quest-btn">GO</button>}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="wallet-form">
                  <div className="input-group">
                    <label>Ethereum Address</label>
                    <input type="text" placeholder="0x..." value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} disabled={isSubmitting || !questFollow || !questLikeRT} />
                  </div>
                  {statusMessage && <p className="status-message warning">{statusMessage}</p>}
                  <button type="submit" className="pixel-button submit-btn" disabled={isSubmitting || !questFollow || !questLikeRT}>
                    {isSubmitting ? 'PROCESSING...' : (questFollow && questLikeRT ? '🔥 SUBMIT WALLET 🔥' : '🔒 COMPLETE QUESTS')}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
      <div className="footer">© 2026 Goryo Goose.</div>
    </div>
  );
}