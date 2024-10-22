import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CustomLogo from "@/components/common/CustomIcons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import { ETH_LOGO } from "@/components/helpers/icons";

interface Bet {
  Yes: number;
  No: number;
}

function OpenPositions({ openMarkets, openBets, loading }: any) {
  return (
    <div className="OpenPositions">
      <div className="Heading">Open Positions</div>
      <div className="Container">
        {loading ? (
          <LoaderComponent />
        ) : openMarkets.length > 0 ? (
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

            {openMarkets.map((market: any, index: number) => (
              <div className="Data" key={index}>
                <span className="Status">Open</span>
                <span className="Event">{market.question}</span>
                <span className="DatePlaced">{market.deadline.slice(0, 10)}</span>
                <span className="StakedAmount">
                  {market.Outcome1Tokens > 0 ? (market.Outcome1Tokens/10**7).toFixed(2):(market.Outcome2Tokens/10**7).toFixed(2)}
                </span>
                <span className="Yes Prediction">
                  {market.Outcome1Tokens > 0 ? "Yes":"No"}
                </span>
              </div>
            ))}
          </>
        ) : (
          <EmptyBetComponent text="You have no open positions" />
        )}
      </div>
    </div>
  );
}

export default OpenPositions;
