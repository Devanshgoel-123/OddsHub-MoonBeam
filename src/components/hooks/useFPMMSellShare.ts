import { enqueueSnackbar } from "notistack";
import { contractAddress } from "../helpers/constants";
import { abi } from "../../abi/FPMMMarket.json";
import { useEffect, useState, useCallback, useRef } from "react";
import useGetMinAmountOnSellShares from "./useGetMinAmountOnSellShares";
import axios from "axios";
import { useAccount } from "wagmi";
import { getTransactionConfirmations, readContract, writeContract } from '@wagmi/core';
import { config } from "../Web3provider";

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
  }, [minAmountSell,betAmount,marketId,isBuying]);

  
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
    const fetchUserMarketShare = async () => {
      if (!marketId || !address || isBuying ) return;
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

  const updateShares = useCallback(async () => {
    if (updatedShares || !marketId || !betAmount) return;
    
    try {
      await axios.post(`${process.env.SERVER_URL}/update-market`, {
        marketId,
        outcomeIndex: choice,
        amount: parseFloat(betAmount) * 10 ** 17,
        isBuy: false,
        sharesUpdated: parseInt(minAmountSell),
      });
      setUpdatedShares(true);
    } catch (error) {
      console.error("Error creating market:", error);
    }
  }, [updatedShares, marketId, betAmount, choice,minAmountSell]);

  const SellMarketShares = useCallback(async () => {
    if (!marketId) return;
    
    setPending(true);
    try {
      const data = await writeContract(config, {
        abi,
        address: contractAddress,
        functionName: "sell",
        args: [
          marketId, 
          BigInt(parseFloat(betAmount) * 10 ** 17),
          choice,
          minAmountSell
        ]
      });

      setData(data);
      
      const traxnConfirmation = await getTransactionConfirmations(config, {
        hash: data
      });
      
      if (traxnConfirmation) {
        setPending(false);
      }
      
      return data;
    } catch (err) {
      console.log("Error placing bet:", err);
      setIsError(true);
      setPending(false);
    }
  }, [marketId, betAmount, choice,minAmountSell]);

  // Combine transaction-related effects into a single useEffect
  useEffect(() => {
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