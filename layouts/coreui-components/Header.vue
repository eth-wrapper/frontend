<template>
  <header class="app-header navbar">
    <LoginModal ref="loginModal"/>
    <button class="navbar-toggler sidebar-toggler d-lg-none mr-auto" type="button" data-toggle="sidebar-show">
      <span class="navbar-toggler-icon"></span>
    </button>
    <BaseLink class="navbar-brand" style="height: auto" :to="{path: '/'}">
      <!--<img class="navbar-brand-full" src="/coreui/img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo">-->
      <!--<img class="navbar-brand-minimized" src="/coreui/img/brand/sygnet.svg" width="30" height="30" alt="CoreUI Logo">-->
      <img class="navbar-brand-full" src="/imgs/swap-logo.png" width="100" height="25" alt="CoreUI Logo">
      <img class="navbar-brand-minimized" src="/imgs/swap-logo-no-text.png" width="30" height="30" alt="CoreUI Logo">
    </BaseLink>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" data-toggle="sidebar-lg-show">
      <span class="navbar-toggler-icon"></span>
    </button>
    <ul class="nav navbar-nav d-md-down-none">
      <!--<li class="nav-item px-3">-->
        <!--<a class="nav-link" target="_blank" href="https://docs.google.com/document/d/1lO7LQ1W7gL_srVp-rpUQdAMAvWew3ZSPvCTuuRP00U0/edit#heading=h.6j9iv1dzd39h">{{$t('topHeader.help')}}</a>-->
      <!--</li>-->
    </ul>
    <ul class="nav navbar-nav ml-auto">
      <li v-if="!loggedIn" class="nav-item px-3">
        <a class="nav-link" href="#"  @click="openLoginModal($event)">
          {{$t('topHeader.login')}}
        </a>
      </li>
      <li v-if="loggedIn" class="nav-item d-md-down-none px-3">
        <BaseLink class="nav-link" :to="{name: 'swap-list'}">{{$t('topHeader.swapList')}}</BaseLink>
      </li>
      <li v-if="notificationCount > 0" class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="icon-bell"></i>
          <span class="badge badge-pill badge-danger">{{notificationCount}}</span>
        </a>
        <NotificationDropDownMenu />
      </li>
      <li v-if="loggedIn" class="nav-item d-md-down-none px-3">
        <BaseLink class="nav-link" :to="{path: '/profile'}">
          {{fullName}}
        </BaseLink>
      </li>
      <li v-if="loggedIn" class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
          <div style="width: 3em; height: 3em">
            <div class="avatar-bg" :style="{background: 'url(' + user.avatar + ')'}">&nbsp;</div>
          </div>
          <!--<img class="img-avatar" :src="user.avatar" alt="admin@bootstrapmaster.com">-->
        </a>
        <ProfileDropDownMenu />
      </li>
      <LanguageSwitch />
    </ul>
  </header>
</template>

<script>
  import {mapState} from 'vuex';
  import ProfileDropDownMenu from './ProfileDropDownMenu';
  import LanguageSwitch from '../../components/LanguageSwitch';
  import NotificationDropDownMenu from './NotificationDropDownMenu';
  import LoginModal from '../../components/loginModal.vue';
  import BaseLink from "../../components/global/BaseLink";
  export default {
    head () {
      return {
        titleTemplate: this.notificationCount > 0 ? `(${this.notificationCount}) %s` : `%s`
      }
    },
    components: {BaseLink, LoginModal, ProfileDropDownMenu, NotificationDropDownMenu, LanguageSwitch},
    data(){
      return{
      };
    },
    computed: {
        ...mapState('auth',['loggedIn','user']),
        ...mapState('notifications',['notifications']),
      notificationCount: function(){
        return Object.keys(this.notifications).length;
      },
      fullName: function(){
          return (this.user.firstName + ' ' + this.user.lastName).trim();
      }
    },
    methods: {
      openLoginModal(event) {
        this.$refs.loginModal.show(event);
      },
      logout(){
        this.$refs.loginModal.logout();
      }
    }
  }
</script>
