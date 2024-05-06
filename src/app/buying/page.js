"use client"
import React, { useEffect, useState } from 'react';
import { contractABI, contractAddress } from '../../../utils/constants';
import { ethers } from 'ethers';

const PetMarketplace = () => {
    const [product, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const product = await contract.getAllItems();
            console.log();
            const itemsFormatted = product.map(item => ({
                id: item.id.toNumber(),
                title: item.title,
                imageHash: item.imageHash,
                price: ethers.utils.formatEther(item.price),
                sold: item.sold,
                description: item.description
            }));
            setItems(itemsFormatted);
         };

        fetchItems();
    }, []);
    
    const handleCardClick = (item) => {
        if (!item.sold) {
            // Using window.location for simplicity; replace with your router's navigation logic if using React Router, Next.js, etc.
            console.log(item?.price);
            window.location.href = `/item_details?title=${encodeURIComponent(item.title)}&imageHash=${encodeURIComponent(item.imageHash)}&price=${encodeURIComponent(item.price)}&sold=${item.sold}&description=${encodeURIComponent(item.description)}&id=${item.id}`;
        }
    };

    return (
        <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-pink-300 via-pink-200 to-white">
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-pink-500 mb-6" style={{ fontFamily: 'Lobster, cursive' }}>Items for your pets</h1>
        <div className="grid grid-cols-3 gap-4">
            {product.map((item) => (
                <div key={item.id} 
                     className={`relative bg-white rounded-lg shadow-lg p-4 ${item.sold ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-pink-100'}`}
                     onClick={() => handleCardClick(item)}>
                    <img src={`https://gateway.pinata.cloud/ipfs/${item.imageHash}`} alt={item.title} className="rounded w-full h-64 object-cover" />
                    <h5 className="text-pink-800 text-xl leading-tight font-bold mt-2" style={{ fontFamily: 'Verdana, sans-serif' }}>{item.title}</h5>
                    <p className="text-pink-600">{item.price}</p>
                    {item.sold && <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center font-bold text-pink-500 text-xl" style={{ backgroundColor: 'rgba(255, 192, 203, 0.5)' }}>item sold</div>}
                </div>
            ))}
        </div>
    </div>
</div>


    );
};

export default PetMarketplace;
