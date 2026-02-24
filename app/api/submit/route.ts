// app/api/submit/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, twitterHandle, ip } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'NO_WALLET' }, { status: 400 });
    }

    // 1. CHECK WALLET BALANCE (Min 0.001 ETH)
    // Fetching from Ethereum Public RPC
    const rpcResponse = await fetch('https://cloudflare-eth.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
        id: 1
      })
    });

    const rpcData = await rpcResponse.json();
    
    if (rpcData.error) {
       return NextResponse.json({ error: 'INVALID_WALLET' }, { status: 400 });
    }

    const balanceHex = rpcData.result;
    
    // Convert hex to BigInt (Wei)
    const balanceWei = BigInt(balanceHex);
    
    // 0.001 ETH = 1,000,000,000,000,000 Wei
    const minBalanceWei = BigInt(1000000000000000); 

    if (balanceWei < minBalanceWei) {
      return NextResponse.json({ 
        error: 'FARMER_DETECTED', 
        message: 'Insufficient balance. The spirits demand a funded wallet.' 
      }, { status: 403 });
    }

    // 2. SEND TO GOOGLE SCRIPT (Your webhook URL is now hidden on the server)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlVcahYRzevuMG2-ha091uENfm560-fFy-dy18tRwG-yQvSz7QTUcy_DhoaLhMRkgo/exec';
    
    // Using no-cors here is tricky on the server-side fetch to a macro, 
    // usually we don't need mode: 'no-cors' in a Node environment.
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "GTD_WINNER",
        address: `[@${twitterHandle}] [GTD WINNER] ${walletAddress}`,
        ip: ip
      }),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Submit API Error:", error);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}