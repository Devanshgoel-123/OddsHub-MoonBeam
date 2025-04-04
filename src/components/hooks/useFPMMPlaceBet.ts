import { enqueueSnackbar } from "notistack";
import {contractAddress, ConversionToUsd} from "../helpers/constants";
import { useAccount } from "wagmi";
import { getTransactionConfirmations, writeContract,getBalance} from '@wagmi/core'
import {abi} from "../../abi/FPMMMarket.json"
import { useEffect, useState } from "react";
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
    decimals
  );
  
  const amountInUsd=(Number(betAmount)*ConversionToUsd).toString();
 
  const PlaceFPMMBet=async()=>{
    if(Number(betAmount)>0.001){
      alert("Please input a lesser Amount")
      return;
    }
    try{
    const data=await writeContract(config,{
      abi:abi,
      address:`${contractAddress}`,
      functionName:'buy',
      args:[marketId,outcomeIndex,minAmount],
      value:parseEther(betAmount)
    })
    setData(data);
    console.log(data);    
    if(data){
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
    if (!marketId || !betAmount || !minAmount || pending) return;
    console.log("Calling backend to update shares")
    console.log("user bought this mych amount",amountInUsd);
    // await axios
    //   .post(`${process.env.SERVER_URL}/update-market`, {
    //     marketId: marketId,
    //     outcomeIndex: outcomeIndex,
    //     amount:(Number(amountInUsd)*10**6).toString(),
    //     isBuy: true,
    //     sharesUpdated: Number(minAmount),
    //   })
    //   .then((res) => {})
    //   .catch((error) => {
    //     console.error("Error creating market:", error);
    //   });
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
