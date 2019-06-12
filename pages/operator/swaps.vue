<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header"><strong>Swap List</strong></div>
          <div class="card-body">
            <table class="table table-responsive-sm table-sm">
              <thead>
              <tr>
                <!--<th>Date</th>-->
                <th>ID</th>
                <th>stats</th>
                <th>Deposit</th>
                <th>Amount</th>
                <th>TX</th>
                <th>Receiving</th>
                <th>Amount</th>
                <th>Wallet</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(row, index) in swapList">
                <!--<td>{{row.txTime}}</td>-->
                <td>
                  <BaseLink :to="{name: 'swap-id', params: {id: row._id}}">
                    <span>{{row._id}}</span>
                  </BaseLink>
                </td>
                <td>
                  <span class="badge badge-pill" :class="getStatusClass(row.status)">{{row.status}}</span>
                </td>
                <td>
                  <img :src="`/coin-icons/${row.depositCoin.network}/${row.depositCoin.code}.png`" class="coin-avatar">
                  <span>{{row.depositCoin.code}}</span>
                </td>
                <td>
                  <span>{{row.depositAmount}}</span>
                </td>
                <td>
                  <a v-if="row.depositTxHash" :href="txHashUrl(row.depositCoin.network, row.depositTxHash)" target="_blank">
                    <span>{{row.depositTxHash.substr(0, 12)}} ...</span>
                  </a>
                </td>
                <td>
                  <img :src="`/coin-icons/${row.receivingCoin.network}/${row.receivingCoin.code}.png`" class="coin-avatar">
                  <span>{{row.receivingCoin.code}}</span>
                </td>
                <td>
                  <span>{{row.receivingAmount}}</span>
                </td>
                <td>
                  <span>{{row.recipientWallet.substr(0, 12)}} ...</span>
                </td>
                <th>
                  <a
                    v-if="row.status==='deposit-confirmed'"
                    @click="sendCoin(row, index)"
                    class="badge badge-pill badge-success"
                    href="#"
                  >withdraw</a>
                </th>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import Vue from 'vue';
  import blockchainUtils from '../../mixins/blockchainUtils';

  export default {
    mixins: [blockchainUtils],
    components: {},
    layout: 'coreui',
    data() {
      return {
        loading: true,
        swapList: []
      }
    },
    mounted(){
      this.loadSwapList();
    },
    methods: {
      loadSwapList(){
        this.loading = true;
        this.$axios.post('/api/v0.1/operator/swap-list')
          .then(({data}) => {
            if(data.success){
              this.swapList = data.swapList;
            }
          })
          .catch(error => {})
          .then(() => {
            this.loading = false;
          })
      },
      getStatusClass(status){
        switch (status) {
          case 'new': return {'badge-secondary': true};
          case 'deposit-sent': return {'badge-warning': true};
          case 'deposit-confirmed': return {'badge-primary': true};
          case 'withdraw-sent': return {'badge-warning': true}
          case 'withdraw-confirmed': return {'badge-success': true}
          case 'done': return {'badge-success': true};
          case 'cancel':
          case 'fail': return {'badge-danger': true};
        }
      },
      sendCoin(swap, index){
        if(swap.receivingCoin.network === 'ethereum')
          this.sendCoinByMetaMask(swap);
        else
          this.sendCoinsManually(swap, index)
      },
      sendCoinByMetaMask(swap){
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

        ethereum.enable()
          .then(() => {
            web3.eth.defaultAccount = web3.eth.accounts[0];
          })
          .then(() => {
            console.log(swap.receivingCoin);
            // Get ERC20 Token contract instance
            let contract = web3.eth.contract(minABI).at(swap.receivingCoin.info.contractAddress);

            // calculate ERC20 token amount
            let amount = web3.toBigNumber(swap.receivingAmount);
            let value = amount.times(web3.toBigNumber(10).pow(swap.receivingCoin.info.decimals));
            console.log('value: ', value.toNumber());
            contract.transfer(swap.recipientWallet, value, (error, txHash) => {
              if (error) {
                alert("Internal Error!\n\n" + error.message);
                return;
              } else {
                this.registerSwapWithdraw(swap, txHash);
              }
              // it returns tx hash because sending tx
              console.log('txHash: ', txHash);
            });
          })
          .catch(error => {
            this.$toast.error(error.message || "Somethings went wrong.");
          })
      },
      sendCoinsManually(swap, index){
        let txHash = prompt('Enter withdraw transaction hash :');
        if(txHash) {
          this.registerSwapWithdraw(swap, txHash);
        }
      },
      registerSwapWithdraw(swap, txHash){
        return this.$axios.post('/api/v0.1/operator/set-withdraw', {swap: swap._id, txHash})
          .then(({data}) => {
            if (data.success) {
              this.$toast.success('Withdraw registered successfully');
              Vue.set(swap, 'status', 'withdraw-sent');
              Vue.set(swap, 'txHash', txHash);
            } else {
              this.$toast.error(data.message || "Somethings went wrong.")
            }
          })
          .catch(error => {
            this.$toast.error(error.response.message || "Somethings went wrong.")
          })
      }
    }
  }
</script>

<style scoped>
  .coin-avatar{
    width: 1.1rem;
    height: 1.1rem;
    margin-bottom: 0.2em;
  }
</style>

<style>
  .cc-token-avatar{width: 20px; height: 20px}
  .table-coin-count{width: 100%}
  .table-coin-count td{
    padding: 0.5em 1em;
  }
  .table-coin-count td:nth-child(1){
    padding-right: 3em;
  }
  .table-coin-count td:nth-child(2){
    font-weight: bold;
  }
  .table-coin-count tr:nth-child(odd){
    background: #eee;
  }
  .table-wallet-info{width: 100%; margin-bottom: 1.2em}
  .table-wallet-info td{
    padding: 0.5em 1em;
  }
  .table-wallet-info td:nth-child(1){
    font-weight: bold;
    padding-right: 3em
  }
  .copy-button{
    display: inline-block;
    width: inherit;
    padding: 0.2em 0.5em;
    cursor: pointer;
  }
  .transaction-coin-icon{
    height: 1.5em;
  }
</style>
