// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useState } from 'react'
import { ethers } from "ethers";
import './walletCard.css'
import { contractABI, contractAddress } from "./constants";

const { ethereum } = window;
const WalletCard = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = async () => {
		if (ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: "eth_requestAccounts" })
				.then(result => {
					accountChangedHandler(result[0]);
					setConnButtonText('Wallet Connected');
					console.log(result);
					//getAccountBalance(result[0]);
				})
				.catch(error => {
					setErrorMessage(error.message);

				});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = async (newAccount) => {
		setDefaultAccount(newAccount);
		await getAllTransactions()
		//getAccountBalance(newAccount.toString());
	}

	/*const getAccountBalance = (account) => {
		ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};*/

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}
	const createEthereumContract = () => {
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		//console.log("Contract Address:", contractAddress);  // Should be a valid Ethereum address
		//console.log("ABI:", JSON.stringify(contractABI, null, 2));  // Log the ABI structure

		const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
		console.log(transactionsContract);
		return transactionsContract;
		//return {provider,signer};
	};

	const getAllTransactions = async () => {
		const transactionsContract = createEthereumContract();
		const availableTransactions = await transactionsContract.getAllItems();
		console.log(availableTransactions);
	};

	// listen for account changes
	ethereum.on('accountsChanged', accountChangedHandler);

	ethereum.on('chainChanged', chainChangedHandler);

	return (
		<div>
			<div classNameName='walletCard'>
				<h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
				<button onClick={connectWalletHandler}>{connButtonText}</button>
				<div classNameName='accountDisplay'>
					<h3>Address: {defaultAccount}</h3>
				</div>
				<div classNameName='balanceDisplay'>
					<h3>Balance: {userBalance}</h3>
				</div>
				{errorMessage}
			</div>
			<div className="bg-white">
				<div>
					<div className="container mx-auto px-6 py-3">
						<div className="flex items-center justify-between">
							<div className="hidden w-full text-gray-600 md:flex md:items-center">
								<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.06298 10.063 6.27212 12.2721 6.27212C14.4813 6.27212 16.2721 8.06298 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16755 11.1676 8.27212 12.2721 8.27212C13.3767 8.27212 14.2721 9.16755 14.2721 10.2721Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.39409 5.48178 3.79417C8.90918 0.194243 14.6059 0.054383 18.2059 3.48178C21.8058 6.90918 21.9457 12.6059 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.97318 6.93028 5.17324C9.59603 2.3733 14.0268 2.26452 16.8268 4.93028C19.6267 7.59603 19.7355 12.0268 17.0698 14.8268Z" fill="currentColor" />
								</svg>
								<span className="mx-1 text-sm">NY</span>
							</div>
							<div className="w-full text-gray-700 md:text-center text-2xl font-semibold">
								Brand
							</div>
							<div className="flex items-center justify-end w-full">
								<button className="text-gray-600 focus:outline-none mx-4 sm:mx-0">
									<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
										<path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
									</svg>
								</button>

								<div className="flex sm:hidden">
									<button type="button" className="text-gray-600 hover:text-gray-500 focus:outline-none focus:text-gray-500" aria-label="toggle menu">
										<svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
											<path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>
						<nav className="sm:flex sm:justify-center sm:items-center mt-4">
							<div className="flex flex-col sm:flex-row">
								<a className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0" href="#">Home</a>
								<a className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0" href="#">Shop</a>
								<a className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0" href="#">Categories</a>
								<a className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0" href="#">Contact</a>
								<a className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0" href="#">About</a>
							</div>
						</nav>
						<div className="relative mt-6 max-w-lg mx-auto">
							<span className="absolute inset-y-0 left-0 pl-3 flex items-center">
								<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
									<path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>

							<input className="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:shadow-outline" type="text" placeholder="Search" />
						</div>
					</div>
				</div>
				<div className="fixed right-0 top-0 max-w-xs w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300">
					<div className="flex items-center justify-between">
						<h3 className="text-2xl font-medium text-gray-700">Your cart</h3>
						<button className="text-gray-600 focus:outline-none">
							<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
						</button>
					</div>
					<div className="my-3">
						<div className="flex justify-between mt-6">
							<div className="flex">
								<img className="h-20 w-20 object-cover rounded" src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80" alt="" />
								<div className="mx-3">
									<h3 className="text-sm text-gray-600">Mac Book Pro</h3>
									<div className="flex items-center mt-2">
										<button className="text-gray-500 focus:outline-none focus:text-gray-600">
											<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										</button>
										<span className="text-gray-700 mx-2">2</span>
										<button className="text-gray-500 focus:outline-none focus:text-gray-600">
											<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										</button>
									</div>
								</div>
							</div>
							<span className="text-gray-600">20$</span>
						</div>
						<div className="flex justify-between mt-6">
							<div className="flex">
								<img className="h-20 w-20 object-cover rounded" src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80" alt="" />
								<div className="mx-3">
									<h3 className="text-sm text-gray-600">Mac Book Pro</h3>
									<div className="flex items-center mt-2">
										<button className="text-gray-500 focus:outline-none focus:text-gray-600">
											<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										</button>
										<span className="text-gray-700 mx-2">2</span>
										<button className="text-gray-500 focus:outline-none focus:text-gray-600">
											<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										</button>
									</div>
								</div>
							</div>
							<span className="text-gray-600">20$</span>
						</div>
						<div className="flex justify-between mt-6">
							<div className="flex">
								<img className="h-20 w-20 object-cover rounded" src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80" alt="" />
								<div className="mx-3">
									<h3 className="text-sm text-gray-600">Mac Book Pro</h3>
									<div className="flex items-center mt-2">
										<button className="text-gray-500 focus:outline-none focus:text-gray-600">
											<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										</button>
										<span className="text-gray-700 mx-2">2</span>
										<button className="text-gray-500 focus:outline-none focus:text-gray-600">
											<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										</button>
									</div>
								</div>
							</div>
							<span className="text-gray-600">20$</span>
						</div>
						<div className="mt-8">
							<form className="flex items-center justify-center">
								<input className="form-input w-48" type="text" placeholder="Add promocode">
									<input type="button" className="ml-3 flex items-center px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500" />
									<span>Apply</span>
								</input>
							</form>
						</div>
						<a className="flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
							<span>Chechout</span>
							<svg className="h-5 w-5 mx-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
						</a>
					</div>
					<main className="my-8">
						<div className="container mx-auto px-6">
							<div className="h-64 rounded-md overflow-hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1577655197620-704858b270ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1280&q=144')">
								<div className="bg-gray-900 bg-opacity-50 flex items-center h-full">
									<div className="px-10 max-w-xl">
										<h2 className="text-2xl text-white font-semibold">Sport Shoes</h2>
										<p className="mt-2 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore facere provident molestias ipsam sint voluptatum pariatur.</p>
										<button className="flex items-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
											<span>Shop Now</span>
											<svg className="h-5 w-5 mx-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
										</button>
									</div>
								</div>
							</div>
							<div className="md:flex mt-8 md:-mx-4">
								<div className="w-full h-64 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:w-1/2" style="background-image: url('https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80')">
									<div className="bg-gray-900 bg-opacity-50 flex items-center h-full">
										<div className="px-10 max-w-xl">
											<h2 className="text-2xl text-white font-semibold">Back Pack</h2>
											<p className="mt-2 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore facere provident molestias ipsam sint voluptatum pariatur.</p>
											<button className="flex items-center mt-4 text-white text-sm uppercase font-medium rounded hover:underline focus:outline-none">
												<span>Shop Now</span>
												<svg className="h-5 w-5 mx-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
											</button>
										</div>
									</div>
								</div>
								<div className="w-full h-64 mt-8 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:mt-0 md:w-1/2" style="background-image: url('https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')">
									<div className="bg-gray-900 bg-opacity-50 flex items-center h-full">
										<div className="px-10 max-w-xl">
											<h2 className="text-2xl text-white font-semibold">Games</h2>
											<p className="mt-2 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore facere provident molestias ipsam sint voluptatum pariatur.</p>
											<button className="flex items-center mt-4 text-white text-sm uppercase font-medium rounded hover:underline focus:outline-none">
												<span>Shop Now</span>
												<svg className="h-5 w-5 mx-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-16">
								<h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
								<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">Chanel</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">Man Mix</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">classNameic watch</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=345&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">woman mix</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-16">
								<h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
								<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">Chanel</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">Man Mix</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">classNameic watch</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
									<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
										<div className="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=345&q=80')">
											<button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
												<svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											</button>
										</div>
										<div className="px-5 py-3">
											<h3 className="text-gray-700 uppercase">woman mix</h3>
											<span className="text-gray-500 mt-2">$12</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>

					<footer className="bg-gray-200">
						<div className="container mx-auto px-6 py-3 flex justify-between items-center">
							<a href="#" className="text-xl font-bold text-gray-500 hover:text-gray-400">Brand</a>
							<p className="py-2 text-gray-500 sm:py-0">All rights reserved</p>
						</div>
					</footer>
				</div>
			</div>
			</div>
				);
}

	export default WalletCard;