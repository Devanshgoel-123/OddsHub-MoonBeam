import { enqueueSnackbar } from "notistack";
import {contractAddress, ConversionToUsd} from "../helpers/constants";
import { useAccount,useBalance } from "wagmi";
import { getTransactionConfirmations, writeContract,getBalance} from '@wagmi/core'
import {abi} from "../../abi/FPMMMarket.json"
import { useEffect, useMemo, useState } from "react";
import useGetMinShares from "./useGetMinShares";
import axios from "axios";
import { config } from "../Web3provider";
import { parseEther } from "viem";

const useFPMMPlaceBet = (
  marketId: number,
  betAmount: string,
  outcomeIndex: number,
) => {
  const { address } = useAccount();
  const [balance, setBalance] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [updatedShares, setUpdatedShares] = useState(false);
  const [pending,setPending]=useState<boolean>(false);
  const [data,setData]=useState("");
  const [isError, setIsError] = useState<boolean>(false);
  const { minAmount } =useGetMinShares(
    marketId,
    betAmount,
    outcomeIndex,
    decimals,
  );
  // console.log(minAmount);
  const amountInUsd=(Number(betAmount)*ConversionToUsd).toString();
  // console.log(amountInUsd);
  const PlaceFPMMBet=async()=>{
    try{
    const data=await writeContract(config,{
      abi:abi,
      address:`${contractAddress}`,
      functionName:'buy',
      args:[marketId,outcomeIndex,minAmount],
      value:parseEther(betAmount)
    })
    setData(data);
    const traxnConfirmation=await getTransactionConfirmations(config,{
      hash:data
    })
    
    if(traxnConfirmation){
      setPending(false);
    }
    return data;
  }catch(err){
    console.log("Error placing bet:", err);
      setIsError(true); 
      setPending(false);
  }
  }
  const userBalance = async () => {
    if (!address) return;
    const balanceWallet = await getBalance(config,{
      address:`${address}`,
    })
    console.log(balanceWallet)
    setBalance((balanceWallet.formatted));
  };

  useEffect(() => {
    if(!marketId || betAmount=="" ){
      return ;
    }
    userBalance();
  }, [address,betAmount,marketId]);


  const updateShares = async () => {
    if (!marketId || !betAmount || !minAmount || updatedShares) return;
    await axios
      .post(`${process.env.SERVER_URL}/update-market`, {
        marketId: marketId,
        outcomeIndex: outcomeIndex,
        amount:(amountInUsd).toString(),
        isBuy: true,
        sharesUpdated: parseInt(minAmount),
      })
      .then((res) => {})
      .catch((error) => {
        console.error("Error creating market:", error);
      });
    setUpdatedShares(true);
  };

  useEffect(() => {
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds.",
        "info",
        data
      );
    }
    if (isError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
        "info"
      );
    }
    if ((data && !pending)) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in “My bets” section. PS - All the best for this and your next prediction.",
        "success",
        data
      );
      updateShares();
      userBalance();
    }
  }, [data,pending]);

  const handleToast = (
    message: string,
    subHeading: string,
    type: string,
    hash?: string
  ) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  return { balance, minAmount,PlaceFPMMBet};
};

export default useFPMMPlaceBet;
