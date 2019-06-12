<style lang="scss" scoped>
  .coin-avatar{
    width: 1.3rem;
    height: 1.3rem;
    margin-bottom: 0.2em;
  }
  .outer-container{
    background: white;
    border-radius: 4px;
    padding: 0 0.5em;
    position: relative;
  }
  .fx-container{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .fx-container input,button{
    height: 3rem;
  }
  .fx-container input{
    width: 60%;
    border: 0;
    outline: none;
    background: white;
  }
  .fx-container button{
    width: 40%;
    border: 0;
    outline: none;
    border-left: 2px solid #ddd;
    background: none;
  }

  .options-container{
    width: 100%;
    z-index: 999;
    height: auto;
    border-radius: 4px;
    background: white;
    position: absolute;
    top: 0;
    left: 0;
  }
  .options-container .head{
    display: flex;
    align-items: center;
    height: 3rem;
  }
  .options-closer{
    /*background: rgba(0,0,0,0.4);*/
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 998
  }
  .options-container .body{
    max-height: 10rem;
    overflow-y: scroll;
    font-size: 1.1rem;
    padding: 5px;
  }
  .options-container button{
    border: 0;
    outline: none;
    background: none;
  }
  .options-container input{
    border: 0;
    outline: none;
    font-size: 1rem;
  }
  .options-item{
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: monospace;
    &:hover{
      background: #ddd;
    }
  }
</style>

<template>
  <div class="outer-container">
    <div class="fx-container">
      <input type="number" @input="onAmountChange" :value="amount" :disabled="amountDisabled">
      <button v-if="coin" style="white-space: nowrap" @click="openOptionBox">
        <img :src="`/coin-icons/${coin.network}/${coin.code}.png`" class="coin-avatar">
        <span style="font-family: monospace">{{coin.code}}</span>
        <i class="icon-arrow-down icons font-sm mgl10"></i>
      </button>
      <div v-if="inProgress" style="position: absolute; right: 42%">
        <i class="fa fa-spinner fa-lg fa-spin"></i>
      </div>
    </div>
    <div @click="open=false" v-if="open" class="options-closer"></div>
    <TransitionExpand>
      <div v-if="open" class="options-container">
        <div class="head">
          <i class="icons font-xl cui-magnifying-glass" style="margin: 0 0.5rem"></i>
          <input ref="searchInput" type="text" style="flex-basis: 100%" placeholder="Search for coins">
          <button style="padding: 0 0.9rem" @click="open=false">x</button>
        </div>
        <div class="body">
          <div @click="onItemSelect(c)" v-for="c in coins" class="options-item">
            <img
              :src="`/coin-icons/${c.network}/${c.code}.png`"
              class="coin-avatar"
              style="margin: 0.2rem 0.6rem"
            >
            <div style="padding: 0.5rem 0.5em">{{c.code}}</div>
            <div style="padding: 0 0.5rem">{{c.title}}</div>
          </div>
        </div>
      </div>
    </TransitionExpand>
  </div>
</template>

<script>
  import TransitionExpand from '../layouts/transitions/expand';
  export default {
    components:{TransitionExpand},
    props:{
      coins:{
        type: Array,
        default: []
      },
      current: {
        type: String,
        required: true
      },
      amount: {
        type: [Number,String],
        default: 0.1
      },
      amountDisabled: {
        type: Boolean,
        default: false
      },
      optionsDisabled: {
        type: Boolean,
        default: false
      },
      inProgress: {
        type: Boolean,
        default: false
      },
    },
    data(){
      return {
        open: false
      }
    },
    computed:{
      coin(){
        return this.coins.find(item => item.code===this.current);
      }
    },
    methods:{
      toggleOpen(){
        this.open = this.open === false;
      },
      openOptionBox(){
        if(this.optionsDisabled)
          return;
        this.open = true;
        setTimeout(()=>{
          this.$refs.searchInput.focus();
        },500);
      },
      onItemSelect(item){
        this.open = false;
        this.$emit('change', {amount: this.amount, coin: item})
      },
      onAmountChange(e){
        this.$emit('change', {amount: e.target.value, coin: this.coin})
      }
    }
  }
</script>
