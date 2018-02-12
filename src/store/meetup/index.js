import * as firebase from 'firebase'
/*
  This is just a regular javascript object now.  It no longer is a store,
  instead it gets sent to the store file now.
 */
export default {
  // the store configuration
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',
        id: 'homecarouselimage1',
        title: 'Meetup in New York',
        date: new Date(),
        location: 'New York',
        description: 'New York, New York'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Sunset_over_the_base_of_the_Eiffel%2C_Paris_2007.jpg',
        id: 'homecarouselimage2',
        title: 'Meetup in Paris',
        date: new Date(),
        location: 'Paris',
        description: 'It\'s Paris!'
      }
    ]
  },
  mutations: {  // changes the state of data properties
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {  // payload is the new meetup data
      /*
          Logic is:
          1. Fetch a meetup
          2. Change what only needs to be changed (depending on what was passed in the payload)
       */
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    }
  },
  /*
    Perform all asynchronous tasks in the actions area
   */
  actions: {  // to dispatch the mutations
    loadMeetups ({commit}) {
      commit('setLoading', true)
      /*
        // on('value') call on everytime the data changes,realtime
        // once('value') just once
        // 'value' is a list of meetups
       */
      firebase.database().ref('meetups').once('value')
        .then((data) => {
          const meetups = []  // array to hold the meetups
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              location: obj[key].location,
              creatorId: obj[key].creatorId
            })
          }
          // a new mutation
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', true)
          }
        )
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),  // convert to string so firebase can store it
        creatorId: getters.user.id  // the id firebase assigns
      }
      // image url and key to be stored in firebase storage
      let imageUrl
      let key
      /*
        // reach out to Firebase and store it
        // ref represents the node in the database where we want to store data
        // new node named meetups in the db
        // push adds data to the list
        // we are pushing the new const meetup we create
       */
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          // access the meetup's key that gets created in firebase
          key = data.key  // get the key from firebase
          // commit('createMeetup', {
          //   ...meetup,  // spread operator means grab all keys from the meetup object and add id to it
          //   id: key
          // })
          return key
        })
        .then(key => {
          // reach out to firebase
          // the payload.image is from the create meetup method...create meetup creates a payload
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))  // gives the file extension

          // store in firebase storage
          // store as meetups/key.extension on the server db
          return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          // use the image url to reach out to firebase and update it
          imageUrl = fileData.metadata.downloadURLs[0]  // the url pointing to our file
          // firebase creates the object imageUrl if it doesn't exist
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})  // firebase creates key as the identifier
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,  // old meetup data
            imageUrl: imageUrl,  // imageUrl from firebase
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    updateMeetupData ({commit}, payload) {  // contains an object with the new data
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {  // if a title was entered, update it
        updateObj.title = payload.title
      }
      if (payload.description) {  // if a description was entered, update it
        updateObj.description = payload.description
      }
      if (payload.date) {  // if a date was entered update it
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)  // will override the new properties and leaved the others unchanged
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {  // get the store in pur components
    loadedMeetups (state) {
      // takes 2 meetups as a function to compare them
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        // true means meetupA is first and meetupB if false
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      // only return some of the meetups
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      // load the meetup we selected by id
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    }
  }
}
