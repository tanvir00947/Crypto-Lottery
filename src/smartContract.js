import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose different themes

const SmartContract = () => {
    const codeString = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable public winner;
    bool public isComplete;
    bool public claimed;

    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function status() public view returns (bool) {
        return isComplete;
    }

    function enter() public payable {
        require(msg.value >= 0.001 ether, "Minimum entry is 0.001 ether");
        require(!isComplete, "Lottery is already complete");
        players.push(payable(msg.sender));
    }

    function pickWinner() public restricted {
        require(players.length > 0, "No players in the lottery");
        require(!isComplete, "Lottery is already complete");
        winner = players[randomNumber() % players.length];
        isComplete = true;
    }

    function claimPrize() public {
        require(msg.sender == winner, "Only the winner can claim the prize");
        require(isComplete, "Lottery is not complete");
        require(!claimed, "Prize already claimed");
        winner.transfer(address(this).balance);
        claimed = true;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }

    function resetLottery() public restricted {
        require(isComplete, "Lottery is not complete");
        require(claimed, "Prize has not been claimed yet");
        delete players;
        winner = payable(address(0));
        isComplete = false;
        claimed = false;
    }
}
    `;

    return (
        <div style={{ padding: '20px', margin: '20px auto', maxWidth: '800px', backgroundColor: '#B5C38E', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ 
            fontFamily: 'Monotype Corsiva',
            fontSize: '3rem', // Adjust font size as needed
            color: '#556b2f', // Coral color
            textAlign: 'center', // Center align text
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
            margin: '20px 0', // Add margin for spacing
            }}>Smart Contract Code</h2>
            <div style={{ backgroundColor: 'black', padding: '20px', borderRadius: '8px' }}>
                <SyntaxHighlighter language="solidity" style={vscDarkPlus} customStyle={{ backgroundColor: 'black' }}>
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

export default SmartContract;
