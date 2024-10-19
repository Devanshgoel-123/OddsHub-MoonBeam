import { ConnectKitButton } from "connectkit";
import './styles.scss'; 

const WalletConnectButton = () => {

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <button onClick={show}
           className={isConnected ? "wallet-connected-btn" : "wallet-connect-btn"} 
          >
            {isConnected ? address : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default WalletConnectButton;