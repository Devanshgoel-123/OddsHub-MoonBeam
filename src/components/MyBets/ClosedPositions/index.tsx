import React from "react";
import "./styles.scss";
import { USDC_LOGO } from "@/components/helpers/icons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { writeContract } from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import {config} from "../../Web3provider";
import {abi} from "../../../abi/FPMMMarket.json"
import { contractAddress } from "@/components/helpers/constants";
interface ProcessedMarket {
  status: string;
  question: string;
  deadline: string;
  Outcome1Tokens: string;
  Outcome2Tokens: string;
  winner:string;
  marketId:number;
}

interface ClosedPositionsProps {
  loading: boolean;
  closedMarkets: ProcessedMarket[];
}

enum WinStatus {
  Won = "Won",
  Lost = "Lost",
}

function ClosedPositions({ loading, closedMarkets }: ClosedPositionsProps) {
  const {address}=useAccount();
  const renderMarket = (market: ProcessedMarket) => {
    const userPrediction=Number(market.Outcome1Tokens)!==0 ? "Yes" : "No";
    const outcomeIndex=market.winner=="Yes"?0:1;
    const statusClass= userPrediction===market.winner?Number(market.Outcome1Tokens)>0?"Claim":"Won":"Lost";
    return (
      <div className="Data" key={market.question}>

        {statusClass==="Claim"? <div className="Status">
          <button onClick={async ()=>{
            console.log("I got clicked")
            const data=await writeContract(config,{
              abi:abi,
              address:`${contractAddress}`,
              functionName:"claimWinnings",
              args:[market.marketId,outcomeIndex]
            })
            if(data){
              alert("Winnings have been Claimed and will be transferred shortly");
              setTimeout(()=>{},2000);
              window.location.reload();
            }
            }}>
         {statusClass}
        </button >
        </div>:
         <span className="Status" >
         {statusClass}
        </span>
        }
        <span className="Event">{market.question}</span>
        <span className="DatePlaced">
          {market.deadline.toString().slice(0,10)}
        </span>
        <span className="StakedAmount">
          {Number(market.Outcome1Tokens)!==0? (parseFloat(market.Outcome1Tokens)/10**7).toFixed(2):(parseFloat(market.Outcome2Tokens)/10**7).toFixed(2)}
        </span>
        <span className="Yes Prediction">
          {Number(market.Outcome1Tokens)!==0 ? "Yes" : "No"}
        </span>
      </div>
    );
  };

  return (
    <div className="ClosedPositions">
      <div className="Heading">Closed Positions</div>
      <div className="Container">
        {loading ? (
          <LoaderComponent />
        ) : closedMarkets.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              className="Headings"
            >
              <span className="Status">Status</span>
              <span className="Event">Event</span>
              <span className="DatePlaced">Bet Deadline</span>
              <span className="StakedAmount">Shares Bought</span>
              <span className="Prediction">Prediction</span>
              <span className="Details"></span>
            </motion.div>
            {closedMarkets.map(renderMarket)}
          </>
        ) : (
          <EmptyBetComponent text="You have no closed positions" />
        )}
      </div>
    </div>
  );
}

export default ClosedPositions;