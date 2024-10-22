"use client";

import React, { useEffect, useState, useCallback } from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";
import { useAccount } from "wagmi";
import axios from "axios";
import { FPMMMarketInfo } from "../helpers/types";

interface Market {
  marketId: { hex: string };
  isActive: boolean;
  Outcome1Tokens: string;
  Outcome2Tokens: string;
}

interface ProcessedMarket {
  status: string;
  question: string;
  deadline: string;
  Outcome1Tokens: string;
  Outcome2Tokens: string;
  winner:string;
  marketId:number;
}

function MyBets() {
  const { address, isConnected } = useAccount();
  const [markets, setMarkets] = useState<ProcessedMarket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMarketData = useCallback(async (marketId: number): Promise<FPMMMarketInfo> => {
    try {
      const response = await axios.get<FPMMMarketInfo[]>(`${process.env.SERVER_URL}/get-current-market/${marketId}`);
      console.log(`Fetched market data for ID ${marketId}:`, response.data);
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching market data for ID ${marketId}:`, error);
      throw error;
    }
  }, []);

  const processMarkets = useCallback(async (userMarkets: Market[]): Promise<ProcessedMarket[]> => {
    const marketsToProcess = userMarkets.filter(market => 
      parseFloat(market.Outcome1Tokens) > 0 || parseFloat(market.Outcome2Tokens) > 0
    );

    console.log(`Processing ${marketsToProcess.length} out of ${userMarkets.length} markets`);

    const processedMarkets = await Promise.all(
      marketsToProcess.map(async (market) => {
        try {
          const marketId = parseInt(market.marketId.hex, 16);
          console.log(`Processing market ID: ${marketId}`);
          const currentMarket = await fetchMarketData(marketId);
          
          if (!currentMarket.question || !currentMarket.deadline) {
            console.error(`Invalid data for market ID ${marketId}:`, currentMarket);
            return null;
          }

          return {
            status: market.isActive ? "Open" : "Closed",
            question: currentMarket.question,
            deadline: currentMarket.deadline,
            Outcome1Tokens: market.Outcome1Tokens,
            Outcome2Tokens:market.Outcome2Tokens,
            winner:currentMarket.outcomes[0].winner? currentMarket.outcomes[0].name:currentMarket.outcomes[1].name,
            marketId:marketId
          };
        } catch (error) {
          console.error(`Error processing market:`, error);
          return null;
        }
      })
    );
    
    return processedMarkets.filter((market): market is ProcessedMarket => market !== null);
  }, [fetchMarketData]);

  useEffect(() => {
    const getAllMarkets = async () => {
      if (!address || !isConnected) return;

      setLoading(true);
      try {
        const response = await axios.get<Market[]>(`${process.env.SERVER_URL}/getmarketsforUser/${address}`);
        console.log("User markets response:", response.data);
        
        if (response.data.length === 0) {
          console.log("No markets found for user");
          setMarkets([]);
          return;
        }

        const processedMarkets = await processMarkets(response.data);
        console.log("Processed markets:", processedMarkets);
        setMarkets(processedMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
        setMarkets([]);
      } finally {
        setLoading(false);
      }
    };

    getAllMarkets();
  }, [address, isConnected, processMarkets]);

  const openMarkets = markets.filter(market => market.status === "Open");
  const closedMarkets = markets.filter(market => market.status === "Closed");
  console.log(openMarkets);
  console.log(closedMarkets)
  return (
    <div className="MyBets">
      <OpenPositions
        loading={loading}
        openMarkets={openMarkets}
      />
      <ClosedPositions
        loading={loading}
        closedMarkets={closedMarkets}
      />
    </div>
  );
}

export default MyBets;