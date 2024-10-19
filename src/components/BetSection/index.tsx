import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import {ethers} from "ethers"
import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { AMMA_LOGO, F1_LOGO, US_LOGO } from "../helpers/icons";
import ABI from "../../abi/FPMMMarket.json"
import { contractAddress } from "../helpers/constants";
import { FPMMMarket, FPMMMarketInfo, Market } from "../helpers/types";
import { getNumber, getString } from "../helpers/functions";
import { motion } from "framer-motion";
import CustomLoader from "../common/CustomLoader";
import ContBetCard from "./ContBetCard";
import axios from "axios";
interface Props {}

const tabList = [
  {
    tabName: "Markets",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [contMarkets, setContMarkets] = useState<FPMMMarketInfo[]>([]);
  const betCardWrapperDiv = useRef<HTMLDivElement | null>(null);

  const scrollToElement = () => {
    if (betCardWrapperDiv.current) {
      betCardWrapperDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };

 
  useEffect(() => {
    const getAllMarkets = async () => {
      setLoading(true);
      await axios
        .get(`${process.env.SERVER_URL!}/get-all-markets`)
        .then((res) => {
          console.log(res);
          setContMarkets(res.data);
        });
      setLoading(false);
    };
    getAllMarkets();
  }, []);


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
          {tabList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveTab(index);
              }}
              className={activeTab === index ? "Tab-Active" : "Tab"}
            >
              {item.tabName}
            </div>
          ))}
        </div>
        <div className='BetCard-Wrapper'>
          {loading ? (
            <div className='LoaderDiv'>
              <CustomLoader size={"55"} color='#9C9C9C' />
            </div>
          ) : activeTab == 1 ? (
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
