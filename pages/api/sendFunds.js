const TIME_TO_WAIT = 600*1000;
let addressList = [{}];

export default function handler(req, res) {
    let sentSuccess;
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
    res.status(200).json({ text: sentSuccess })
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