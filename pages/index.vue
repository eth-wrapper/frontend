<style scoped>
</style>

<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div style="padding-top: 5em">
          <h1 class="text-center text-bold color-white">{{$t('pages.home.topTitle')}}</h1>
          <h5 class="text-center color-white">{{$t('pages.home.subTitle')}}</h5>
          <CoinSwapBox />
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
  import CoinSelect from '../components/CoinSelect';
  import CoinSwapBox from '../components/CoinSwapBox';

  export default {
    layout: 'coreui-no-sidemenu',
    components: {CoinSelect, CoinSwapBox},
    data() {
      return {
        searchInProgress: true,
      }
    },
    computed:{
    },
    async mounted(){
    },
    methods: {
    }
  }

</script>
