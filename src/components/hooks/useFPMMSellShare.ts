import { enqueueSnackbar } from "notistack";
import { contractAddress } from "../helpers/constants";
import { abi } from "../../abi/FPMMMarket.json";
import { useEffect, useState, useCallback, useRef } from "react";
import useGetMinAmountOnSellShares from "./useGetMinAmountOnSellShares";
import axios from "axios";
import { useAccount } from "wagmi";
import { getTransactionConfirmations, readContract, writeContract } from '@wagmi/core';
import { config } from "../Web3provider";
import { ConversionToUsd } from "../helpers/constants";
import { parseEther } from "viem";
const useFPMMSellShare = (
  marketId: number,
  betAmount: string,
  choice: number,
  isBuying: boolean
) => {
  const { address } = useAccount();
  const [userMarketShare, setUserMarketShare] = useState("");
  const [updatedShares, setUpdatedShares] = useState(false);
  const [pending, setPending] = useState<boolean>(false);
  const [data, setData] = useState("");
  const [isError, setIsError] = useState<boolean>(false);
  const amountInUsd=(Number(betAmount)*ConversionToUsd).toString();
  const { minAmountSell } = useGetMinAmountOnSellShares(
    marketId,
    betAmount,
    choice,
    6,
    isBuying
  );
  useEffect(() => {
    if(betAmount==="" || !isBuying || !marketId){
      return ;
    }
    ;
  }, [minAmountSell,betAmount,marketId,isBuying]);

  console.log(minAmountSell)
  const handleToast = useCallback((
    message: string,
    subHeading: string,
    type: string,
    hash?: string
  ) => {
    enqueueSnackbar(message, {
      variant: "custom",
      subHeading,
      hash,
      type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  }, []);

  
  useEffect(() => {
    if (!marketId || !address || isBuying ) return;
    const fetchUserMarketShare = async () => {
     
      try {
        const response = await readContract(config, {
          abi,
          address: contractAddress,
          functionName: 'getUserMarketShare',
          args: [address, marketId, choice],
        });
        console.log(response)
        if (response!==undefined) {
          setUserMarketShare(String(response));
        }
      } catch (error) {
        console.error("Error fetching market share:", error);
      }
    };

    fetchUserMarketShare();
  }, [marketId, address, choice,isBuying]);

  const updateShares = async () => {
    if (updatedShares || !marketId || !betAmount) return;
    
    try {
      await axios.post(`${process.env.SERVER_URL}/update-market`, {
        marketId,
        outcomeIndex: choice,
        amount: amountInUsd.toString(),
        isBuy: false,
        sharesUpdated: parseInt(minAmountSell),
      });
      setUpdatedShares(true);
    } catch (error) {
      console.error("Error creating market:", error);
    }
  };

  const SellMarketShares = async () => {
    if (!marketId) return;
    console.log(betAmount);
    setPending(true);
    try {
      const data = await writeContract(config, {
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
      setData(data);    
      if (data) {
        setPending(false);
      } 
      return data;
    } catch (err) {
      console.log("Error placing bet:", err);
      setIsError(true);
      setPending(false);
    }
  };

  useEffect(() => {
    if (!marketId || !address || isBuying ) return;
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds.",
        "info",
        data
      );
    } else if (isError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
        "info"
      );
    } else if (data || (data && !pending)) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in section. PS - All the best for this and your next prediction.",
        "success",
        data
      );
      updateShares();
    }
  }, [data, isError, pending, handleToast, updateShares]);

  return {
    minAmountSell,
    SellMarketShares,
    userMarketShare
  };
};

export default useFPMMSellShare;