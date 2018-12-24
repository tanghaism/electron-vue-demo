import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    online:true
  },
  getters:{
    online:state=>state.online
  },
  mutations:{
    // 设置在线/离线状态
    setOnLine(state,payload){
      state.online = payload
    }
  },
  actions:{

  },
  // modules,
  strict: process.env.NODE_ENV !== 'production',

  // TODO: Enable when deploy
  plugins: [createPersistedState()]
})
