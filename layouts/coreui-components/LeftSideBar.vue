<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <li class="nav-item">
          <BaseLink class="nav-link" :to="{path: '/'}">
            <i class="nav-icon icon-speedometer"></i> {{$t('leftSideBar.home')}}
            <span class="badge badge-primary">{{$t('leftSideBar.new')}}</span>
          </BaseLink>
        </li>
        <li class="nav-title">{{$t('leftSideBar.userMenus')}}</li>
        <li class="nav-item">
          <BaseLink class="nav-link" :to="{name: 'profile-id'}">
            <i class="nav-icon icon-user"></i>
            <span> {{$t('leftSideBar.profile')}}</span>
          </BaseLink>
        </li>
        <li class="nav-item">
          <BaseLink class="nav-link" :to="{name: 'swap-list'}">
            <i class="nav-icon icon-wallet"></i>
            <span> {{$t('leftSideBar.userSwaps')}}</span>
          </BaseLink>
        </li>
        <li v-if="hasPermission('admin')" class="nav-item nav-dropdown open">
          <a class="nav-link nav-dropdown-toggle" href="#">
            <i class="nav-icon"></i>
            <span>{{$t('leftSideBar.adminMenuTitle')}}</span>
          </a>
          <ul class="nav-dropdown-items">
            <li class="nav-item">
              <BaseLink class="nav-link" :to="{name: 'operator-swaps'}">
                <i class="nav-icon icon-star"></i> {{$t('leftSideBar.manageSwaps')}}
                <!--<span class="badge badge-success">NEW</span>-->
              </BaseLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <button class="sidebar-minimizer brand-minimizer" type="button"></button>
  </div>
</template>
<script>
  import BaseLink from "../../components/global/BaseLink";
  import {mapState, mapGetters} from 'vuex';
  export default {
    components: {BaseLink},
    computed:{
      ...mapState('notifications', ['unreadMessages','operatorUnreadMessages']),
      ...mapGetters('auth', ['hasPermission']),
      tradeBadgeCount: function () {
        if(!this.unreadMessages)
          return 0;
        return Object.keys(this.unreadMessages)
          .map(tradeId => this.unreadMessages[tradeId])
          .filter(item => item.length > 0)
          .length;
      },
      operatorDisputeBadgeCount: function () {
        if(!this.operatorUnreadMessages)
          return 0;
        return Object.keys(this.operatorUnreadMessages)
          .map(tradeId => this.operatorUnreadMessages[tradeId])
          .filter(item => item.length > 0)
          .length;
      }
    }
  }
</script>
