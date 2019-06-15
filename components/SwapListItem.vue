<style>
  .loading-placeholder{
    height: 1em;
    margin: 4px 0;
  }
  @keyframes placeHolderShimmer{
    0%{
      background-position: -468px 0
    }
    100%{
      background-position: 468px 0
    }
  }
  .animated-background {
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    position: relative;
  }
</style>

<template>
  <tr v-if="swap">
    <!--<td>{{swap.txTime}}</td>-->
    <td>
      <BaseLink :to="{name: 'swap-id', params: {id: swap._id}}">
        <span>{{swap._id}}</span>
      </BaseLink>
    </td>
    <td>
      <span class="badge badge-pill" :class="getStatusClass(swap.status)">{{swap.status}}</span>
    </td>
    <td>
      <coin-avatar :coin="swap.depositCoin" />
      <span>{{swap.depositCoin.code}}</span>
    </td>
    <td>
      <span>{{swap.depositAmount}}</span>
    </td>
    <td>
      <a v-if="swap.depositTxHash" :href="txHashUrl(swap.depositCoin.network, swap.depositTxHash)" target="_blank">
        <span>{{swap.depositTxHash.substr(0, 12)}} ...</span>
      </a>
    </td>
    <td>
      <coin-avatar :coin="swap.receivingCoin" />
      <span>{{swap.receivingCoin.code}}</span>
    </td>
    <td>
      <span>{{swap.receivingAmount}}</span>
    </td>
    <td>
      <span>{{swap.recipientWallet.substr(0, 12)}} ...</span>
    </td>
    <td>
      <a
        v-if="swap.status==='deposit-confirmed'"
        @click="() => onWithdraw(swap)"
        class="badge badge-pill badge-primary"
        href="#"
      >withdraw</a>
    </td>
  </tr>
  <tr v-else>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
    <td>
      <div class="loading-placeholder animated-background">&nbsp;</div>
    </td>
  </tr>
</template>

<script>
  import blockchainUtils from '../mixins/blockchainUtils';
  import CoinAvatar from './CoinAvatar';
  export default {
    props: ['swap'],
    mixins: [blockchainUtils],
    components: {CoinAvatar},
    methods: {
      onWithdraw(swap){
        this.$emit('withdraw', swap);
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
    }
  }
</script>
