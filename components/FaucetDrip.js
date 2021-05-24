import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";

const FaucetDrip = () => {
  const { account } = useWeb3React();
  const { contractAddress } = 0x12DE85df2AD3127B9D441eeCCa409C0AdAF59edD;
  const { jsonABI } = require("../lib/FaucetDrip.json");
  const { contract } = useContract(contractAddress,jsonABI);

  return (
    <button
            onClick={(data) => {
              contract.faucetDrip();
            }}
          >
            Drip PULL
          </button>
  );
};

export default FaucetDrip;
