import Vue from 'vue'
import Vuex from 'vuex'

import meetup from './meetup'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  // javascript way of merging modules. in our case, the 2 separate store index.js files
  modules: {

    /*
      The two store modules are used here
     */
    meetup: meetup,
    user: user,
    shared: shared
  }
})
