import { enqueueSnackbar } from "notistack";
import axios from "axios";
import abi from "@/abi/MarketFactory";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { config } from "../Web3provider";
import { moonbaseAlpha } from "viem/chains";
import { useEffect, useRef } from "react";
import { useState } from "react";
interface Data {
  heading: string;
  category: string;
  description: string;
  outcome1: string;
  outcome2: string;
  deadline: number;
  image: string;
  fightImage?: string;
}

function useCreateMarket({
  heading,
  category,
  deadline,
  description,
  image,
  outcome1,
  outcome2,
  fightImage,
}: Data) {

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

  
  useEffect(()=>{
   if(data && isConfirming){
      handleToastRef.current(
        heading,
        "Market Creating Pending",
        category,
      )
    setEnableQuery(false);
   }else if(data && isSuccess){
    handleToastRef.current(
      heading,
      "Market Creation Successful",
      category,
    )
    setEnableQuery(false);
   }
   if(contractError){
    console.log("The Error faced is",contractError.message)
    handleToastRef.current(
      heading,
      "Error creating the market",
      category,
    )
    setEnableQuery(false);
   }
  },[])

  const createMarket = async () => {
    try{

      console.log("Creating market for user");
      setEnableQuery(true)
      writeContract({
        abi:abi,
        address:CONTRACT_ADDRESS,
        functionName:'create_market',
        args:[
          heading,
          description,
          outcome1,
          outcome2,
          category,
          image,
          deadline
        ]
      })
      
      return data;
    }catch(err){
      setEnableQuery(false)
      console.log(err)
      handleToastRef.current(
        heading,
        "Error creating the market",
        category,
      )
    }
   
  };

  return { createMarket };
}

export default useCreateMarket;
