<template>
  <div class="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show" :class="{'farsi-font': locale === 'fa'}">
    <Header />
    <div class="app-body">
      <LeftSideBar />
      <main class="main pd10 bg-white">
        <!--<TopStatusBar />-->
        <!--<div class="container-fluid">-->
          <div class="animated fadeIn">
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

  import Header from './coreui-components/Header';
  import Footer from './coreui-components/Footer';
  import LeftSideBar from './coreui-components/LeftSideBar';
  import RightSideBar from './coreui-components/RightSideBar';
  import TopStatusBar from './coreui-components/TopStatusBar';

  import {mapActions, mapGetters} from 'vuex';

  export default {
    head: {
      bodyAttrs: {
        class: "app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show"
      }
    },
    components: {Header, Footer, LeftSideBar, RightSideBar, TopStatusBar},
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
      ... mapGetters('auth',['hasPermission']),
      ... mapGetters('locales',['locale'])
    }
  }
</script>


<style lang="scss">
  @import '../design/global-styles.scss';
  @import '../design/ui-components.scss';
</style>
