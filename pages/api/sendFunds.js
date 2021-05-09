import { ethers } from "ethers";

const RUGPULL_ABI = require('../../lib/RugpullToken.json');

const BSC_NODE_URL = process.env.BSC_NODE_URL || 'https://bsc-dataseed.binance.org/';

const contractAbi = new ethers.utils.Interface(RUGPULL_ABI);

const provider = new ethers.providers.JsonRpcProvider(BSC_NODE_URL);
const signer = provider.getSigner();

const BSC_WALLET_PRIVATE_KEY = process.env.BSC_WALLET_PRIVATE_KEY;

const wallet = new ethers.Wallet(BSC_WALLET_PRIVATE_KEY, provider);

//const TIME_TO_WAIT = (60*60*24)*1000;
const TIME_TO_WAIT = (120)*1000; //two hour wait
let addressList = [{}];

export default async function handler(req, res) {
    console.log(await provider.getBlockNumber());
    //console.log(await provider.listAccounts());
    console.log(await wallet.address);
    console.log(await wallet.provider.getNetwork());

    let sentSuccess;
    /*
    if(provider.getBalance('0xC61fF36ce9aC0EBCc1ca63ECE752a1fc2c89e2c6','PULL') < 1000) {
        res.status(200).json({ text: "out of funds" });
    }
    */
    if(validateAddress(req.body.address)) {
        sentSuccess = sendFunds(req.body.address);
    }
    /*
    console.log("Testing timing...");
    const time1 = Date.now();
    console.log("Time 1:",time1);
    for(let i=10;i>0;i--){
        console.log(i);
    }
    const time2 = Date.now();
    console.log("Time 2:",time2);
    console.log("Time taken:",time2-time1);
    */
    res.status(200).json({ text: sentSuccess });
  }

function validateAddress(address) {
    let addressLookup = addressList.find(entry => entry.address === address);
    if(addressLookup) {
        console.log("Found previous entry for",address);
        let remainingTime = (TIME_TO_WAIT-(Date.now()-addressLookup.timestamp));
        console.log("Remaining time (seconds): ",parseInt(remainingTime/1000));
        if(remainingTime > 0) {
            return false;
        } else {
            console.log("Found OLD entry for",address);
            removeByAttr(addressList,"address",address);
            return true
        }
    } else {
    return true;
    }
}

async function sendFunds(address) {
    console.log("Sending funds to",address);

    const faucetContract = new ethers.Contract('0xB44cf912E9D0341e92f64f4a0642393B7f3526C4',contractAbi,wallet);
    //console.log(faucetContract);
    const ownerAddress = await wallet.getAddress();
    const spenderAddress = ownerAddress;
    console.log("Owner address:",ownerAddress);
    console.log("Spender address:",spenderAddress);
    let allowFunds = await faucetContract.allowance(ownerAddress,spenderAddress);
    console.log("Allowance:",ethers.utils.formatEther(allowFunds));
    let sendFundsFromFaucet = await faucetContract.transferFrom(spenderAddress,address,ethers.utils.parseEther('1000'),{gasLimit:250000});
    console.log("From address:",await wallet.getAddress(1));
    let balancePULL = await faucetContract.balanceOf(spenderAddress);
    console.log("PULL balance:",ethers.utils.formatEther(balancePULL));
    const faucetEvents = faucetContract.filters.Transfer(null,address);
    if(faucetEvents) { 
        //console.log(sendFundsFromFaucet);
        let addressEntry = {
            "address": address,
            "timestamp":Date.now()
        };
        addressList.push(addressEntry);
        console.log("Success!");
        return true;
    } else {
        console.error("Failed to send transaction, no event emitted");
        return false;
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