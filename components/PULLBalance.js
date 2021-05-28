import { useWeb3React } from "@web3-react/core";
import useERC20Contract from "../hooks/useERC20Contract";

function PULLBalance() {
  const { account } = useWeb3React();
  console.log("Metamask Address:",account);
  const contractAddress = "0x041d49e52eaeef72b2c554a92ed665a268056b1d";
  const token = useERC20Contract(contractAddress);
  token.balanceOf(account).then(balance => {
    return <p>Balance: {balance} PULL</p>;
  })
  //console.log("Balance:",token.functions.balanceOf(account));
  
};

export default PULLBalance;
