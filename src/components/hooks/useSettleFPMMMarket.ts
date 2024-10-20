import { useAccount } from "wagmi";
import { useMemo } from "react";
import { getConnections,sendTransaction, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { contractAddress } from "../helpers/constants";
import {abi} from "../../abi/FPMMMarket.json"
import { config } from "../Web3provider";

interface Data {
  marketId: BigInt;
  outcome: number;
}

function useSettleFPMMMarket(marketData: Data) {
  const { address } = useAccount();
  if (!address || !marketData.marketId || marketData.outcome === undefined) {
    return {
      settleMarket: async () => {
        throw new Error("Invalid data or user not connected");
      },
    };
  } 
  async function settleMarket(){
    const data=await writeContract(config,{
      abi:abi,
      address:`${contractAddress}`,
      functionName:'setMarketWinner',
      args:[marketData.marketId,marketData.outcome],
     })
      const transactionHash=data;
      const transactionReceipt=await waitForTransactionReceipt(config,{
      confirmations:2,
      hash:transactionHash
    }
    
)
return transactionHash;
  }
  return {settleMarket};
}

export default useSettleFPMMMarket;
