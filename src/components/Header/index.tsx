import { NextPage } from "next";
import "./styles.scss";
import { motion } from "framer-motion";
import CustomLogo from "../common/CustomIcons";
import HeaderLink from "./HeaderLink";
import WalletButton from "./WalletButtons/index";

interface Props {}

const Header: NextPage<Props> = ({}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="Header-Wrapper"
    >
      <div className="Header-LogoContainer">
        <div className="Header-Logo">
          <CustomLogo src="https://firebasestorage.googleapis.com/v0/b/baseforesight.appspot.com/o/ForeCast.png?alt=media&token=37adfd91-84dc-42a0-b671-af8dc2eefeb9" />
        </div>
      </div>
      <div className="Header-LinksContainer">
        <HeaderLink
          link="/"
          whiteIcon="/assets/icons/homeicon-white.svg"
          coloredIcon="/assets/icons/homeicon.svg"
          linkCTA="Home"
        />
        <HeaderLink
          link="/my-bets"
          whiteIcon="/assets/icons/bets-white.svg"
          coloredIcon="/assets/icons/bets.svg"
          linkCTA="Trades"
        />
      </div>
      <div className="Header-ButtonsContainer">
        <WalletButton />
      </div>
    </motion.div>
  );
};

export default Header;
