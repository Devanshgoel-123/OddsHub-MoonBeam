"use client";
import { NextPage } from "next";
import { useAccount, useConnect } from "wagmi";
import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { useContext, useEffect, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { FPMMOutcome } from "@/components/helpers/types";
import { calcPrice, getString, getTimeBetween } from "@/components/helpers/functions";
import { usePathname } from "next/navigation";
import useFPMMPlaceBet from "@/components/hooks/useFPMMPlaceBet";
import useFPMMSellShare from "@/components/hooks/useFPMMSellShare";
import useFPMMClaimWinnings from "@/components/hooks/useFPMMClaimWinnings";
import { CLOCK_ICON,ETH_LOGO, STARKNET_LOGO, USDC_LOGO} from "@/components/helpers/icons";
interface Props {
  outcomes: FPMMOutcome[];
  duration: string;
  settled: boolean;
}

const BetActions: NextPage<Props> = ({ outcomes, duration, settled }) => {
  const { address } = useAccount();
  const pathname = usePathname();
  const { connectors, connect } = useConnect();
  const { choice, setChoice } = useContext(MarketContext);
  const [betAmount, setBetAmount] = useState("");
  const [marketId, setMarketId] = useState(0);
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [isBuying, setIsBuying] = useState(true);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(0);

  
  useEffect(() => {
    if (!outcomes || outcomes.length === 0) return;
    const percentages = calcPrice([
      outcomes[0].numSharesInPool.toString(),
      outcomes[1].numSharesInPool.toString(),
    ]);
    setPrice1(percentages[0]);
    setPrice2(percentages[1]);
  }, [outcomes]);

  // Set marketId from the URL
  useEffect(() => {
    const encoded = pathname.split("/")[3];
    const hexPart = encoded.slice(0, -4);
    const marketId = parseInt(hexPart, 16);
    setMarketId(marketId);
    if (settled) {
      setIsBuying(false);
    }
  }, [pathname, settled]);

  const { balance, PlaceFPMMBet,minAmount }=useFPMMPlaceBet(marketId, betAmount, choice); 
  const {  minAmountSell,userMarketShare,SellMarketShares} = useFPMMSellShare(marketId, betAmount, choice, isBuying);
  console.log(minAmountSell);
  const { claimWinnings } = useFPMMClaimWinnings(marketId, choice);
  function handleBetAmount(value: string) {
    if (value == "") {
      setBetAmount("");
    } else {
      setBetAmount(value);
    }
  }
  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration) * 1000).getTime();
    const timeBetween = getTimeBetween(deadline, currentTime);
    setDaysRemaining(timeBetween[0]);
    setHoursRemaining(timeBetween[1]);
    setMinutesRemaining(timeBetween[2]);
  }, [duration]);


  const renderBuy = () => {
    return (
      <Box className='InputContainer'>
        <span className='Label'>Order Value</span>
        <Box className='InputWrapper'>
          <Box className='Input-Left'>
            <Box className='Starknet-logo'>
              <CustomLogo width='20px' height='20px' src={ETH_LOGO} />
            </Box>
            <input
              className='InputField'
              type='number'
              id='numberInput'
              name='numberInput'
              value={betAmount}
              onChange={(e) => handleBetAmount(e.target.value)}
              placeholder='0.00'
              required
            />
          </Box>
        </Box>
        <span className='BalanceField'>
          {address
            ? "Balance: " + parseFloat(balance).toFixed(6)+" ETH"
            : "Please connect your wallet."}{" "}
        </span>
      </Box>
    );
  };

  const renderSell = () => {
    return (
      <Box className='InputContainer'>
        <span className='Label'>Required Collateral</span>
        <Box className='InputWrapper'>
          <Box className='Input-Left'>
            <Box className='Starknet-logo'>
              <CustomLogo width='20px' height='20px' src={STARKNET_LOGO} />
            </Box>
            <input
              className='InputField'
              type='number'
              id='numberInput'
              name='numberInput'
              value={betAmount}
              onChange={(e) => handleBetAmount(e.target.value)}
              placeholder='0.00'
              required
            />
          </Box>
          
        </Box>
        <span className='BalanceField'>
          {address
            ? "Shares: " + (parseFloat(userMarketShare) / 1e6)
            : "Please connect your wallet."}{" "}
        </span>
      </Box>
    );
  };

  const renderClaim = () => {
    return (
      <Box className='InputContainer'>
        <span className='Label'>Claim your winnings!</span>
        <Box className='InputWrapper'>
          <Box className='Input-Left'>
            <input
              className='InputField'
              type='number'
              id='numberInput'
              name='numberInput'
              value={betAmount}
              onChange={(e) => handleBetAmount(e.target.value)}
              placeholder='0.00'
              disabled={settled}
              required
            />
          </Box>
          
        </Box>
        <span className='BalanceField'>
          {address
            ? "Shares: " + (parseFloat(userMarketShare)).toFixed(6)
            : "Please connect your wallet."}{" "}
        </span>
      </Box>
    );
  };

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration) * 1000).getTime();
    const timeBetween = getTimeBetween(deadline, currentTime);
    setDaysRemaining(timeBetween[0]);
    setHoursRemaining(timeBetween[1]);
    setMinutesRemaining(timeBetween[2]);
  }, [duration]);

  return (
    <Box>
      <Box className='BuySellSwitches'>
        <Box
          onClick={() => (settled ? {} : setIsBuying(true))}
          className={`BuySellSwitch ${isBuying ? "active" : ""}`}
        >
          <span className={`BuySellLabel ${isBuying ? "active" : ""}`}>
            Buy
          </span>
        </Box>
        <Box
          onClick={() => setIsBuying(false)}
          className={`BuySellSwitch ${!isBuying ? "active" : ""}`}
        >
          <span className={`BuySellLabel ${!isBuying ? "active" : ""}`}>
            Sell
          </span>
        </Box>
        <Box className='BetDuration'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={CLOCK_ICON} />
          </Box>
          <div>
            {daysRemaining}d: {hoursRemaining}h : {minutesRemaining}m
          </div>
        </Box>
      </Box>
      <Box className='BetActions'>
        <span className='BetActions-Label'>Your Prediction</span>
        <Box className='BetOptionsContainer'>
          <span className='BetOptionsLabel'>Choose your option</span>
          <Box
            onClick={() => {
              settled ? "" : setChoice(0);
            }}
            className={choice === 0 ? "BetOptionActive" : "BetOption"}
          >
            <span
              className={
                settled ? (outcomes.length > 0 && outcomes[0]?.winner ? "Green" : "Red") : "Green"
              }
            >
              {outcomes.length > 0 ? outcomes[0]?.name : "Yes"}
            </span>
            <Box className='RadioButtonContainer'>
              <span className='RadioLabel'>${price1.toFixed(2)}</span>
              <Box className='RadioButton'>
                <Box className='RadioButtonInner'></Box>
              </Box>
            </Box>
          </Box>
          <Box
            onClick={() => {
              settled ? "" : setChoice(1);
            }}
            className={choice === 1 ? "BetOptionActive" : "BetOption"}
          >
            <span className={
                settled ? (outcomes.length > 0 && outcomes[1]?.winner ? "Green" : "Red") : "Red"
              }>
              {outcomes.length > 0 ? outcomes[1].name : "No"}
            </span>
            <Box className='RadioButtonContainer'>
              <span className='RadioLabel'>${price2.toFixed(2)}</span>
              <Box className='RadioButton'>
                <Box className='RadioButtonInner'></Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {isBuying ? renderBuy() : settled ? renderClaim() : renderSell()}
      </Box>
      {isBuying ? (
        <Box className='ReturnStats'>
          <span className='ReturnLabel'>Avg. Price</span>
          <Box className='ReturnValue'>
            <span className={betAmount == "" ? "Gray" : "Green"}>
              {minAmount?(
                      (parseFloat(betAmount) / parseFloat(minAmount)) *
                      1e6*2569
                    ).toFixed(2)
                : 0}
            </span>
            <Box className='Starknet-logo'>
              <CustomLogo src={USDC_LOGO} />                                                                                                                                                                     
            </Box>
          </Box>
        </Box>
      ) : (
        ""
      )}
      {!settled && (
        <Box className='ReturnStats'>
          <span className='ReturnLabel'>
            Shares {isBuying ? "" : "To Sell"}
          </span>
          <Box className='ReturnValue'>
            <span className={betAmount == "" ? "Gray" : "Green"}>
              {isBuying
                ? minAmount
                  ? (parseFloat(minAmount) / 1e6).toFixed(2)
                  : 0
                : minAmountSell
                ? (parseFloat(minAmountSell) ).toFixed(2)
                : 0.00}
            </span>
          </Box>
        </Box>
      )}
      {address ? (
       <Box
       onClick={
         settled
           ? () => claimWinnings()// Ensure this is a function call
           : isBuying
           ? () => PlaceFPMMBet() // Call function to place the bet
           : () => SellMarketShares() // Call function to sell shares
       }
       className={`ActionBtn`}
     >
       {settled ? (
         Number(betAmount) > 0 ? "Claim Winnings!" : "No Winnings"
       ) : betAmount === "" ? (
         "Enter Amount"
       ) : isBuying ? (
         parseFloat(balance) >= parseFloat(betAmount) // Use >= for inclusive check
           ? "Place Order"
           : "Insufficient Balance"
       ) : (
         parseFloat(userMarketShare) >= parseFloat(betAmount) // Use >= for inclusive check
           ? "Place Order"
           : "Insufficient Shares"
       )}
     </Box>
     
      ) : (
        <Box
          onClick={() => connect({ connector: connectors[0] })}
          className='ActionBtn'
        >
          Connect Wallet
        </Box>
      )}
    </Box>
  );
};

export default BetActions;
