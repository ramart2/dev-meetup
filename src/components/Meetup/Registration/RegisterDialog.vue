<template>
    <v-dialog persistent v-model="registerDialog">  <!--persistent keeps the dialog on top-->
      <v-btn accent slot="activator">
        {{ userIsRegistered ? 'Unregister' : 'Register' }}  <!--change the button text depending on if registered-->
      </v-btn>
      <v-card>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card-title v-if="userIsRegistered">Unregister for meetup?</v-card-title>
              <v-card-title v-else>Register for meetup?</v-card-title>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card-text>You can change your mind later.</v-card-text>
              </v-flex>
            </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card-actions>
                <v-btn class="red--text darken-1"
                       flat
                       @click="registerDialog = false">Cancel
                </v-btn>
                <v-btn class="green--text darken-1"
                       flat
                       @click="onAgree">Confirm
                </v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    props: ['meetupId'],
    data () {
      return {
        registerDialog: false
      }
    },
    computed: {
      userIsRegistered () {
        // find a specific element in an array and return the position
        // if it returns a number >= 0 then we are registered but if it returns < 0 we are not
        return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
          // return true if this meetup id is the same as the meetup that's currently loaded
          return meetupId === this.meetupId
        }) >= 0
      }
    },
    methods: {
      props: ['meetupId'],
      onAgree () {
        // check if the user is registered and register or un-register them accordingly
        if (this.userIsRegistered) {
          this.$store.dispatch('unregisterUserFromMeetup', this.meetupId)
        } else {
          this.$store.dispatch('registerUserForMeetup', this.meetupId)
        }
      }
    }
  }
</script>

<style scoped>

</style>
