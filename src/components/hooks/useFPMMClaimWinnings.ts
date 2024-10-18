import { enqueueSnackbar } from "notistack";
import {contractAddress} from "../helpers/constants";
import { getTransactionConfirmations, writeContract } from '@wagmi/core'
import {abi} from "../../abi/FPMMMarket.json";
import { useEffect, useState } from "react";
import { config } from "../Web3provider";

const useFPMMClaimWinnings = (marketId: number, choice: number) => {
  const [pending,setPending]=useState<boolean>(false);
  const [data,setData]=useState("");
  const [isError, setIsError] = useState<boolean>(false);

  const claimWinnings=async()=>{
    try{
      const data=await writeContract(config,{
        abi:abi,
        address:`${contractAddress}`,
        functionName:'claimWinnigs',
        args:[marketId,choice]
      })
      setData(data);
        const traxnConfirmation=await getTransactionConfirmations(config,{
          hash:data
        });
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
    if (data || (data && !pending)) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in “My bets” section. PS - All the best for this and your next prediction.",
        "success",
        data
      );
      
    }
  }, [data, isError, pending]);

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

  return {claimWinnings};
};

export default useFPMMClaimWinnings;
