import { ethers } from "ethers";
import { getEntry } from "./get-entry";
import { addUser } from "./create-entry";

const RUGPULL_ABI = require('../../lib/RugpullToken.json');
const FAUCET_CONTRACT_ADDRESS = process.env.FAUCET_CONTRACT_ADDRESS;
const BSC_NODE_URL = process.env.BSC_NODE_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/';

const contractAbi = new ethers.utils.Interface(RUGPULL_ABI);

const provider = new ethers.providers.JsonRpcProvider(BSC_NODE_URL);
const signer = provider.getSigner();

const BSC_WALLET_PRIVATE_KEY = process.env.BSC_WALLET_PRIVATE_KEY;

const wallet = new ethers.Wallet(BSC_WALLET_PRIVATE_KEY, provider);

const TIME_TO_WAIT = (60*60*24)*1000;
//const TIME_TO_WAIT = (60*60*12)*1000; //two hour wait

export default async function handler(req, res) {
    console.log(await provider.getBlockNumber());
    //console.log(await provider.listAccounts());
    console.log(await wallet.address);
    console.log(await wallet.provider.getNetwork());

    let sentResult;

    const validationResponse = await validateAddress(req.body.address,req.body.ip_address);
    if(!validationResponse) {
        sentResult = await sendFunds(req.body.address,req.body.ip_address);
    } else {
        sentResult = validationResponse;
    }
    console.log("sentResult:",sentResult);
    res.status(200).json({ result: sentResult });
  }

async function validateAddress(address,ip_address) {
    const lookupIPAddress = await getEntry(ip_address);
    if (lookupIPAddress === undefined || lookupIPAddress.length == 0) {
        return false;
    } else {
        console.log("IP address still on cooldown: ",ip_address);
        return "IP address on cooldown";
    }
}

async function sendFunds(address,ip_address) {
    console.log("Sending funds to",address);

    const faucetContract = new ethers.Contract(FAUCET_CONTRACT_ADDRESS,contractAbi,wallet);
    //console.log(faucetContract);
    const ownerAddress = await wallet.getAddress();
    const spenderAddress = ownerAddress;
    console.log("Owner address:",ownerAddress);
    console.log("Spender address:",spenderAddress);
    let allowFunds = await faucetContract.allowance(ownerAddress,spenderAddress);
    console.log("Allowance:",ethers.utils.formatEther(allowFunds));
    //await faucetContract.transferFrom(spenderAddress,address,ethers.utils.parseEther('10000'),{gasLimit:250000});
    console.log("From address:",await wallet.getAddress(1));
    let balancePULL = await faucetContract.balanceOf(spenderAddress);
    console.log("PULL balance:",ethers.utils.formatEther(balancePULL));
    const faucetEvents = faucetContract.filters.Transfer(null,address);
    if(faucetEvents) { 
        console.log(faucetEvents);
        const addToListResponse = await addUser(ip_address,address);
        console.log("API call to add to the cooldown list:",addToListResponse);
        console.log("Success!");
        return false;
    } else {
        console.error("Failed to send transaction, no event emitted");
        return "Failed to send transaction, no event emitted";
    }
}
