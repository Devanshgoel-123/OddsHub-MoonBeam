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
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const renderShareInfo = (bets: Bet[]) => {
      const newRows: any[] = [];

      bets.forEach((bet: Bet) => {
        if (bet.Yes > 0) {
          newRows.push({
            shares: bet.Yes / 10 ** 6,
            prediction: "Yes",
          });
        }
        if (bet.No > 0) {
          newRows.push({
            shares: bet.No / 10 ** 6,
            prediction: "No",
          });
        }
      });

      setRows(newRows);
    };
   
    renderShareInfo(openBets);
  }, [openBets]);
  console.log(openMarkets)
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
                <span className="Event">{market[0].question}</span>
                <span className="DatePlaced">{market[0].deadline.slice(0, 10)}</span>

                {rows.length > 0
                  ? rows.map((bet, betIndex: number) => (
                      <div key={betIndex} className="BetRow">
                        <span className="BetToken StakedAmount">
                          <Box className="TokenLogo">
                            <CustomLogo src={ETH_LOGO} />
                          </Box>
                          {bet.shares}
                        </span>
                        <span className="Yes Prediction">{bet.prediction}</span>
                      </div>
                    ))
                  : (
                    <>
                      <span className="BetToken StakedAmount">0</span>
                      <span className="Yes Prediction">No Predictions</span>
                    </>
                  )}
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
