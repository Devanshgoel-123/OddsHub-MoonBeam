import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import {  FPMMMarketInfo } from "../helpers/types";
import { motion } from "framer-motion";
import CustomLoader from "../common/CustomLoader";
import ContBetCard from "./ContBetCard";
import abi from "@/abi/MarketFactory";
import axios from "axios";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { useGetMarket } from "../hooks/useGetMarkets";

interface Props {}

const tabList = [
  {
    tabName: "Markets",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [contMarkets, setContMarkets] = useState<FPMMMarketInfo[]>([]);
  const betCardWrapperDiv = useRef<HTMLDivElement | null>(null);

  const scrollToElement = () => {
    if (betCardWrapperDiv.current) {
      betCardWrapperDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const result=useGetMarket(0);
  // useEffect(() => {
  //   const getAllMarkets = async () => {
  //     setLoading(true);
  //     const markets: FPMMMarketInfo[] = [];
  //   try {
      
  //       console.log(result, 'market fetched');
  //       // markets.push(market as FPMMMarketInfo);
  //     setContMarkets(markets);
  //   } catch (err) {
  //     console.error('Error fetching markets:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  //   };
  //   getAllMarkets();
  // }, []);


  return (
    <div className='BetSection'>
      <div className='BetSection-Hero'>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={1}
            category='Sports'
            categoryLogo='/assets/logos/WC.jpeg'
            categoryName='India vs Pakistan'
            cardBgColor='#000000'
            image='/assets/images/crick.svg'
            scrollFn={scrollToElement}
            enabled={true}
          />
        </div>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={1}
            category='Crypto Market'
            categoryLogo='/assets/logos/btc.webp'
            categoryName='Crypto Prices'
            cardBgColor='#000000'
            image='/assets/images/crypto.svg'
            scrollFn={scrollToElement}
            height='230px'
            width='370px'
            enabled={true}
          />
        </div>
      </div>
      <div ref={betCardWrapperDiv} className='BetSection-CardWrapper'>
        <div className='Tabs-Section'>
            <div className="Tab">
              Markets
            </div>
        </div>
        <div className='BetCard-Wrapper'>
          {loading ? (
            <div className='LoaderDiv'>
              <CustomLoader size={"55"} color='#9C9C9C' />
            </div>
          ) : activeTab == 0 ? (
            contMarkets.filter((market) => market.active).length > 0 ? (
              contMarkets
                .filter((market) => market.active)
                .map((item, index) => (
                  <div key={index} className='BetCard-Container'>
                    <ContBetCard
                      marketId={item.market_id}
                      category={item.category}
                      logo={item.icon}
                      deadline={item.deadline}
                      heading={item.question}
                      subHeading={item.description}
                      outcomes={item.outcomes}
                      isActive={item.active}
                    />
                  </div>
                ))
            ) : (
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.25 }}
                className='PlaceholderText'
              >
                No Active Events
              </motion.span>
            )
          ) : (
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className='PlaceholderText'
            >
              No Active Events
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetSection;
