import { enqueueSnackbar } from "notistack";
import { useEffect,useMemo, useState } from "react";
import axios from "axios";
const useGetMinAmountOnSellShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
  isBuying: boolean
) => {
  const [minAmountSell, setMinAmountSell] = useState<string>("0");
    useEffect(() => {
      if(betAmount==="" || Number(betAmount)===0) {
        return ;
      }
      const fetchMinAmountOnSell = async () => {
        try {
          const response = await axios.get(`${process.env.SERVER_URL}/min-amount-sell/${marketId}/${choice}/${betAmount}`);
          console.log(response.data);
          const minSharesToSell = parseInt(response.data.toString(), 16);
          setMinAmountSell(minSharesToSell.toString())
        } catch (error) {
          console.error("Error fetching minimum shares to buy:", error);
        }
      };
  
      fetchMinAmountOnSell(); 
    }, [minAmountSell,betAmount]);

  return { minAmountSell };
};

export default useGetMinAmountOnSellShares;
