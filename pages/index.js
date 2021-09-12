import Head from 'next/head'
import HeroImage from '../components/HeroImage'
import Link from 'next/link'
import { useEffect, useState, useContext } from 'react';
import Image from 'next/image'
import Router from 'next/router';
import publicIp from "public-ip";
import { useWeb3React } from "@web3-react/core";
import Card from "../components/Card";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import FaucetDrip from "../components/FaucetDrip";

import useEagerConnect from "../hooks/useEagerConnect";
import { ThemeContext } from 'styled-components'

export const getClientIp = async () => await publicIp.v4({
  fallbackUrls: [ "http://whatismyip.akamai.com/","https://ifconfig.co/ip","http://ipv4.icanhazip.com","https://ifconfig.io/ip","http://checkip.amazonaws.com/","http://ipecho.net/plain" ]
});

export default function Home(props) {
  const [data, setData] = useState(props);
  
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();
  const theme = useContext(ThemeContext);
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
          <Link href="https://rugpull.best"><a>Rug</a></Link> and Tug faucet!
        </h1>
        <p className="description">100,000 PULL for the price of gas! Connect your wallet to get started!
        </p>
        <Account triedToEagerConnect={triedToEagerConnect} />
        <ETHBalance />
        <FaucetDrip />
        
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
  //console.log("Client IP in getStaticProps?",clientIP);
  return {
    props: {
      contract_address: "",
      ip_address: clientIP,
      updated: false
    }, // will be passed to the page component as props
  }
}