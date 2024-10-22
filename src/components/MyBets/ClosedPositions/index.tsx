import React from "react";
import "./styles.scss";
import { USDC_LOGO } from "@/components/helpers/icons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";

interface ProcessedMarket {
  status: string;
  question: string;
  deadline: string;
  Outcome1Tokens: string;
  Outcome2Tokens: string;
  winner:string;
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
  const renderMarket = (market: ProcessedMarket) => {
    const userPrediction=Number(market.Outcome1Tokens)!==0 ? "Yes" : "No";
    const statusClass= userPrediction===market.winner?"Won":"Lost";
    return (
      <div className="Data" key={market.question}>
        <span className="Status">
         {statusClass}
        </span>
        <span className="Event">{market.question}</span>
        <span className="DatePlaced">
          {market.deadline.toString().slice(0,10)}
        </span>
        <span className="StakedAmount">
          {Number(market.Outcome1Tokens)!==0? (parseFloat(market.Outcome1Tokens)/10**8).toFixed(2):parseFloat(market.Outcome2Tokens)/10**8}
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
              <span className="StakedAmount">Staked Amount</span>
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