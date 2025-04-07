import { enqueueSnackbar } from "notistack";
import axios from "axios";
import abi from "@/abi/MarketFactory";
import {useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { config } from "../Web3provider";
import { useEffect, useRef } from "react";
import { useState } from "react";

interface props{
    marketId:number;
    market_type:number;
    bet_num:number;
}

function useClaimWinnings() {
  const [enableQuery, setEnableQuery] = useState(false);
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
  const handleToastRef = useRef<
      (
        heading: string,
        subHeading: string,
        type: string,
        hash?: string | undefined,
        chainId?: number | undefined
      ) => void
    >(handleToast);
  const {
    writeContract,
    data,
    error:contractError
  }=useWriteContract();

  const {
   isSuccess,
   isLoading:isConfirming,
  }=useWaitForTransactionReceipt({
    hash:data,
    config,
    confirmations:2,
    query:{
      enabled:enableQuery
    }
  }) 


  const claimWinnings = async ({marketId,market_type,bet_num}:props) => {
    try{
      setEnableQuery(true)
      writeContract({
        abi:abi,
        address:CONTRACT_ADDRESS,
        functionName:'claim_winnings',
        args:[
          marketId,
          market_type,
          bet_num
        ]
      })
      
      return data;
    }catch(err){
      setEnableQuery(false)
      console.log(err)
    }
   
  };

  return { claimWinnings };
}

export default useClaimWinnings;
