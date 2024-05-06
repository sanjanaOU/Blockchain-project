import { ethers } from 'ethers';

export const connect_W = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.JsonRpcProvider(); // Use JsonRpcProvider instead of Web3Provider
            const signer = provider.getSigner();
            console.log("Connected Account:", await signer.getAddress());
            return signer;
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            throw error;
        }
    } else {
        console.log('Please install MetaMask!');
        alert('Metamask not working');
    }
};
