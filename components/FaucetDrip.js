import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";
import FAUCET_ABI from "../lib/FaucetDrip.json";
import { Button } from '@pancakeswap-libs/uikit'

const FaucetDrip = () => {
  const { account, chainId } = useWeb3React();
  const contractAddress = {
  // BSC Testnet
  97: "0x12DE85df2AD3127B9D441eeCCa409C0AdAF59edD",
  // BSC Mainnet
  56:"0x90625Ea4Bdfe50BB9dBdA9Ab3FC25fd9f4B677db",
  // Polygon Mainnet
  137: "0x6aEcD040A5d1f164c189CfE54f88c9885a21a6F4",
  // Polygon Testnet
  80001: "0xcEbF3C78849a95Be3398afc0d5832b0dDdE88cBB"
  }
  const contract = useContract(contractAddress[chainId],FAUCET_ABI,true);
  /*
  console.log(account);
  console.log(chainId);
  console.log(FAUCET_ABI);
  console.log(contractAddress);
  console.log(contract);
  */
  if(typeof contract != "undefined") {
    return (  
      <Button onClick={() => { contract.faucetDrip(); }} variant="primary"> 
      Click here to PULL from the faucet!
      </Button>
    );
  } else {
    return (
      <label>Not connected to wallet</label>
    );
  }
};

export default FaucetDrip;
