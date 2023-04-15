import React, { useState } from 'react';
import MetaMaskSDK from '@metamask/sdk'
import { login } from '../../api/authentication/login.ts'

import './wallet.styles.scss';

import { ReactComponent as MetamaskLogo } from '../../assets/icons/metamask-icon.svg';

const options = {
  injectProvider: false,
  communicationLayerPreference: 'webrtc',
}

const MMSDK = new MetaMaskSDK(options)
const ethereum = MMSDK.getProvider()


function Wallet() {
  const [account, setAccount] = useState('');
  const connectWallet = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(accounts[0]);
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  return (
    <div className='nav-wallet-container'>
      <div className='nav-wallet'>
        <p>{account}</p>
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
