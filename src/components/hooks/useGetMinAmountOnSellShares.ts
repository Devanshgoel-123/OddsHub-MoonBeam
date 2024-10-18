import { enqueueSnackbar } from "notistack";
import {contractAddress} from "../helpers/constants";
import { useReadContract } from "wagmi";
import { useEffect,useMemo, useState } from "react";
import {abi} from "../../abi/FPMMMarket.json"

const useGetMinAmountOnSellShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
  isBuying: boolean
) => {
  
  const [minAmountSell, setMinAmountSell] = useState<string>("");

  const {data,isError,error}=useReadContract({
        abi:abi,
        address:`${contractAddress}`,
        functionName:"calcSellAmount",
        args:[marketId,(Number(betAmount)*10**6),choice]
      });
      console.log(data,error)
    useEffect(() => {
      if(betAmount==="") {
        return ;
      }
      if (minAmountSell) {
        setMinAmountSell(String(data));
      }
    }, [minAmountSell,betAmount,data]);

  return { minAmountSell };
};

export default useGetMinAmountOnSellShares;
