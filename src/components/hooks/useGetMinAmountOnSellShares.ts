import { enqueueSnackbar } from "notistack";
import {contractAddress, ConversionToUsd} from "../helpers/constants";
import { useReadContract } from "wagmi";
import { useEffect,useMemo, useState } from "react";
import {abi} from "../../abi/FPMMMarket.json"
import { parseEther } from "viem";

const useGetMinAmountOnSellShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
  isBuying: boolean
) => {
  
  const [minAmountSell, setMinAmountSell] = useState<string>("0");
 
  const {data,error}=useReadContract({
        abi:abi,
        address:`${contractAddress}`,
        functionName:"calcSellAmount",
        args:[marketId,parseEther(betAmount),choice],
        query:{
          enabled:!isBuying
        },
      });
if(data!==undefined){
  console.log(data);
}

    useEffect(() => {
      if(betAmount==="" || Number(betAmount)===0) {
        return ;
      }
      if (minAmountSell) {
        setMinAmountSell(String(data));
      }
    }, [minAmountSell,betAmount,data]);

  return { minAmountSell };
};

export default useGetMinAmountOnSellShares;
