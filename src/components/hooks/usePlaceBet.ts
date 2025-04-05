import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { config } from "../Web3provider";
import abi from "@/abi/MarketFactory";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { parseEther } from "viem";
import { useState,useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
export const usePlaceBet=(category:string)=>{
    const {
        writeContract,
        data,
        error:contractError
    }=useWriteContract();
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
             "Placing Bet",
             "Bet Placing Pending",
             category,
           )
         setEnableQuery(false);
        }else if(data && isSuccess){
         handleToastRef.current(
           "Placing Bet ",
           "Market Creation Successful",
           category,
         )
         setEnableQuery(false);
        }
        if(contractError){
         console.log("The Error faced is",contractError.message)
         handleToastRef.current(
           "Error Placing bet",
           "Error placing the bet inside the market",
           category,
         )
         setEnableQuery(false);
        }
       },[])
     
    const sendTransaction=async (amount:string, market_id:number, market_type:number,token_to_mint:number)=>{
        if(amount==="" || !Number(amount)) return;
        setEnableQuery(true)
        try{
          writeContract({
            abi:abi,
            functionName:"buy_shares",
            address:CONTRACT_ADDRESS,
            args:[
                BigInt(market_id),
                token_to_mint,
                market_type
            ],
            value:parseEther(amount)
        })
        }catch(err){
          console.log("Faced error during contract interactions")
          setEnableQuery(false)
        }
       
    }

    return {
        sendTransaction
    }
}