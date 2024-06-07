import React from 'react';

function PlayersList({ players }) {
    return (
        <div className="players-list">
            <h2 style={{ 
            fontFamily: 'Monotype Corsiva',
            fontSize: '3rem', // Adjust font size as needed
            color: '#556b2f', // Coral color
            textAlign: 'center', // Center align text
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
            margin: '20px 0', // Add margin for spacing
            }}>Players List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={index}>
                            <td>{player.substring(0,5)}...{player.substring(player.length-6,player.length-1)}</td>
                            <td>0.001 ETH</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PlayersList;
