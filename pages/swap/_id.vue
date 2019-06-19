<template>
  <div>
    <div class="card-body" style="position: relative">
      <div v-if="loading" class="text-center" style="position: absolute; top: 0; left: 0; width: 100%">
        <i style="font-size: 2em" class="fa fa-spinner fa-lg fa-spin"></i>
      </div>
      <div v-if="swap">
        <div class="bg-white pd10">
          <StepProgress
            class="d-block d-md-none"
            :length="$t('pages.swapView.progressSteps').length"
            :labels="$t('pages.swapView.progressSteps')"
            :step="swapStatus"
          />
          <div class="swap-view">
            <div class="d-flex">
              <div class="d-flex flex-grow-0" style="align-items: center">
                <div style="padding-right: 1em">
                  <CoinAvatar size="5" :coin="swap.depositCoin"/>
                </div>
                <div class="d-none d-sm-block">
                  <div class="font-2xl text-bold">{{swap.depositAmount}}</div>
                  <div class="font-2xl text-bold color-orange">{{swap.depositCoin.code}}</div>
                  <!--<div class="font-1xl text-bold">{{swap.depositCoin.title}}</div>-->
                </div>
              </div>
              <div class="flex-grow-1">
                <i class="icons font-5xl d-block cui-arrow-right d-block d-md-none text-center"
                   style="margin-top: 1rem"></i>
                <StepProgress
                  class="d-none d-md-block"
                  :length="$t('pages.swapView.progressSteps').length"
                  :labels="$t('pages.swapView.progressSteps')"
                  :step="swapStatus"
                />
              </div>
              <div class="d-flex flex-grow-0">
                <div class="d-none d-sm-block" style="text-align: right">
                  <div class="font-3xl text-bold">{{swap.receivingAmount}}</div>
                  <div class="font-2xl color-orange">{{swap.receivingCoin.code}}</div>
                </div>
                <div style="padding-left: 1em; text-align: right">
                  <CoinAvatar size="5" :coin="swap.receivingCoin"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="min-height: 1em">&nbsp;</div>
        <div v-if="swap.status === 'new'">
          <div v-if="swap.depositCoin.network === 'ethereum'" class="box-shadow-2 bg-white pd10">
            <h4 :dir="pageDirection" class="nomg font-bolder">{{$t('pages.swapView.sendBox.sendTitle', {coin:
              swap.depositCoin.code, amount: swap.depositAmount})}}</h4>
            <div style="margin-bottom: 1em">{{$t('pages.swapView.sendBox.sendSubTitle')}}</div>
            <h4 class="nomg color-orange font-bolder">{{$t('pages.swapView.sendBox.addressTitle')}}</h4>
            <div @click="copyWalletAddress" class="alert alert-info" style="font-size: 1.5em;cursor: pointer">
              <i class="fa fa-copy"></i>
              <span style="">{{swap.depositWallet}}</span>
            </div>
            <button @click="depositEthereumCoins" class="btn btn-success">
              {{$t('pages.swapView.sendBox.metaMaskMessage')}}
            </button>
          </div>
          <div v-else class="box-shadow-2 bg-white pd10">
            <div class="row">
              <div class="col-sm-8">
                <h4 :dir="pageDirection" class="nomg font-bolder">{{$t('pages.swapView.sendBox.sendTitle', {coin:
                  swap.depositCoin.code, amount: swap.depositAmount})}}</h4>
                <div style="margin-bottom: 1em">{{$t('pages.swapView.sendBox.sendSubTitle')}}</div>
                <h4 class="nomg color-orange font-bolder">{{$t('pages.swapView.sendBox.addressTitle')}}</h4>
                <div @click="copyWalletAddress" class="alert alert-info" style="font-size: 1.5em;cursor: pointer">
                  <i class="fa fa-copy"></i>
                  <span style="">{{swap.depositWallet}}</span>
                </div>
                <div :dir="pageDirection" style="margin-top: 3em">{{$t('pages.swapView.sendBox.copyMessage')}}</div>
              </div>
              <div class="col-sm-4 text-center">
                <img :src="swap.depositWalletQr" style="width: 12rem" alt="">
              </div>
            </div>
          </div>
        </div>

        <!-- Send deposit confirmation box -->
        <div v-if="swap.status === 'deposit-sent'" class="box-shadow-2 bg-white pd10">
          <h4 :dir="pageDirection" class="nomg font-bolder">{{$t('pages.swapView.sendConfirmBox.message1')}}</h4>
          <div :dir="pageDirection" style="margin-bottom: 1em">{{$t('pages.swapView.sendConfirmBox.message2')}}</div>
        </div>

        <!-- Withdraw waiting for send -->
        <div v-if="swap.status === 'deposit-confirmed'" class="box-shadow-2 bg-white pd10">
          <h4 :dir="pageDirection" class="nomg font-bolder"
              v-html="$t('pages.swapView.withdrawWaitingBox.message1', {code: swap.receivingCoin.code})"></h4>
          <div :dir="pageDirection" style="margin-bottom: 1em">{{$t('pages.swapView.withdrawWaitingBox.message2')}}
          </div>
        </div>

        <!-- Withdraw waiting for confirm -->
        <div v-if="swap.status === 'withdraw-sent'" class="box-shadow-2 bg-white pd10">
          <h4 :dir="pageDirection" class="nomg font-bolder"
              v-html="$t('pages.swapView.withdrawConfirmingBox.message1', {code: swap.receivingCoin.code})"></h4>
          <div :dir="pageDirection" style="margin-bottom: 1em">{{$t('pages.swapView.withdrawConfirmingBox.message2')}}
          </div>
        </div>

        <!-- Done status info viewer box -->
        <div v-if="swap.status === 'withdraw-confirmed'" class="box-shadow-2 bg-white pd10">
          <h4 :dir="pageDirection" class="nomg font-bolder"
              v-html="$t('pages.swapView.doneStatusBox.message1', {code: swap.receivingCoin.code})"></h4>
          <div :dir="pageDirection" style="margin-bottom: 1em">{{$t('pages.swapView.doneStatusBox.message2')}}</div>
        </div>
        <div v-if="swap.status === 'done'" class="box-shadow-2 bg-white pd10">
          <h4 class="nomg font-bolder">Your <span class="color-orange">{{swap.receivingCoin.code}}</span> transfer done
            successfully.</h4>
        </div>
        <div class="box-shadow-2 bg-white pd10" style="margin-top: 1em">
          <div>
            {{$t('pages.swapView.transactionBox.swapId')}}: <span dir="ltr" class="font-bold">{{swap._id}}</span>
          </div>
          <div v-if="swap.depositTxHash">
            {{$t('pages.swapView.transactionBox.depositTransaction')}}:
            <a dir="ltr" target="_blank" :href="txHashUrl(swap.depositCoin.network, swap.depositTxHash)">
              <span class="font-bold">{{swap.depositTxHash}}</span>
            </a>
          </div>
          <div v-if="coinSended">
            {{$t('pages.swapView.transactionBox.withdrawTransaction')}}:
            <a dir="ltr" target="_blank" :href="txHashUrl(swap.receivingCoin.network, swap.receiveTxHash)">
              <span class="font-bold">{{swap.receiveTxHash}}</span>
            </a>
          </div>
          <div>
            {{$t('pages.swapView.transactionBox.recipientWallet')}} (<span class="font-bolder color-success">{{swap.receivingCoin.code}}</span>):
            <a dir="ltr" target="_blank" :href="walletAddressUrl(swap.receivingCoin.network, swap.recipientWallet)">
              <span class="font-bold">{{swap.recipientWallet}}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import StepProgress from '../../components/StepProgress';
  import CoinAvatar from '../../components/CoinAvatar';
  import blockchainUtils from '../../mixins/blockchainUtils';

  export default {
    mixins: [
      blockchainUtils
    ],
    components: {StepProgress, CoinAvatar},
    layout: 'coreui',
    data() {
      return {
        loading: true,
        swap: null
      }
    },
    computed: {
      ...mapGetters('global', ['swapList']),
      ...mapGetters('locales', ['pageDirection']),
      statusTitle() {
        switch (this.swap.status) {
          case 'new':
            return "Waiting fro deposit ...";
          case 'deposit':
            return "waiting for initialize ...";
          case 'withdraw-sent':
          case 'withdraw-confirmed':
            return "coin transferred";
          case 'done':
            return "Done";
          case 'cancel':
            return "cancel";
          case 'fail':
            return "failed";
        }
      },
      swapStatus() {
        let map = {
          new: 1,
          'deposit-sent': 2,
          'deposit-confirmed': 3,
          'withdraw-sent': 4,
          'withdraw-confirmed': 5,
          done: 5,
          cancel: 1,
          fail: 1,
        };

        if (map[this.swap.status])
          return map[this.swap.status];
        else
          return 0;
      },
      coinSended() {
        return ['withdraw-sent', 'withdraw-confirmed', 'done', 'fail'].indexOf(this.swap.status) >= 0;
      }
    },
    mounted() {
      this.loadSwapData();
    },
    methods: {
      loadSwapData() {
        this.loading = true;
        this.$axios.post('/api/v0.1/swap/info', {swap: this.$route.params.id})
          .then(({data}) => {
            if (data.success)
              this.swap = data.swap;
          })
          .catch(error => {
          })
          .then(() => {
            this.loading = false;
            if (this.swap && ['new', 'deposit-sent', 'deposit-confirmed', 'withdraw-sent', 'withdraw-confirmed'].indexOf(this.swap.status) >= 0)
              setTimeout(() => this.loadSwapData(), 30000);
          })
      },
      copyWalletAddress() {
        this.$copyText(this.swap.depositWallet)
          .then(e => {
            this.$toast.success('Address copied successfully.');
          })
          .catch(e => {
            this.$toast.error('Error on copying address.');
          })
      },
      depositEthereumCoins() {
        // alert(`send ${this.swap.receivingAmount} ${this.swap.receivingCoin.code} to address ${this.swap.recipientWallet}`);
        if (typeof web3 == 'undefined' || !web3.currentProvider.isMetaMask /*|| ( web3.currentProvider.isMetaMask && typeof web3.eth.accounts[0] == 'undefined' ) */) {
          alert("MetaMask is not enabled.");
          return;
        }
        let minABI = [
          // transfer
          {
            "constant": false,
            "inputs": [
              {
                "name": "_to",
                "type": "address"
              },
              {
                "name": "_value",
                "type": "uint256"
              }
            ],
            "name": "transfer",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "type": "function"
          }
        ];

        function signMsg(msgParams, from) {
          return new Promise(function (resolve, reject) {
            web3.currentProvider.sendAsync({
              method: 'eth_signTypedData',
              params: [msgParams, from],
              from: from,
            }, function (err, result) {
              if (err)
                reject(err);
              if (result.error) {
                return reject(result.error)
              }
              resolve(result.result);
              // const recovered = sigUtil.recoverTypedSignature({
              //   data: msgParams,
              //   sig: result.result
              // })
              // if (recovered === from ) {
              //   alert('Recovered signer: ' + from)
              // } else {
              //   alert('Failed to verify signer, got: ' + result)
              // }
            })
          })
        }

        /**
         * request MetaMask permission to access the accounts
         */
        if (web3.eth.accounts.length == 0) {
          ethereum.enable();
          return;
        }
        web3.eth.defaultAccount = web3.eth.accounts[0];

        // creating deposit signature
        let signMessageParams = [
          {
            type: 'string',      // Any valid solidity type
            name: 'from',     // Any string label you want
            value: web3.eth.accounts[0]  // The value to sign
          },
          {
            type: 'string',      // Any valid solidity type
            name: 'swap',     // Any string label you want
            value: this.swap._id  // The value to sign
          }
        ];
        let from = web3.eth.accounts[0];
        signMsg(signMessageParams, from)
          .then(depositSignature => {
            console.log('deposit signature: ', depositSignature);

            // Get ERC20 Token contract instance
            let contract = web3.eth.contract(minABI).at(this.swap.depositCoin.info.contractAddress);

            // calculate ERC20 token amount
            let amount = web3.toBigNumber(this.swap.depositAmount);
            let value = amount.times(web3.toBigNumber(10).pow(this.swap.depositCoin.info.decimals));
            console.log('value: ', value.toNumber());

            contract.transfer(this.swap.depositWallet, value, (error, txHash) => {
              if (error) {
                alert('Internal Error!');
                return;
              } else {
                this.$axios.post('/api/v0.1/swap/set-ethereum-deposit', {
                  swap: this.swap._id,
                  address: web3.eth.accounts[0],
                  sig: depositSignature,
                  txHash
                })
                  .then(({data}) => {
                    if (data.success) {
                      this.$toast.success('Coins send successfully');
                      this.swap = data.swap;
                    } else {
                      this.$toast.error(data.message || "Somethings went wrong.")
                    }
                  })
                  .catch(error => {
                    this.$toast.error(error.response.message || "Somethings went wrong.")
                  })
              }
              // it returns tx hash because sending tx
              console.log('txHash: ', txHash);
            });
          })
          .catch(error => {
            alert("Deposit Error.\n\n" + error.message);
          });
      }
    }
  }
