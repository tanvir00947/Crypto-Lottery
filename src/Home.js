import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import constants from './constants';
import PlayersList from './PlayersList';

function Home() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [contractInstance, setContractInstance] = useState(null);
    const [status, setStatus] = useState(false);
    const [winner,setWinner] = useState("");
    const [isWinner, setIsWinner] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [players, setPlayers] = useState([]);
    const [manager, setManager] = useState("");

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
                    setIsWinner(winner === address);
                    const owner = await contractIns.getManager();
                    setIsOwner(owner === address);
                    setManager(owner);  // Set the manager's address
                    const prizeClaimed = await contractIns.claimed();
                    setClaimed(prizeClaimed);
                    const playersList = await contractIns.getPlayers();
                    setPlayers(playersList);

                    // console.log("Status:", status);
                    // console.log("Winner:", winner);
                    // console.log("Owner:", owner);
                    // console.log("Claimed:", prizeClaimed);
                    // console.log("Players:", playersList);
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install MetaMask to use this application');
            }
        };

        loadBlockchainData();
    }, []);

    const enterLottery = async () => {
        const amountToSend = ethers.utils.parseEther('0.001');
        const tx = await contractInstance.enter({ value: amountToSend });
        await tx.wait();
    };

    const claimPrize = async () => {
        const tx = await contractInstance.claimPrize();
        await tx.wait();
        await contractInstance.resetLottery(); // Reset the lottery after claiming the prize
    };

    const resetLottery = async () => {
        const tx = await contractInstance.resetLottery();
        await tx.wait();
        setStatus(false);
        setIsWinner(false);
        setClaimed(false);
    };

    return (
        <div className="container">
            <div className="lottery-details">
            <h1 style={{ 
            fontFamily: 'Monotype Corsiva',
            fontSize: '3rem', // Adjust font size as needed
            color: '#556b2f', // Coral color
            textAlign: 'center', // Center align text
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
            margin: '20px 0', // Add margin for spacing
            }}>
            Crypto-Lottery
            </h1>


            <table >
                <thead>
                    <tr>
                    <th colSpan={2} style={{ textAlign: 'center' }}>Lottery Details</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Manager:</td>
                    <td>{manager.substring(0,5)}...{manager.substring(manager.length-6,manager.length-1)}</td>
                    </tr>
                    <tr>
                    <td>Total Amount:</td>
                    <td>{players.length * 0.001} ETH</td>
                    </tr>
                    <tr>
                    <td>Entry Amount:</td>
                    <td>0.001 ETH</td>
                    </tr>
                    <tr>
                    <td>Players Count:</td>
                    <td>{players.length}</td>
                    </tr>
                </tbody>
                </table>

                <div className="button-container">
                    {status ? (
                        isWinner ? (
                            <div>
                                {claimed ? (<p>Lottery has been sent to you, wait for the manager to Restart the Lottery.</p>):(
                                    <div>Congratualations!!! you are the winner <button className="claim-button" onClick={claimPrize}> Claim Prize </button></div>
                                )}
                                
                            </div>
                        ) : (
                            <div>
                            <p>{winner.substring(0,5)}...{winner.substring(winner.length-6,winner.length-1)} is the Winner of this lottery.</p>
                            <p>Try again in the next Lottery. Good Luck</p>
                            </div>
                            
                        )
                    ) : (
                        <button className="enter-button" onClick={enterLottery}> Enter Lottery </button>
                    )}
                </div>
                {/* {isOwner && claimed && (
                    <div className="button-container">
                        <button className="reset-button" onClick={resetLottery}> Reset Lottery </button>
                    </div>
                )} */}
            </div>
            <PlayersList players={players} />
        </div>
    );
}

export default Home;
