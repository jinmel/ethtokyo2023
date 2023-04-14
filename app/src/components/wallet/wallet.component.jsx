import React, { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import './wallet.styles.scss';

import { ReactComponent as MetamaskLogo } from '../../assets/icons/metamask-icon.svg';

function Wallet() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        alert('Please install Metamask to use this dApp!');
        return;
      }
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }

    async function getEthereumInfo() {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({ method: 'eth_accounts' });
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [accounts[0]],
        });
        setBalance(parseFloat(balance) / 1e18);
      }
    }

    getEthereumInfo();
  };

  const disconnectWallet = () => {
    setAccount('');
    setBalance('');
  };

  return (
    <div className='nav-wallet-container'>
      <div className='nav-wallet'>
        <p>{account}</p>
        <p>{balance}</p>
        <MetamaskLogo className='metamask-logo' />
        {!account && <button onClick={connectWallet}>Connect Wallet</button>}
        {account && (
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        )}
      </div>
    </div>
  );
}

export default Wallet;
