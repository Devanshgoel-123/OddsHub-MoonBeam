"use client";
import { NextPage } from "next";
import "./styles.scss";
import { useState } from "react";
import { MetaMaskButton,useAccount,useSDK,useSignMessage } from "@metamask/sdk-react-ui";

import WalletModal from "./WalletModal";

interface Props {}

const ConnectWallet: NextPage<Props> = ({}) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const handleOpen = () => setOpenWalletModal(true);
  const handleClose = () => {
    setOpenWalletModal(false);
  };
  return (
    <>
      <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
     
    </>
  );
};

export default ConnectWallet;
