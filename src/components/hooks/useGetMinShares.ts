import { useEffect, useState,useMemo } from "react";
import {  useReadContract } from "wagmi";
import { contractAddress } from "../helpers/constants";
import { abi } from "../../abi/FPMMMarket.json";

const useGetMinShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
) => {
  const [minAmount, setMinAmount] = useState<string>("");

  const parsedBetAmount = useMemo(() => {
    if (!betAmount || parseFloat(betAmount) <= 0) return null;
    const betAmountInDollars = parseFloat(betAmount) * 2569; // Convert to dollars
    const betAmountInSmallestUnit = Math.floor(betAmountInDollars * 10 ** 6); // Convert to smallest unit
    return betAmountInSmallestUnit;
  }, [betAmount]);

  const { data: minAmountData,isError,error } = useReadContract({
    abi: abi,
    address: contractAddress,
    functionName: "calcBuyAmount",
    args: [marketId, parsedBetAmount, choice],
  });

  if(isError){
    console.log(error);
  }else{
    console.log(minAmountData);
  }
  
  useEffect(() => {
    if(!marketId || betAmount==="" ){
      return ;
    }
    if (minAmountData) {
      setMinAmount(String(minAmountData));
    }
  }, [minAmountData,marketId,betAmount]);

  return { minAmount };
};

export default useGetMinShares;
