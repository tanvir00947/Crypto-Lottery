import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers library
import constants from './constants'; // Import constants object
import Home from './Home';
import Manager from './Manager';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Rules from './Rules';
import SmartContract from './smartContract';
import SupportUs from './SupportUs';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setCurrentAccount(address);

          const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
          const owner = await contractIns.getManager();
          setIsOwner(owner === address);
        } catch (err) {
          console.error(err);
        }
      } else {
        alert('Please install MetaMask to use this application');
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isOwner && (
              <li>
                <Link to="/Manager">Manager</Link>
              </li>
            )}
            <li>
              <Link to="/Rules">Rules</Link>
            </li>
            <li>
              <Link to="/SmartContract">Smart Contract</Link>
            </li>
            <li>
              <Link to="/SupportUs">Support Us</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/Manager" element={<Manager />} />
          <Route path="/" element={<Home />} />
          <Route path="/Rules" element={<Rules />} />
          <Route path="/SmartContract" element={<SmartContract/>} />
          <Route path='/SupportUs' element={<SupportUs/>}/>
        </Routes>
        <footer className="footer-container">
            <div className="about-us">
                <h3>About Crypto-Lottery</h3>
                <p>
                    Welcome to Crypto-Lottery, your premier platform for fair and transparent lottery experiences built on the Ethereum blockchain. We leverage the power of blockchain technology to provide a secure and tamper-proof lottery system that ensures every participant has an equal chance of winning.
                    Our platform utilizes smart contracts to automate and verify all lottery operations, eliminating the need for intermediaries and minimizing the risk of fraud. By harnessing the transparency and immutability of the Ethereum blockchain, we are committed to upholding the highest standards of integrity and security.
                    Whether you are a seasoned lottery enthusiast or a newcomer, our user-friendly interface and straightforward processes make it easy for you to participate. Join us today and embark on an exciting journey filled with transparency, trust, and the thrill of winning!
                </p>
                <p>
                    This lottery is deployed on the Sepolia test network, ensuring a secure and reliable environment for testing and development purposes.
                </p>
            </div>
            <div className="contact-info">
                <h3>Contact Us</h3>
                <ul>
                    <li>Email: tanvirulislamqv@gmail.com</li>
                    <li>Phone: +1 (123) 456-7890</li>
                </ul>
            </div>
            <div className="copyright">
                <p>&copy; {new Date().getFullYear()} Crypto-Lottery. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
