const inTestMode = !!process.env.TEST_MODE;

export default {
  methods:{
    txHashUrl(network, txHash){
      switch (network) {
        case 'ethereum':
          return `https://${inTestMode?"ropsten.":""}etherscan.io/tx/${txHash}`;
        case 'bitcoin':
          return `https://www.blockchain.com/${inTestMode?"btctest":"btc"}/tx/${txHash}`;
      }
    },
    walletAddressUrl(network, wallet){
      switch (network) {
        case 'ethereum':
          return `https://${inTestMode?"ropsten.":""}etherscan.io/address/${wallet}`;
        case 'bitcoin':
          return `https://www.blockchain.com/${inTestMode?"btctest":"btc"}/address/${wallet}`;
      }
    }
  }
}
