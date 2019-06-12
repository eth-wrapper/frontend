<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header"><strong>{{$t('pages.userSwapList.listBox.title')}}</strong></div>
          <div class="card-body">
            <table class="table table-responsive-sm table-sm">
              <thead>
              <tr>
                <!--<th>Date</th>-->
                <th>{{$t('pages.userSwapList.listBox.head.id')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.status')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.depositCoin')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.depositAmount')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.depositWallet')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.receivingCoin')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.receivingAmount')}}</th>
                <th>{{$t('pages.userSwapList.listBox.head.receivingWallet')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in swapList">
                <!--<td>{{row.txTime}}</td>-->
                <td>
                  <BaseLink :to="{name: 'swap-id', params: {id: row._id}}">
                    <span>{{row._id}}</span>
                  </BaseLink>
                </td>
                <td>
                  <span>{{$t(`pages.userSwapList.listBox.status.${row.status}`)}}</span>
                </td>
                <td>
                  <img :src="`/coin-icons/${row.depositCoin.network}/${row.depositCoin.code}.png`" class="coin-avatar">
                  <span>{{row.depositCoin.title}} ({{row.depositCoin.code}})</span>
                </td>
                <td>
                  <span>{{row.depositAmount}}</span>
                </td>
                <td>
                  <span>{{row.depositWallet.substr(0, 12)}} ...</span>
                </td>
                <td>
                  <img :src="`/coin-icons/${row.receivingCoin.network}/${row.receivingCoin.code}.png`" class="coin-avatar">
                  <span>{{row.receivingCoin.title}} ({{row.receivingCoin.code}})</span>
                </td>
                <td>
                  <span>{{row.receivingAmount}}</span>
                </td>
                <td>
                  <span>{{row.recipientWallet.substr(0, 12)}} ...</span>
                </td>
                <!--<td><a v-if="!row.trade && row.thHash" target="_blank" :href="etherscanTx(row.txHash)">{{row.txHash.substr(0,12) + ' ...'}}</a></td>-->
                <!--<td><a target="_blank" :href="etherscanWallet(row.from)">{{row.from.substr(0,12) + ' ...'}}</a></td>-->
                <!--<td><a target="_blank" :href="etherscanWallet(row.to)">{{row.to.substr(0,12) + ' ...'}}</a></td>-->
                <!--<td>-->
                  <!--<span-->
                    <!--class="badge"-->
                    <!--:class="transactionTypeClass(row)"-->
                  <!--&gt;{{$t('pages.wallet.mainBox.txType.' + txTitle(row))}}</span>-->
                <!--</td>-->
                <!--<td>-->
                  <!--<span>{{$t('pages.wallet.mainBox.status.' + row.status)}}</span>-->
                <!--</td>-->
                <!--<td>-->
                  <!--<img class="transaction-coin-icon" :src="'/erc20-tokens/' + row.token + '.png'" alt="">-->
                  <!--<span>&nbsp;{{getTokenByCode(row.token).title}}</span></td>-->
                <!--<td>{{row.count}}</td>-->
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
  export default {
    components: {},
    layout: 'coreui',
    data() {
      return {
      }
    },
    computed: {
        ...mapGetters('global', ['swapList']),
    },
    mounted(){
      this.loadUserSwapList();
    },
    methods: {
      ...mapActions('global',['loadUserSwapList']),
      copyWalletAddress(){
        this.$copyText(this.$auth.user.address)
          .then(e => {
            this.$toast.success('Address copied successfully.');
          })
          .catch(e => {
            this.$toast.error('Error on copying address.');
          })
      },
      etherscanWallet(address){
        return this.etherscanBaseUrl + 'address/' + address;
      },
      etherscanTx(tx_hash){
        return this.etherscanBaseUrl + 'tx/' + tx_hash;
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
