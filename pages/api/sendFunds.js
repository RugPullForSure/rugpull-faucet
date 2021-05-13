import { ethers } from "ethers";

const RUGPULL_ABI = require('../../lib/RugpullToken.json');
const FAUCET_CONTRACT_ADDRESS = process.env.FAUCET_CONTRACT_ADDRESS;
const BSC_NODE_URL = process.env.BSC_NODE_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/';

const contractAbi = new ethers.utils.Interface(RUGPULL_ABI);

const provider = new ethers.providers.JsonRpcProvider(BSC_NODE_URL);
const signer = provider.getSigner();

const BSC_WALLET_PRIVATE_KEY = process.env.BSC_WALLET_PRIVATE_KEY;

const wallet = new ethers.Wallet(BSC_WALLET_PRIVATE_KEY, provider);

//const TIME_TO_WAIT = (60*60*24)*1000;
const TIME_TO_WAIT = (60*60*12)*1000; //two hour wait
let addressList = [{}];

export default async function handler(req, res) {
    console.log(await provider.getBlockNumber());
    //console.log(await provider.listAccounts());
    console.log(await wallet.address);
    console.log(await wallet.provider.getNetwork());

    let sentResult;

    const validationResponse = validateAddress(req.body.address);
    if(!validationResponse) {
        sentResult = await sendFunds(req.body.address);
    } else {
        sentResult = validationResponse;
    }
    console.log("sentResult:",sentResult);
    res.status(200).json({ result: sentResult });
  }

function validateAddress(address) {
    let addressLookup = addressList.find(entry => entry.address === address);
    if(addressLookup) {
        console.log("Found previous entry for",address);
        let remainingTime = (TIME_TO_WAIT-(Date.now()-addressLookup.timestamp));
        const thenDate = new Date(addressLookup.timestamp);
        const nowDate = new Date(Date.now());
        console.log("thenDate:",thenDate);
        console.log("nowDate:",nowDate);
        console.log("thenDate.getDate():", thenDate.getDate());
        console.log("nowDate.getDate():",nowDate.getDate());
        if(nowDate.getDate() > thenDate.getDate() || nowDate.getMonth() != thenDate.getMonth()) {
            remainingTime = 0;
        }
        console.log("Remaining time (seconds): ",parseInt(remainingTime/1000));
        if(remainingTime > 0) {
            return "Try again tomorrow, please!";
        } else {
            console.log("Found OLD entry for",address);
            removeByAttr(addressList,"address",address);
            return false;
        }
    } else {
    return false;
    }
}

async function sendFunds(address) {
    console.log("Sending funds to",address);

    const faucetContract = new ethers.Contract(FAUCET_CONTRACT_ADDRESS,contractAbi,wallet);
    //console.log(faucetContract);
    const ownerAddress = await wallet.getAddress();
    const spenderAddress = ownerAddress;
    console.log("Owner address:",ownerAddress);
    console.log("Spender address:",spenderAddress);
    let allowFunds = await faucetContract.allowance(ownerAddress,spenderAddress);
    console.log("Allowance:",ethers.utils.formatEther(allowFunds));
    await faucetContract.transferFrom(spenderAddress,address,ethers.utils.parseEther('10000'),{gasLimit:250000});
    console.log("From address:",await wallet.getAddress(1));
    let balancePULL = await faucetContract.balanceOf(spenderAddress);
    console.log("PULL balance:",ethers.utils.formatEther(balancePULL));
    const faucetEvents = faucetContract.filters.Transfer(null,address);
    if(faucetEvents) { 
        console.log(faucetEvents);
        let addressEntry = {
            "address": address,
            "timestamp":Date.now()
        };
        addressList.push(addressEntry);
        console.log("Success!");
        return false;
    } else {
        console.error("Failed to send transaction, no event emitted");
        return "Failed to send transaction, no event emitted";
    }
}

var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}