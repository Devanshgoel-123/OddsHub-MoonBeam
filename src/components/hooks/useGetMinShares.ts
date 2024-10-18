import { useEffect, useState,useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { enqueueSnackbar } from "notistack";
import { contractAddress } from "../helpers/constants";
import { abi } from "../../abi/FPMMMarket.json";

const useGetMinShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
) => {
  const { address } = useAccount(); // Get user's account address
  const [minAmount, setMinAmount] = useState<string>("");

  const parsedBetAmount = useMemo(() => {
    if (!betAmount || parseFloat(betAmount) <= 0) return null;
    return parseFloat(betAmount) * 10 ** 17; // Adjust bet amount
  }, [betAmount]);

  
  const { data: minAmountData } = useReadContract({
    abi: abi,
    address: contractAddress,
    functionName: "calcBuyAmount",
    args: [marketId, parsedBetAmount, choice],
  });

  
  useEffect(() => {
    if (minAmountData) {
      setMinAmount(String(minAmountData));
    }
  }, [minAmountData]);

  return { minAmount };
};

export default useGetMinShares;
