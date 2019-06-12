export const namespaced = true;

export const state = () => ({
  coinList: [],
  swapList: []
});

export const getters = {
  coins(state) {
    return state.coinList;
  },
  swapList(state) {
    return state.swapList;
  }
}

export const mutations = {
  setCoinList(state, coinList){
    state.coinList = coinList;
  },
  setUserSwapList(state, swapList){
    state.swapList = swapList;
  }
}

export const actions = {
  loadCoinList({dispatch, commit, state, rootState}) {
    return this.$axios.post(`/api/v0.1/swap/coin-list`)
      .then(({data}) => {
        if(data.success) {
          commit('setCoinList', data.coinList);
          return data;
        }
      })
  },
  loadUserSwapList({dispatch, commit, state, rootState}) {
    return this.$axios.post(`/api/v0.1/swap/list`)
      .then(({data}) => {
        if(data.success) {
          commit('setUserSwapList', data.swapList);
          return data;
        }else {
          return null
        }
      })
  }
}
