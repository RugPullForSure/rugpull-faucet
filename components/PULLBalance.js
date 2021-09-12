import { useWeb3React } from "@web3-react/core";
import useERC20Contract from "../hooks/useERC20Contract";
import { Text } from '@pancakeswap-libs/uikit'

const PULLBalance = () => {
  const { account } = useWeb3React();
  console.log("Metamask Address:",account);
  //const contractAddress = "0x041d49e52eaeef72b2c554a92ed665a268056b1d";
  const contractAddress = "0xb44cf912e9d0341e92f64f4a0642393b7f3526c4";
  const token = useERC20Contract(contractAddress);
  console.log(token);
  token.functions.balanceOf(account).then( (balance) => {
    return (
      <p>PULL Balance: {balance}</p>
    )
  });
};

export default PULLBalance;
