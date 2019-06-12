<style scoped>
  .sb-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 2em;
    padding: 1em;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.3)
  }

  .sb-container .space {
    width: 0.5em;
    height: 0;
  }

  .swap-icon {
    margin-bottom: 0.5em;
    transform: rotate(90deg);
  }

  @media screen and (max-width: 991px) {
    .sb-container {
      flex-direction: column;
      align-items: initial;
    }

    .sb-container .space {
      width: 0;
      height: 0.5em;
    }

    .swap-icon {
      transform: rotate(0);
      margin-bottom: -2rem;
      text-align: right !important;
    }
  }

  @media screen and (max-width: 400px) {
    .sb-container {
      font-size: 1em;
    }
  }
</style>

<template>
  <div class="sb-container">
    <!--<div class="row">-->
    <!--<div class="col-sm-5"></div>-->
    <!--<div class="col-sm-1"></div>-->
    <!--<div class="col-sm-5"></div>-->
    <!--<div class="col-sm-1"></div>-->
    <!--</div>-->
    <div>
      <h5 :dir="pageDirection" class="color-white">{{$t('components.coinSwapBox.sendTitle',{coin: source})}}</h5>
      <CoinSelect
        :coins="coins"
        :current="source"
        :amount="sourceAmount"
        @change="onSourceChange"
      />
    </div>
    <div class="space"></div>
    <i class="icon-refresh icons font-2xl color-white text-center swap-icon"></i>
    <div class="space"></div>
    <div>
      <h5 :dir="pageDirection" class="color-white">{{$t('components.coinSwapBox.receiveTitle',{coin: destination})}}</h5>
      <CoinSelect
        :coins="destCoinList"
        :current="destination"
        :amount="convertedAmount | round(6)"
        @change="onDestinationChange"
        :amount-disabled="true"
        :options-disabled="true"
        :in-progress="conversionRateInProgress"
      />
    </div>
    <div class="space"></div>
    <button
      @click="goToSwap"
      class="btn btn-ghost-success active"
      style="height: 3rem;"
      type="button"
      aria-pressed="true"
    >{{$t('components.coinSwapBox.btnSwap')}}
    </button>
  </div>
</template>

<script>
  import CoinSelect from "./CoinSelect";
  import {mapGetters} from 'vuex';

  export default {
    components: {CoinSelect},
    data() {
      return {
        source: process.env.EXCHANGE_DEFAULT_SOURCE,
        sourceAmount: 0.1,
        destination: process.env.EXCHANGE_DEFAULT_TARGET,
        destAmount: 0.1,
        conversionRateInProgress: false,
        conversionRate: 1
      }
    },
    computed: {
      ...mapGetters('global', ['coins']),
      ...mapGetters('locales', ['pageDirection']),
      sourceCoin(){
        // if(this.coins.length === 0)
        //   return {code: this.source, title: this.source};
        return this.coins.find(item => item.code===this.source);
      },
      destinationCoin(){
        // if(this.coins.length === 0)
        //   return {code: this.destination, title: this.destination};
        return this.coins.find(item => item.code===this.destination);
      },
      destCoinList() {
        // if(this.coins.length === 0)
        //   return [];
        return this.coins.filter(item => item.code !== this.source)
      },
      convertedAmount() {
        if (this.conversionRateInProgress)
          return 0;
        return this.sourceAmount * this.conversionRate;
      }
    },
    mounted() {
      this.getConversionRate();
    },
    methods: {
      onSourceChange(v) {
        this.source = v.coin.code;
        this.sourceAmount = v.amount;
        let replacement = v.coin.exchange;
        this.destination = replacement;
        this.getConversionRate();
      },
      onDestinationChange(v) {
        // this.destination = v.coin.code;
        // if (this.destination === this.source) {
        //   let replacement = this.defaultConvertCoin[this.destination];
        //   this.source = replacement;
        // }
        // this.getConversionRate();
      },
      getConversionRate() {
        return;
        this.conversionRateInProgress = true;
        this.$axios.post('/api/v0.1/swap/conversion-rate', {deposit: this.source, receiving: this.destination})
          .then(({data}) => {
            if (data.success)
              this.conversionRate = data.rate;
          })
          .catch(error => {
          })
          .then(() => {
            this.conversionRateInProgress = false;
          })
      },
      goToSwap() {
        this.$router.push({
          name: 'swap-src-dst-amount', params: {
            src: this.source,
            dst: this.destination,
            amount: this.sourceAmount
          }
        })
      }
    }
  }
</script>
