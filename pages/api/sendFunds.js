import { ethers } from "ethers";

const BSC_NODE_URL = process.env.BSC_NODE_URL || 'https://bsc-dataseed.binance.org/';

const provider = new ethers.providers.JsonRpcProvider(BSC_NODE_URL);
const signer = provider.getSigner();

const BSC_WALLET_MNEMONIC = process.env.BSC_WALLET_MNEMONIC;

const wallet = ethers.Wallet.fromMnemonic(BSC_WALLET_MNEMONIC);

//const TIME_TO_WAIT = (60*60*24)*1000;
const TIME_TO_WAIT = (10)*1000;
let addressList = [{}];

export default async function handler(req, res) {
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
    console.log(await provider.getBlockNumber());
    console.log(await provider.listAccounts());
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



    let addressEntry = {
        "address": address,
        "timestamp":Date.now()
    };
    addressList.push(addressEntry);
    return true;
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