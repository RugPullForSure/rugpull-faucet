import { formatUnits } from "@ethersproject/units";

export function shortenHex(hex, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

const ETHERSCAN_PROVIDER = {
  56: "bscscan.com",
  97: "bscscan.com",
  137: "polygonscan.com",
  80001: "polygonscan.com"
}

const ETHERSCAN_PREFIXES = {
  56: "",
  97: "testnet.",
  137: "",
  80001: "mumbai."
};

/**
 *
 * @param {("Account"|"Transaction")} type
 * @param {[number, string]} data
 */
export function formatEtherscanLink(type, data) {
  switch (type) {
    case "Account": {
      const [chainId, address] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}${ETHERSCAN_PROVIDER[chainId]}/address/${address}`;
    }
    case "Transaction": {
      const [chainId, hash] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}${ETHERSCAN_PROVIDER[chainId]}/tx/${hash}`;
    }
  }
}

/**
 * @name parseBalance
 *
 * @param {import("@ethersproject/bignumber").BigNumberish} balance
 * @param {number} decimals
 * @param {number} decimalsToDisplay
 *
 * @returns {string}
 */
export const parseBalance = (balance, decimals = 18, decimalsToDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);
