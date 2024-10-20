import React, { useEffect, useState } from "react";
import "./styles.scss";
import { UserBet } from "@/components/helpers/types";
import { USDC_LOGO } from "@/components/helpers/icons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";


enum WinStatus {
  Won = "Won",
  Lost = "Lost",
  Claimable = "Claim",
}

function ClosedPositions({ closedMarkets, closedBets, loading }:any) {
  const [winStatus, setWinStatus] = useState<WinStatus[]>([]);

  useEffect(() => {
    const newWinStatus = closedMarkets.map((market:any, index:number) => {
      const bet = closedBets[index]?.outcomeAndBet;

      if (!bet) return WinStatus.Lost;
      if (
        market.winning_outcome?.Some &&
        market.winning_outcome.Some.name === bet.outcome.name
      ) {
        return bet.position.has_claimed ? WinStatus.Won : WinStatus.Claimable;
      } else {
        return WinStatus.Lost;
      }
    });
    setWinStatus(newWinStatus);
  }, [closedMarkets, closedBets]);

  const renderMarket = (market: any, index: number) => {
    const statusClass =
      winStatus[index] === WinStatus.Claimable
        ? "Claim"
        : winStatus[index] === WinStatus.Won
        ? "Won"
        : "Lost";

    return (
      <div className="Data" key={market.market_id}>
        <span className={`Status`}>
          <span className={`${statusClass}`}>{winStatus[index]}</span>
        </span>
        <span className="Event">{market.name}</span>
        <span className="DatePlaced">
          {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
        </span>
        <span className="BetToken StakedAmount">
          <Box className="TokenLogo">
            <CustomLogo src={USDC_LOGO} />
          </Box>
          {(closedBets[index] || "0")}
        </span>
        <span className="Yes Prediction">
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
