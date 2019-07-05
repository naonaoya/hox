import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './action'
// import mutations from './mutations'

Vue.use(Vuex)

const state = {
  user:{}, //用来存储用户注册信息
  setuser:false   //token
}

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state,
  mutations,
  actions,
  getters,
})
