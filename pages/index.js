import Head from 'next/head'
import HeroImage from '../components/HeroImage'
import Link from 'next/link'
import { useEffect, useState } from 'react';

function Form() {
  const [data, setData] = useState({'result':false,'showError':false});
  const registerUser = async event => {
    event.preventDefault()

    const res = await fetch(
      '/api/sendFunds',
      {
        body: JSON.stringify({
          address: event.target.rcpAddress.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    const result = await res.json()
    //console.log("True or False?", (result.result ? "True" : "False"));
    let tmpData = {
      result: result.result,
      showError: true
    };
    setData(tmpData);
    return result;
  }

  return (
    <form onSubmit={registerUser}>
      <label htmlFor="rcpAddress">BSC Address: </label>
      <input id="rcpAddress" name="rcpAddress" type="text" autoComplete="rcpAddress" size="42" pattern="^0x[a-fA-F0-9]{40}$" required />
      <button type="submit">Send</button><br/>
      {data.showError && <center><label id="resultStatus" ><b>{data.result ? "Success, sent tokens!" : "Error"}</b></label></center> }
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
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <HeroImage/>
        <h1 className="title">
          <Link href="https://bscscan.com/token/0xB44cf912E9D0341e92f64f4a0642393B7f3526C4"><a>Rug Pull</a></Link> Faucet, For Sure
        </h1>

        <p className="description">
          Get started by entering a BSC address
        </p>
        <small>2 hour delay per address</small>
        <Form/>
        <AddToMetaMask contractAddress={props.contract_address}/>
      </main>

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
  return {
    props: {
      contract_address: process.env.FAUCET_CONTRACT_ADDRESS  || "0x041D49e52EaEeF72B2c554a92ED665a268056b1d"
    }, // will be passed to the page component as props
  }
}