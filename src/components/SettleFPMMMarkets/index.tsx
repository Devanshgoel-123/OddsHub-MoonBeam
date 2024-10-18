import { NextPage } from "next";
import "./styles.scss";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "react-select";
import { contractAddress } from "../helpers/constants";
import {abi} from "../../abi/FPMMMarket.json";
import {
  FPMMMarket,
  ContractData,
  FPMMOutcome,
  ContractReadResult
} from "../helpers/types";
import { Radio, RadioGroup } from "rsuite";
import { getString } from "../helpers/functions";
import useSettleFPMMMarket from "../hooks/useSettleFPMMMarket";
import { useReadContract } from "wagmi";


interface Props {}

const SettleFPMMMarkets: NextPage<Props> = ({}) => {
  const [marketId, setMarketId] = useState<any>(0);
  const [value, setValue] = useState<any>(0);
  const [market, setMarket] = useState<FPMMMarket | null>(null);
  const [outcomes, setOutcomes] = useState<FPMMOutcome[]>([]);
  const {settleMarket}  = useSettleFPMMMarket({
    marketId: marketId,
    outcome: value,
  });

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
  
    
  const handleMarketId = (e: any) => {
    setMarketId(e.target.value);
  };

  const handleSettleMarket = async () => {
    try {
      const trxhash=await settleMarket();
      console.log(trxhash);
      alert("Market settled successfully!");
    } catch (error) {
      console.error("Failed to settle market:", error);
      alert("Failed to settle market. Check console for details.");
    }
  };
  return (
    <div>
      <Box className='InputContainer'>
        <span className='Label'>
          Market Id:{" "}
          <input
            className='InputField'
            type='string'
            id='numberInput'
            name='numberInput'
            value={marketId}
            onChange={(e) => handleMarketId(e)}
          />
        </span>
      </Box>

      {marketId && (
        <Box className='InputContainer'>
          <span className='Label'>Outcome</span>
          <Box className='Input'>
            <RadioGroup
              value={value}
              onChange={setValue}
              name='radio-group'
              defaultValue='Yes'
            >
              <Radio value={0}>
                {outcomes[0] && outcomes[0]?.name}
              </Radio>
              <Radio value={1}>
                {outcomes[1] && outcomes[1]?.name}
              </Radio>
            </RadioGroup>
          </Box>
        </Box>
      )}
      {marketId && (
        <Box className='Submit'>
          <button onClick={handleSettleMarket} className='SubmitButton'>
            Settle Market
          </button>
        </Box>
      )}
    </div>
  );
};

export default SettleFPMMMarkets;
