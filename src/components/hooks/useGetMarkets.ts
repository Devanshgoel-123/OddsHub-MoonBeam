

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "@/abi/MarketFactory";

export const useGetMarket = (index: number) => {
  const {data} = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'markets',
    args: [index],
  });
  console.log("the data is",data)
  return data;
};
