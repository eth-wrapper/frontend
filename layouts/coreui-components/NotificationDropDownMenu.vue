<template>
  <div class="dropdown-menu dropdown-menu-right">
    <div class="message-container">
      <div class="message-item" v-for="(item, nID) in notifications" :key="nID">
        <BaseLink v-if="hasLinkToNextPage(item)" :to="linkToNextPage(item)">
          <span>{{item.message}}</span>
        </BaseLink>
        <span v-else>{{item.message}}</span>
      </div>
    </div>
    <div class="dropdown-divider"></div>
    <!--<a class="dropdown-item" href="#">-->
    <!--<i class="fa fa-shield"></i> Lock Account</a>-->
    <a class="dropdown-item" href="#" @click="clearAll">
      <i class="fa fa-lock"></i> Clear All</a>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import BaseLink from "../../components/global/BaseLink";

  export default {
    components: {BaseLink},
    computed: {
      ...mapState('notifications', ['notifications'])
    },
    methods: {
      ...mapActions('notifications', ['clearNotifications']),
      clearAll() {
        this.clearNotifications();
      },
      hasLinkToNextPage(notification) {
        return (notification
          && notification.commands
          && notification.commands.length > 0
          && (
            notification.commands[0].type === 'trade-open'
            || notification.commands[0].type === 'trades-list'
            || notification.commands[0].type === 'disputes-list'
          ));
      },
      linkToNextPage(notification) {
        if (notification.commands[0].type === 'trade-open')
          return {name: "trade-id", params: {id: notification.commands[0].params.id}}
        if (notification.commands[0].type === 'trades-list')
          return {name: "trades"}
        if (notification.commands[0].type === 'disputes-list')
          return {name: "operator-disputes"}
        else
          return null;
      }
    }
  }
</script>

<style scoped>
  .message-container {
    padding: 0.5em
  }

  .message-item {
    font-size: 0.8em;
    color: #666;
  }

  .message-item:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
</style>
