import { enqueueSnackbar } from "notistack";
import { contractAddress, ConversionToUsd } from "../helpers/constants";
import { abi } from "../../abi/FPMMMarket.json";
import { useEffect, useState } from "react";
import useGetMinAmountOnSellShares from "./useGetMinAmountOnSellShares";
import axios from "axios";
import { useAccount } from "wagmi";
import { readContract, writeContract } from '@wagmi/core';
import { config } from "../Web3provider";
import { parseEther } from "viem";

type TransactionStatus = {
  pending: boolean;
  error: boolean;
  hash: string;
};

interface ToastConfig {
  message: string;
  subHeading: string;
  type: 'info' | 'success' | 'error';
  hash?: string;
}

const showToast = ({ message, subHeading, type, hash }: ToastConfig) => {
  enqueueSnackbar(message, {
    //@ts-ignore
    variant: "custom",
    subHeading,
    hash,
    type,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
  });
};

const useFPMMSellShare = (
  marketId: number,
  betAmount: string,
  choice: number,
  isBuying: boolean
) => {
  const { address } = useAccount();
  const [userMarketShare, setUserMarketShare] = useState("");
  const [updatedShares, setUpdatedShares] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    pending: false,
    error: false,
    hash: ""
  });

  const amountInUsd = (Number(betAmount) * ConversionToUsd).toString();
  
  const { minAmountSell } = useGetMinAmountOnSellShares(
    marketId,
    betAmount,
    choice,
    6,
    isBuying
  );

  // Fetch user market share
  useEffect(() => {
    const fetchUserMarketShare = async () => {
      if (!marketId || !address || isBuying) return;

      try {
        const response = await readContract(config, {
          abi,
          address: contractAddress,
          functionName: 'getUserMarketShare',
          args: [address, marketId, choice],
        });

        if (response !== undefined) {
          setUserMarketShare(String(response));
        }
      } catch (error) {
        console.error("Error fetching market share:", error);
      }
    };

    fetchUserMarketShare();
  }, [marketId, address, choice, isBuying]);

  // Update shares in the database
  const updateShares = async () => {
    if (updatedShares || !marketId || !betAmount) return;
    
    try {
      await axios.post(`${process.env.SERVER_URL}/update-market`, {
        marketId,
        outcomeIndex: choice,
        amount: (Number(amountInUsd)*10**6).toString(),
        isBuy: false,
        sharesUpdated: Number(minAmountSell),
      });
      setUpdatedShares(true);
    } catch (error) {
      console.error("Error updating market:", error);
    }
  };

  const SellMarketShares = async () => {
    if (!marketId || betAmount==="") return;
    if(Number(betAmount)>0.001){
      alert("Please input a lesser Amount")
      return;
    }
    setTxStatus({ ...txStatus, pending: true, error: false });
    
    try {
      const txHash = await writeContract(config, {
        abi,
        address: contractAddress,
        functionName: "sell",
        args: [
          marketId, 
          parseEther(betAmount),
          choice,
          minAmountSell
        ]
      });

      setTxStatus({
        pending: false,
        error: false,
        hash: txHash
      });
      
      return txHash;
    } catch (err) {
      console.error("Error placing bet:", err);
      setTxStatus({
        pending: false,
        error: true,
        hash: ""
      });
    }
  };


  useEffect(() => {
    if (!marketId || !address || isBuying) return;

    const { pending, error, hash } = txStatus;

    if (pending) {
      showToast({
        message: "Transaction Pending",
        subHeading: "Your transaction is being processed, please wait for a few seconds.",
        type: "info",
        hash
      });
    } else if (error) {
      showToast({
        message: "Oh shoot!",
        subHeading: "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
        type: "error"
      });
    } else if (hash) {
      showToast({
        message: "Prediction Placed Successfully!",
        subHeading: "Watch out for the results in section. PS - All the best for this and your next prediction.",
        type: "success",
        hash
      });
      updateShares();
    }
  }, [txStatus, marketId, address, isBuying]);

  return {
    minAmountSell,
    SellMarketShares,
    userMarketShare
  };
};

export default useFPMMSellShare;