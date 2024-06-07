import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import constants from './constants';
import PlayersList from './PlayersList';

function Home() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [contractInstance, setContractInstance] = useState(null);
    const [status, setStatus] = useState(false);
    const [winner, setWinner] = useState("");
    const [isWinner, setIsWinner] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [players, setPlayers] = useState([]);
    const [manager, setManager] = useState("");
    const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);

    const [loadingManager, setLoadingManager] = useState(true);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [loadingWinner, setLoadingWinner] = useState(true);
    const [loadingClaimed, setLoadingClaimed] = useState(true);

    useEffect(() => {
        const loadBlockchainData = async () => {
            let provider;
            if (typeof window.ethereum !== 'undefined') {
                // MetaMask is available
                provider = new ethers.providers.Web3Provider(window.ethereum);
                setMetaMaskInstalled(true);
                try {
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCurrentAccount(address);
                    window.ethereum.on('accountsChanged', (accounts) => {
                        setCurrentAccount(accounts[0]);
                    });
                    provider = signer; // use the signer for actions requiring user interaction
                } catch (err) {
                    console.error(err);
                }
            } else {
                // MetaMask is not available, use Infura
                provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/afae28b7906e4634b267f00ca8c9e75e');
                setMetaMaskInstalled(false);
            }

            const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, provider);
            setContractInstance(contractIns);

            try {
                const status = await contractIns.isComplete();
                setStatus(status);
                setLoadingStatus(false);
                const winner = await contractIns.getWinner();
                setWinner(winner);
                setIsWinner(winner === currentAccount);
                setLoadingWinner(false);
                const owner = await contractIns.getManager();
                setIsOwner(owner === currentAccount);
                setManager(owner);  // Set the manager's address
                setLoadingManager(false);
                const prizeClaimed = await contractIns.claimed();
                setClaimed(prizeClaimed);
                setLoadingClaimed(false);
                const playersList = await contractIns.getPlayers();
                setPlayers(playersList);
                setLoadingPlayers(false);
            } catch (err) {
                console.error(err);
            }
        };

        loadBlockchainData();
    }, [currentAccount]);

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
                    fontSize: '3rem', 
                    color: '#2c4820', 
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', 
                    margin: '20px 0',
                }}>
                    Crypto-Lottery
                </h1>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2} style={{ textAlign: 'center' }}>Lottery Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Manager:</td>
                            <td>{loadingManager ? "Loading..." : `${manager.substring(0, 5)}...${manager.substring(manager.length - 6, manager.length - 1)}`}</td>
                        </tr>
                        <tr>
                            <td>Total Amount:</td>
                            <td>{loadingPlayers ? "Loading..." : `${players.length * 0.001} ETH`}</td>
                        </tr>
                        <tr>
                            <td>Entry Amount:</td>
                            <td>0.001 ETH</td>
                        </tr>
                        <tr>
                            <td>Players Count:</td>
                            <td>{loadingPlayers ? "Loading..." : players.length}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="button-container">
                    {loadingStatus ? (
                        <p>Loading status...</p>
                    ) : status ? (
                        isWinner ? (
                            <div>
                                {loadingClaimed ? (
                                    <p>Loading claim status...</p>
                                ) : claimed ? (
                                    <p>Lottery has been sent to you, wait for the manager to Restart the Lottery.</p>
                                ) : (
                                    <div>Congratulations!!! You are the winner <button className="claim-button" onClick={claimPrize}> Claim Prize </button></div>
                                )}
                            </div>
                        ) : (
                            <div>
                                {loadingWinner ? (
                                    <p>Loading winner...</p>
                                ) : (
                                    <>
                                        <p>{winner.substring(0, 5)}...{winner.substring(winner.length - 6, winner.length - 1)} is the Winner of this lottery.</p>
                                        <p>Try again in the next Lottery. Good Luck</p>
                                    </>
                                )}
                            </div>
                        )
                    ) : (
                        <div>
                        {metaMaskInstalled ? (
                                <button className="enter-button" onClick={enterLottery}> Enter Lottery </button>
                            ) : (
                                <p>Please install and connect MetaMask to participate in this Lottery</p>
                            )}
                        </div>
                        )}
                        
                </div>
            </div>
            <PlayersList players={players} />
        </div>
    );
}

export default Home;
