"use client";
import React, { useEffect, useState } from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";
import { useAccount, useReadContract } from "wagmi";
import axios from "axios";

function MyBets() {
  const { address, isConnected } = useAccount();
  const [openMarkets, setOpenMarkets] = useState<any[]>([]);
  const [openBets, setOpenBets] = useState<any>([]);
  const [closedMarkets, setClosedMarkets] = useState<any[]>([]);
  const [closedBets, setClosedBets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userMarkets, setUserMarkets] = useState("");
  useEffect(() => {
    const getAllMarkets = async () => {
      setLoading(true);
      if (!address || !isConnected) {
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${process.env.SERVER_URL}/getmarketsforUser/${address}`
      );
      setUserMarkets(response.data);

      if (!response || response.data.length === 0) {
        setLoading(false);
        return;
      }

      const openMarketsRes: any[] = [];
      const closedMarketsRes: any[] = [];
      const openBets: any[] = [];
      const closedBets: any[] = [];
      for (const market of response.data) {
        console.log(market[0].hex)
        const marketId = parseInt(market[0].hex,16); 
        const isActive = market[2];
        const NumberOfBets=market[1].length;
        console.log(market,isActive,NumberOfBets);
        const marketDetails = await axios.get(
          `${process.env.SERVER_URL}/get-current-market/${marketId}`
        );
        if (isActive) {
          openMarketsRes.push(marketDetails.data);
          openBets.push({Yes:parseInt(market[1][0].hex,16),No:parseInt(market[1][1].hex,16)});
        } else {
          closedMarketsRes.push(marketDetails.data);
          closedBets.push({Yes:parseInt(market[1][0].hex,16),No:parseInt(market[1][1].hex,16)});
        }
      }
      setOpenMarkets(openMarketsRes);
      setClosedMarkets(closedMarketsRes);
      setOpenBets(openBets);
      setClosedBets(closedBets);
      setLoading(false);
    };

    getAllMarkets();
  }, [address]);
   
  return (
    <div className="MyBets">
      <OpenPositions
        loading={loading}
        openMarkets={openMarkets}
        openBets={openBets}
      />
      {/* <ClosedPositions
        loading={loading}
        closedMarkets={closedMarkets}
        closedBets={closedBets}
      /> */}
    </div>
  );
}

export default MyBets;
