import Head from 'next/head'
import HeroImage from '../components/HeroImage'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Image from 'next/image'
import Router from 'next/router';
import publicIp from "public-ip";
import { useWeb3React } from "@web3-react/core";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import useEagerConnect from "../hooks/useEagerConnect";

export const getClientIp = async () => await publicIp.v4({
  fallbackUrls: [ "http://whatismyip.akamai.com/","https://ifconfig.co/ip","http://ipv4.icanhazip.com","https://ifconfig.io/ip","http://checkip.amazonaws.com/","http://ipecho.net/plain" ]
});

function Form(args) {
  const [data, setData] = useState({'result':false,'showError':false,'hideInput':false,'loadingTxn':false});
  const registerUser = async event => {
    event.preventDefault()

    let initialData = data;
    initialData = {
      showError: false,
      address: event.target.rcpAddress.value,
      hideInput: true,
      loadingTxn: true
    };
    setData(initialData);
    
    const res = await fetch(
      '/api/sendFunds',
      {
        body: JSON.stringify({
          address: event.target.rcpAddress.value,
          ip_address: args.ip_address
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    const result = await res.json()
    
    data["showError"] = true;
    data["hideInput"] = true;
    data["loadingTxn"] = false;
    data["address"] = initialData.address;
    data["result"] = result.result;
    setData(data);
    event.target.reset();
    
    return true;
  }

  return (
    <form onSubmit={registerUser}>
      {!data.hideInput && <label htmlFor="rcpAddress">BSC Address: </label> }
      {!data.hideInput && <input id="rcpAddress" name="rcpAddress" type="text" autoComplete="rcpAddress" size="42" pattern="^0x[a-fA-F0-9]{40}$" required /> }
      {!data.hideInput && <button type="submit">Send</button>}
      {!data.hideInput && <br/>}
      {data.loadingTxn && !data.showError && <Image src="/images/Eclipse-1s-200px.svg" height={47} width={47} alt="Loading" /> }
      {data.showError && <center><label id="resultStatus" ><b>{data.result == false ? "Success! Sent tokens to "+data.address : "Error: "+data.result}</b></label></center> }
    </form>
  )
}


function AddToMetaMask(args) {
  const tokenAddress = args.contractAddress;
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
}

export default function Home(props) {
  const [data, setData] = useState(props);
  
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  useEffect(() => {
    if(data.updated === false) {
      const grabIPv4 = async () => {
        const clientIP = await getClientIp();
        const tmpData = {
          contract_address: data.contract_address,
          ip_address: clientIP,
          updated: true
        };
        
        //console.log("Client IP address in Home component:",tmpData.ip_address);
        setData(tmpData);
      }
      grabIPv4();
    }
  });
  
  return (
    <div className="container">
      <Head>
        <title>Rug and Tug</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <HeroImage/>
        <h1 className="title">
          <Link href="https://bscscan.com/token/0xB44cf912E9D0341e92f64f4a0642393B7f3526C4"><a>Rug</a></Link> and Tug!
        </h1>
        <Account triedToEagerConnect={triedToEagerConnect} />
        <ETHBalance />
        <p className="description">
          Get started by entering a BSC address
        </p>
        <small>One use per day, per address</small>
        <Form ip_address={data.ip_address}/>
        <AddToMetaMask contractAddress={data.contract_address}/>
      </main>
      <small>
      <p>Donate BAN: <a href="ban:ban_1fundmhojrgz3fw4grh35kgh4671ho59fzauskqr76qi9bn3ae6pwwgadugt">ban_1fundmhojrgz3fw4grh35kgh4671ho59fzauskqr76qi9bn3ae6pwwgadugt</a></p>
      <p>Donate NANO: <a href="nano:nano_1rugmijei7wjgyjujtuobwougf9m8jhwswxaxw6cromr6jeitxsjrs5bo4uu">nano_1rugmijei7wjgyjujtuobwougf9m8jhwswxaxw6cromr6jeitxsjrs5bo4uu</a></p>
      </small>
      <footer>
        <a
          href="https://chat.banano.cc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/images/banano-mark.svg" alt="Banano Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export async function getStaticProps(context) {
  const clientIP = await getClientIp();
  console.log("Client IP in getStaticProps?",clientIP);
  return {
    props: {
      contract_address: process.env.FAUCET_CONTRACT_ADDRESS  || "0x041D49e52EaEeF72B2c554a92ED665a268056b1d",
      ip_address: clientIP,
      updated: false
    }, // will be passed to the page component as props
  }
}