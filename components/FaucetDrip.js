import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";
import FAUCET_ABI from "../lib/FaucetDrip.json";

const FaucetDrip = () => {
  const { account } = useWeb3React();
  //const contractAddress = "0x12DE85df2AD3127B9D441eeCCa409C0AdAF59edD";
  const contractAddress = "0x90625Ea4Bdfe50BB9dBdA9Ab3FC25fd9f4B677db";
  const contract = useContract(contractAddress,FAUCET_ABI,true);
  /*
  console.log(account);
  console.log(FAUCET_ABI);
  console.log(contractAddress);
  console.log(contract);
  */
  if(typeof contract != "undefined") {
    return (      
      <button onClick={() => { contract.faucetDrip(); }}> 
      Click here to use faucet smart contract
      </button>
    );
  } else {
    return (
      <label>Not connected to wallet</label>
    );
  }
};

export default FaucetDrip;
