<style scoped>
  .coin-avatar {
    width: 1.3rem;
    height: 1.3rem;
    margin-bottom: 0.2em;
  }
</style>

<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="box-trans color-white">
          <div v-if="sourceCoin === undefined || destinationCoin === undefined" class="text-center">
            <i class="fa fa-spinner font-4xl fa-lg fa-spin"></i>
          </div>
          <div v-else>
            <div class="row">
              <div class="form-group col-sm-6">
                <h5>{{$t('pages.newSwap.depositCoinTitle')}}</h5>
                <div class="form-control">
                  <img :src="`/coin-icons/${sourceCoin.network}/${sourceCoin.code}.png`" class="coin-avatar">
                  {{sourceCoin.title}} ({{sourceCoin.code}})
                </div>
              </div>
              <div class="form-group col-sm-6">
                <h5>{{$t('pages.newSwap.receivingCoinTitle')}}</h5>
                <div class="form-control">
                  <img :src="`/coin-icons/${destinationCoin.network}/${destinationCoin.code}.png`" class="coin-avatar">
                  {{destinationCoin.title}} ({{destinationCoin.code}})
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-6">
                <h5>{{$t('pages.newSwap.depositAmountTitle',{coin: sourceCoin.code})}}</h5>
                <div class="form-control">
                  {{amount}}
                </div>
              </div>
              <div class="form-group col-sm-6">
                <h5>{{$t('pages.newSwap.receivingAmountTitle',{coin: destinationCoin.code})}}</h5>
                <div class="form-control bg-info border-info color-white text-bold"
                     style="display: flex; position: relative">
                  {{convertedAmount | round(6)}}
                  <div v-if="conversionRateInProgress" style="position: absolute; right: 1em">
                    <i class="fa fa-spinner fa-lg fa-spin"></i>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 2em">&nbsp;</div>
            <h2>{{$t('pages.newSwap.walletInfoTitle')}}</h2>
            <!--<h6>Enter yours {{destinationCoin.network}} wallet address to receive {{destinationCoin.code}}</h6>-->
            <h6 :dir="pageDirection">{{$t('pages.newSwap.walletDescription',destinationCoin)}}</h6>
            <div class="row">
              <div class="form-group col-lg-6">
                <input v-model="walletAddress" :placeholder="$t('pages.newSwap.walletPlaceholder')" type="text" class="form-control">
              </div>
              <div class="form-group col-lg-6">
                <button @click="registerNewSwap" class="btn btn-success" type="button">{{$t('pages.newSwap.btnTitle')}}</button>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="text-right">-->
        <!--<BaseLink :to="{name: 'quickBuy'}">-->
        <!--<i class="fa fa-plus-circle fa-lg mt-2 mb-4"></i>-->
        <!--<span>See more options ...</span>-->
        <!--</BaseLink>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import CoinSelect from '../../../../components/CoinSelect';
  import CoinSwapBox from '../../../../components/CoinSwapBox';

  export default {
    layout: 'coreui-no-sidemenu',
    validate ({ params }) {
      // Source and destination must have 3 length
      return params.src
        && (params.src.length === 3 || params.src.length === 4)
        && params.dst
        && (params.dst.length === 3 || params.dst.length === 4);
    },
    components: {CoinSelect, CoinSwapBox},
    data() {
      return {
        conversionRateInProgress: false,
        registerInProgress: false,
        conversionRate: 1,
        amount: this.$route.params.amount || 1,
        walletAddress: ""
      }
    },
    computed: {
      ...mapGetters('global', ['coins']),
      ...mapGetters('locales', ['pageDirection']),
      convertedAmount() {
        if (this.conversionRateInProgress)
          return 0;
        return this.amount * this.conversionRate;
      },
      sourceCoin() {
        return this.coins.find(item => item.code === this.$route.params.src);
      },
      destinationCoin() {
        return this.coins.find(item => item.code === this.$route.params.dst);
      },
    }
    ,
    methods: {
      registerNewSwap(){
        let params = {
          deposit: this.sourceCoin.code,
          receiving: this.destinationCoin.code,
          amount: this.amount,
          recipientWallet: this.walletAddress
        }
        this.registerInProgress = true;
        this.$axios.post('/api/v0.1/swap/new',params)
          .then(({data}) => {
            if(data.success){
              this.$router.push({name: 'swap-id', params: {id: data.swapId}})
            }else{
              // TODO: show proper message
              alert(JSON.stringify(data, null, 2));
            }
          })
          .catch(error => {})
          .then(() => {
            this.registerInProgress = false;
          })
      }
    }
  }

</script>
