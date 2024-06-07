import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import constants from './constants';

function Manager() {
    const [owner, setOwner] = useState('');
    const [contractInstance, setContractInstance] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [isOwner, setIsOwner] = useState(false); // Define isOwner state

    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState(false);
    const [claimed, setClaimed] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCurrentAccount(address);
                    window.ethereum.on('accountsChanged', (accounts) => {
                        setCurrentAccount(accounts[0]);
                    });

                    const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
                    setContractInstance(contractIns);
                    
                    const status = await contractIns.isComplete();
                    setStatus(status);
                    const winner = await contractIns.getWinner();
                    setWinner(winner);
                    const owner = await contractIns.getManager();
                    setOwner(owner);
                    setIsOwner(owner === address); // Set isOwner to true if the current account is the manager
                    const prizeClaimed = await contractIns.claimed();
                    setClaimed(prizeClaimed);
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install MetaMask to use this application');
            }
        };

        loadBlockchainData();
    }, []);

    const pickWinner = async () => {
        const tx = await contractInstance.pickWinner();
        await tx.wait();
    };

    const resetLottery = async () => {
        const tx = await contractInstance.resetLottery();
        await tx.wait();
        setStatus(false);
        setWinner('');
        setClaimed(false);
    };

    return (
        <div className='container'>
            <h1 style={{ 
            fontFamily: 'Monotype Corsiva',
            fontSize: '3rem', // Adjust font size as needed
            color: '#556b2f', // Coral color
            textAlign: 'center', // Center align text
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
            margin: '20px 0', // Add margin for spacing
            }}>Manager Page</h1>
            <div className='button-container'>
                {status ? (
                    <div>
                        <p>Lottery Winner is: {winner.substring(0,5)}...{winner.substring(winner.length-6,winner.length-1)}</p>
                        {isOwner && claimed && (
                            <button className="enter-button" onClick={resetLottery}> Reset Lottery </button>
                        )}
                    </div>
                ) : (
                    isOwner ? (
                        <button className="enter-button" onClick={pickWinner}> Pick Winner </button>
                    ) : (
                        <p>You are not the owner</p>
                    )
                )}
            </div>
        </div>
    );
}

export default Manager;
