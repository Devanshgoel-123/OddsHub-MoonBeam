

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "@/abi/MarketFactory";
import { Market } from "../helpers/types";

export const useGetMarket = (index: number) => {
  const {data} = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'get_all_markets',
  });
  console.log("the data is",data)
  const finalData:Market[]=data as Market[];
  
  return {finalData};
};

export const useGetParticularMarket = (index: number) => {
  const { data, isLoading, error } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'get_all_markets',
  });
 
  const finalData: Market[] = (data as Market[]) || [];
  const market:Market = finalData[index];
  console.log(market,"the market data is")
  return {
    data: market,
    isLoading,
    error,
  };
};