import React, { useState } from 'react';
import { ethers } from 'ethers';
import constants from './constants';

const SupportUs = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSupport = async () => {
    if (!amount || isNaN(amount)) {
      setMessage('Please enter a valid amount.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
      const tx = await contract.support({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      setMessage('Thank you for your support!');
    } catch (error) {
      setMessage('Failed to send ethers. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="support-us">
      <h3 style={{ 
            fontFamily: 'Monotype Corsiva',
            fontSize: '3rem', // Adjust font size as needed
            color: '#556b2f', // Coral color
            textAlign: 'center', // Center align text
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
            margin: '20px 0', // Add margin for spacing
            }}>Support Us</h3>
      <p>
        Your contributions help us maintain and improve our platform. If you enjoy using our service,
        consider supporting us by sending ethers to the manager's address.
      </p>
      <p>
        You can also support us by giving your valuable feedback. We appreciate your input and strive to enhance your lottery experience.
      </p>
      <div className="form">
        <label htmlFor="amount">Amount (ETH):</label>
        <input type="number" id="amount" value={amount} onChange={handleAmountChange} />
        <button onClick={handleSupport}>Send</button>
      </div>
      <p className="message">{message}</p>
    </div>
  );
};

export default SupportUs;
