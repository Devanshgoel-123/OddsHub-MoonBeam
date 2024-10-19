import React from "react";
import "./styles.scss";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CustomLogo from "@/components/common/CustomIcons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";


function OpenPositions({ openMarkets, openBets, loading }: any) {
  console.log({ openMarkets, openBets, loading })
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
            {openMarkets.map((market, index) => (
              <div className="Data" key={index}>
                <span className="Status">Open</span>
                <span className="Event">{market[0].question}</span>
                <span className="DatePlaced">
                  {
                    (market[0].deadline).slice(0,10)
                  }
                </span>
                <span className="BetToken StakedAmount">
                  {openBets.length > 0 && openBets[index] ? (openBets[index].Yes===0) ? openBets[index].No/10**6 : openBets[index].Yes/10**6  :"0"}
                </span>
                <span className="Yes Prediction">
                  {openBets.length > 0 && openBets[index] ? (openBets[index].Yes===0) ? "No" :"Yes"  :"0"}
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
