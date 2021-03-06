import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { ThemeContextProvider } from '../ThemeContext'

function getLibrary(provider) {
  return new Web3Provider(provider);
}

export default function RugpullFaucetApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeContextProvider>
      <Component {...pageProps} />
      </ThemeContextProvider>
    </Web3ReactProvider>
  );
}
