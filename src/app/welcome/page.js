// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
"use client"
import React, { useState } from 'react';
import { ethers } from "ethers";
import Link from 'next/link';
import { contractABI, contractAddress } from '../../../utils/constants';

const Wal = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Wallet connect');

    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setDefaultAccount(accounts[0]);
                setConnButtonText('connection success');
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage('Please install MetaMask ');
        }
    };

    return (

        <div className='flex items-center justify-end min-h-screen bg-gradient-to-white from-white via-white to-white'>

    <div className='shadow-xl p-8 w-full max-w-2xl bg-gradient-to-r from-yellow-500 via-yellow-300 to-pink-500 text-white'>

     <h1 className="text-3xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>Welcome to Pawsome Fam!</h1>
     <h4 className="text-3xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Find Everything Your Pet Needs!</h4>
         <div className="grid grid-cols-3 gap-4">
             <button onClick={connectWalletHandler}
                     className="font-bold py-2 px-4 text-white shadow-lg focus:shadow-outline focus:outline-none transition duration-150 ease-in-out"
                     style={{ backgroundColor: 'yellow-500', hover: { backgroundColor: 'yellow-400' } }}>
                 {connButtonText}
             </button>
             <Link href="/listingpage" passHref className="text-white font-bold py-2 px-4 shadow-lg transition duration-150 ease-in-out text-center"
                   style={{ backgroundColor: 'yellow-500', hover: { backgroundColor: 'yellow-400' } }}>
                     Add Your Pawsome Stuff Here
             </Link>
             <Link href="/buying" passHref className="text-white font-bold py-2 px-4 shadow-lg transition duration-150 ease-in-out text-center"
                   style={{ backgroundColor: 'yellow-500', hover: { backgroundColor: 'yellow-400' } }}>
                 Checkout All The Pawsome Stuff
             </Link>
         </div>
         {defaultAccount && <p className="text-green-600 mt-4 text-center">Connected as {defaultAccount}</p>}
         {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
     </div>
 </div>

    );
}


export default Wal;
