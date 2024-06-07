import React from 'react';

const Rules = () => {
    return (
        <div className="rules-container">
            <h2 style={{ 
            fontFamily: 'Monotype Corsiva',
            fontSize: '3rem', // Adjust font size as needed
            color: '#556b2f', // Coral color
            textAlign: 'center', // Center align text
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
            margin: '20px 0', // Add margin for spacing
            }}>Lottery Rules</h2>
            <ul>
                <li>Participants must be of legal age to participate in the lottery.</li>
                <li>Each participant can enter the lottery by sending a minimum of 0.001 ether to the smart contract.</li>
                <li>The lottery will continue until the manager decides to pick a winner.</li>
                <li>The winner will be selected randomly from all eligible participants using a verifiable random function.</li>
                <li>The selected winner will receive the entire prize pool.</li>
                <li>The winner must claim the prize manually by calling the `Claim Prize` Button.</li>
                <li>After the prize is claimed, the lottery will be reset for the next round.</li>
                <li>All lottery operations and results are recorded on the Ethereum blockchain, ensuring transparency and immutability.</li>
                <li>Participants can verify lottery entries and results by inspecting blockchain transactions and smart contract data.</li>
                <li>Participants are responsible for ensuring compliance with relevant laws and regulations in their jurisdiction.</li>
            </ul>
        </div>
    );
}

export default Rules;
