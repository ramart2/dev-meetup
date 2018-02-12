/*
  This is just a regular javascript object now.  It no longer is a store,
  instead it gets sent to the store file now.
 */
export default {
  // the store configuration
  state: {
    loading: false,  // app loading
    error: null  // authentication error
  },
  mutations: {  // changes the state of data properties
    setLoading (state, payload) {
      state.loading = payload  // true or false
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  /*
    Perform all asynchronous tasks in the actions area
   */
  actions: {  // to dispatch the mutations
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {  // get the store in pur components
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
