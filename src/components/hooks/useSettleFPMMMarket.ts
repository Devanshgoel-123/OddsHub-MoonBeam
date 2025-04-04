import { useAccount } from "wagmi";
import {  waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/MarketFactory"
import { config } from "../Web3provider";
import axios from "axios";

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
      console.log(data);
      // await axios.post(`${process.env.SERVER_URL}/settleMarket`,{
      //   marketId:marketData.marketId,
      //   outcomeIndex:marketData.outcome
      // })
      // .then((res)=>{
      //   console.log(res);
      // })
    
   return transactionHash;
  }
  return {settleMarket};
}

export default useSettleFPMMMarket;
