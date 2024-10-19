import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Market, UserBet } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";
import { USDC_LOGO } from "@/components/helpers/icons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";

import {options} from "../../helpers/constants"
interface Props {
  closedMarkets: Market[];
  closedBets: {
    outcomeAndBet: UserBet;
    betNumber: number;
  }[];
  loading: boolean;
}

enum WinStatus {
  Won = "Won",
  Lost = "Lost",
  Claimable = "Claim",
}

function ClosedPositions({ closedMarkets, closedBets, loading }: Props) {
  const [winStatus, setWinStatus] = useState<WinStatus[]>([]);

  useEffect(() => {
    const newWinStatus = closedMarkets.map((market, index) => {
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

  const renderMarket = (market: Market, index: number) => {
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
          {getNumber(closedBets[index]?.outcomeAndBet.position.amount || "0")}
        </span>
        <span className="Yes Prediction">
          {getString(closedBets[index]?.outcomeAndBet.outcome.name || "0")}
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
