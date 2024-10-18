"use client";
import BetActions from "@/components/ContBetDetailView/BetActions";
import BetDetails from "@/components/ContBetDetailView/BetDetails";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import { usePathname, useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import {abi} from "../../../../abi/FPMMMarket.json";
import { contractAddress } from "@/components/helpers/constants";
import {
  FPMMMarket,
  FPMMMarketInfo,
  FPMMOutcome,
} from "@/components/helpers/types";
import { NextPage } from "next";
import CustomLogo from "@/components/common/CustomIcons";
import { BACK_LOGO } from "@/components/helpers/icons";
import { Skeleton } from "@mui/material";
import axios from "axios";
import { handleToast } from "@/components/helpers/functions";



interface ContractData{
  numOutcomes:number,
  deadline:number,
  isActive:boolean,
  isSettled:boolean
}
interface ContractReadResult {
  data: ContractData | undefined;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: string;
}
const BetDetailView: NextPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const encoded = pathname.split("/")[3];
  const hexPart = encoded.slice(0, -4);
  const marketId = parseInt(hexPart, 16);
  const [market, setMarket] = useState<FPMMMarketInfo | null>(null);
  const [outcomes, setOutcomes] = useState<FPMMOutcome[]>([]);

  const marketResult = useReadContract({
    abi,
    address: `${contractAddress}`,
    functionName: 'getMarket',
    args: [marketId], // The correct marketId is passed here
  }) as ContractReadResult;
  console.log(marketResult.data);
  const contractData=(marketResult.data) as ContractData | undefined;
  const outcomeResult1=useReadContract({
    abi,
    address: `${contractAddress}`,
    functionName: 'getOutcome',
    args: [marketId,0],
  })
 
  const outcomeResult2=useReadContract({
    abi,
    address: `${contractAddress}`,
    functionName: 'getOutcome',
    args: [marketId,1],
  })
  
  useEffect(() => {
    if (outcomeResult1.data && outcomeResult2.data) {
      const tempOutcomes = [outcomeResult1.data, outcomeResult2.data];
      console.log(tempOutcomes);
      setOutcomes(tempOutcomes);
    }
  }, [outcomeResult1.data,outcomeResult2.data]);

  useEffect(() => {
    const getMarketInfo = async () => {
      try {
        const response = await axios.get(`${process.env.SERVER_URL}/get-current-market/${marketId}`);
        console.log(response.data);
        setMarket(response.data[0]);
      } catch (err) {
        handleToast(
          "Error Fetching Market Data",
          "Please try refreshing the page",
          "error"
        );
      }
    };
    getMarketInfo();
  }, [marketId]);

  
  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <CustomLogo width={"30px"} height={"20px"} src={BACK_LOGO} />
        <div>Back</div>
      </div>

      {market && (
        <div className='DetailsAndActions'>
          <BetDetails
            heading={market.question}
            logo={market.icon}
            fightImage={market.fightimage}
            subHeading={market.description}
          />
          {market ? (
           <BetActions
              duration={market?.deadline || ""}
              outcomes={outcomes}  
               settled={market?.settled}
            />
          ) : (
            <Skeleton />
          )}
        </div>
      )}
    </div>
  );
};

export default BetDetailView;
