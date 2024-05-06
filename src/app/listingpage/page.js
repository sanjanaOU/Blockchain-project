"use client"
import { ethers } from 'ethers';
import axios from 'axios';
import { contractABI, contractAddress } from '../../../utils/constants';
import React, { useState, useRef } from 'react';


const Wal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null); // Reference to the file input
    const [transaction,setTransaction]=useState('');

    const onImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImageToPinata = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key':'8822677bb39584ae8da8',
                    'pinata_secret_api_key': 'd5d224987d086b11fe589aaa88d9285d05c97b376288fba50cc9f47f444d2ef8',
                },
            });
            return response.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading image to Pinata: ', error);
            setErrorMessage('Failed to upload image to Pinata.');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('MetaMask is not detected.');
            return;
        }

        setIsLoading(true);
        const ipfsHash = await uploadImageToPinata(image);
        if (!ipfsHash) {
            setIsLoading(false);
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);
            const transaction = await marketplaceContract.listItem(title, description, ipfsHash, ethers.utils.parseUnits(price, 'ether'));
            await transaction.wait();
            const receipt =await transaction.wait();
            setTransaction(receipt.transactionHash);
            setSuccessMessage('Item listed successfully!');
            setTitle('');
            setDescription('');
            setPrice('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Properly clear the file input
            }
            setTimeout(() => { setSuccessMessage(''); }, 3000);
        } catch (error) {
            console.error('Error processing transaction: ', error);
            setErrorMessage('Transaction failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-start justify-end h-screen bg-gradient-to-r from-pink-700 to-white'>
    <div className='bg-white shadow-xl p-6 w-full max-w-2xl'>  {/* Adjusted max-width and removed rounded corners */}
        {successMessage && (
            <div className="success bg-pink-500 text-white p-4 mb-4 text-center font-bold">
                {successMessage}
            </div>
        )}
        <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">Find ideal stuff for your pet today!</h2>
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
                <label htmlFor="image-upload" className="block text-purple-800 font-bold mb-2">Upload pawsome stuff</label>
                <input type="file" ref={fileInputRef} onChange={onImageChange} className="bg-white appearance-none border-2 border-purple-200 w-full py-2 px-4 text-purple-900 leading-tight focus:outline-none focus:bg-white focus:border-pink-500"/>
            </div>
            <div className="mb-4">
                <label className="block text-purple-800 font-bold mb-2" htmlFor="item-title">Name</label>
                <input type="text" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)}
                       className="bg-white appearance-none border-2 border-purple-200 w-full py-2 px-3 text-purple-900 leading-tight focus:outline-none focus:bg-white focus:border-pink-500" placeholder="Item Title" required />
            </div>
            <div className="mb-4">
                <label className="block text-purple-800 font-bold mb-2" htmlFor="item-description">Details</label>
                <textarea id="item-description" value={description} onChange={(e) => setDescription(e.target.value)}
                          className="bg-white appearance-none border-2 border-purple-200 w-full py-2 px-3 text-purple-900 leading-tight focus:outline-none focus:bg-white focus:border-pink-500" placeholder="Item Description" required />
            </div>
            <div className="mb-6">
                <label className="block text-purple-800 font-bold mb-2" htmlFor="item-price">Price (ETH)</label>
                <input type="text" id="item-price" value={price} onChange={(e) => setPrice(e.target.value)}
                       className="bg-white appearance-none border-2 border-purple-200 w-full py-2 px-3 text-purple-900 leading-tight focus:outline-none focus:bg-white focus:border-pink-500" placeholder="Price in ETH" required />
            </div>
            <div className="flex justify-center">
                <button type="submit"
                        disabled={isLoading}
                        className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 ${isLoading ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-400 text-white'}`}>
                    {isLoading ? 'Processing...' : 'List Item'}
                </button>
                {<p className ="text-red-200 text-center mt-4">{transaction}</p>}
            </div>
            {errorMessage && <p className="error text-red-500 text-center mt-4">{errorMessage}</p>}
        </form>
    </div>
</div>


    );
};

export default Wal;
