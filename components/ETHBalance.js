import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../hooks/useETHBalance";

const ETHBalance = () => {
  const { account } = useWeb3React();
  const { data } = useETHBalance(account);

  return <p>Balance: Ƀ{data}</p>;
};

export default ETHBalance;
