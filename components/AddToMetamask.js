import { useWeb3React } from "@web3-react/core";

const AddToMetaMask = () => {
    const {account, chainId} = useWeb3React();
    //console.log(chainId);
    const contractAddress = {
      56: "0xb44cf912e9d0341e92f64f4a0642393b7f3526c4",
      137: "0xb44cf912e9d0341e92f64f4a0642393b7f3526c4",
      97: "0x041d49e52eaeef72b2c554a92ed665a268056b1d", 
      80001: "0xb44cf912e9d0341e92f64f4a0642393b7f3526c4"
    }
    const tokenAddress = contractAddress[chainId];
    const tokenSymbol = 'PULL';
    const tokenDecimals = 18;
    let tokenImage = '';
    if (typeof window !== 'undefined') {
      tokenImage = window.location.protocol + "//" + window.location.host+'/images/rugpull.png';
    } else {
      tokenImage = '/images/rugpull.png';
    }
    //console.log(tokenImage);
    const tryAdd = async () => {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });
  
        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <a href="#" onClick={tryAdd}><small>Add to MetaMask</small></a>
    )
};

export default AddToMetaMask;
