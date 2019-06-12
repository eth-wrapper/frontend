<template>
  <div class="app header-fixed bg-poster" :class="{'farsi-font': locale === 'fa'}">
    <HeaderNoSideMenu />
    <div class="app-body">
      <!--<LeftSideBar />-->
      <main class="main pd10 ">
        <!--<TopStatusBar />-->
        <!--<div class="container-fluid">-->
          <div class="animated fadeIn container">
            <nuxt/>
          </div>
        <!--</div>-->
      </main>
      <!--<RightSideBar />-->
    </div>
    <Footer />
  </div>
</template>

<script>
  import HeaderNoSideMenu from './coreui-components/HeaderNoSideMenu';
  import Footer from './coreui-components/Footer';
  import LeftSideBar from './coreui-components/LeftSideBar';
  import RightSideBar from './coreui-components/RightSideBar';
  import TopStatusBar from './coreui-components/TopStatusBar';

  import {mapActions, mapGetters} from 'vuex';

  export default {
    head: {
      bodyAttrs: {
        class: "app header-fixed"
      }
    },
    components: {HeaderNoSideMenu, Footer, LeftSideBar, RightSideBar, TopStatusBar},
    async mounted(){
      await this.loadCoinList();
      let urm = await this.loadUnreadMessages();
      if(this.hasPermission('operator')){
        let ourm = await this.loadOperatorUnreadMessages();
      }
    },
    methods: {
      ... mapActions('global',['loadCoinList']),
      ... mapActions('notifications',['loadUnreadMessages','loadOperatorUnreadMessages']),
    },
    computed:{
      ...mapGetters('auth',['hasPermission']),
      ...mapGetters('locales',['locale'])
    }
  }
</script>


<style lang="scss">
  @import '../design/global-styles.scss';
  @import '../design/ui-components.scss';
  .bg-poster{
    background: url("/imgs/bg.png");
    background-size: cover;
    background-position-x: center;
  }
</style>
