<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">
      Edit Time
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-time-picker v-model="editableTime" style="width: 100%" actions format="24hr">  <!-- fills the dialog window-->
              <template scope="{save, cancel}">  <!--Display the save and cancel buttons-->
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="editDialog = false">Close</v-btn>
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="onSaveChanges">Save</v-btn>
              </template>
            </v-time-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['meetup'],
    data () {
      return {
        editDialog: false,
        editableTime: null
      }
    },
    methods: {
      onSaveChanges () { // save the date
        // put the new date in the store and save on the server
        const newDate = new Date(this.meetup.date)
        const hours = this.editableTime.match(/^(\d+)/)[1]  // hours
        const minutes = this.editableTime.match(/:(\d+)/)[1]   // minutes
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        // dispatch to updateMeetupData
        // use the newDate because the whole thing is time stamp which includes date and time
        this.$store.dispatch('updateMeetupData', {
          id: this.meetup.id,
          date: newDate
        })
      }
    },
    created () {
      // construct the new date based on the old date
      // this happens before it's sent to the editable time
      this.editableTime = new Date(this.meetup.date).toISOString()
    }
  }
</script>

<style scoped>

</style>
