import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import App from './App'
import * as firebase from 'firebase'  // import everything related to firebase
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog'

Vue.use(Vuetify)
Vue.config.productionTip = false

// Can now use these globally
Vue.filter('date', DateFilter)  // date is what we call it in our app
Vue.component('app-alert', AlertCmp)  // register the alert component globally to be used everywhere
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

/* eslint-disable no-new */
// Root vue instance
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {  // when the vue instance is created
    // initialize firebase
    firebase.initializeApp({
      apiKey: 'AIzaSyBVsNF54gEtI1FLFEXsoaePyA7T3xlnNFU',
      authDomain: 'devmeetup-394ad.firebaseapp.com',
      databaseURL: 'https://devmeetup-394ad.firebaseio.com',
      projectId: 'devmeetup-394ad',
      storageBucket: 'gs://devmeetup-394ad.appspot.com/'
    })
    // lock user in if firebase detects a valid login token exists
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')  // no payload required
      }
    })
    // load the meetups from the database
    this.$store.dispatch('loadMeetups')
  }
})
