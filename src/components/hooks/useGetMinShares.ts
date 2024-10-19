import { useEffect, useState } from "react";
import axios from "axios";
import { contractAddress, ConversionToUsd } from "../helpers/constants";

const useGetMinShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
) => {
  const [minAmount, setMinAmount] = useState<string>("");

  useEffect(() => {
    if (marketId === undefined || betAmount === "" || Number(betAmount)==0) {
      setMinAmount(""); 
      return;
    }

    const fetchMinShares = async () => {
      try {
        const response = await axios.get(`${process.env.SERVER_URL}/min-shares-buy/${marketId}/${choice}/${betAmount}`);
        const minSharesToBuy = parseInt(response.data.toString(), 16);
        setMinAmount(minSharesToBuy.toString());
      } catch (error) {
        console.error("Error fetching minimum shares to buy:", error);
      }
    };

    fetchMinShares(); 
  }, [betAmount, choice, marketId]);

  return { minAmount };
};

export default useGetMinShares;