</script>

<style scoped>
  .swap-view {
    align-items: center;
    margin-top: 2rem;
    justify-content: center;
    border: 1px solid #ddd;
    height: 6rem;
    border-radius: 3rem;
    padding: 0.5rem;
  }

  .coin-avatar {
    width: 1.3rem;
    height: 1.3rem;
    margin-bottom: 0.2em;
  }
</style>

<style>
  .cc-token-avatar {
    width: 20px;
    height: 20px
  }

  .table-coin-count {
    width: 100%
  }

  .table-coin-count td {
    padding: 0.5em 1em;
  }

  .table-coin-count td:nth-child(1) {
    padding-right: 3em;
  }

  .table-coin-count td:nth-child(2) {
    font-weight: bold;
  }

  .table-coin-count tr:nth-child(odd) {
    background: #eee;
  }

  .table-wallet-info {
    width: 100%;
    margin-bottom: 1.2em
  }

  .table-wallet-info td {
    padding: 0.5em 1em;
  }

  .table-wallet-info td:nth-child(1) {
    font-weight: bold;
    padding-right: 3em
  }

  .copy-button {
    display: inline-block;
    width: inherit;
    padding: 0.2em 0.5em;
    cursor: pointer;
  }

  .transaction-coin-icon {
    height: 1.5em;
  }
</style>
