<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>  <!-- fills the dialog window-->
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
            </v-date-picker>
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
        editableDate: null
      }
    },
    methods: {
      onSaveChanges () { // save the date
        // put the new date in the store and save on the server
        const newDate = new Date(this.meetup.date)

        // new date based on the Vuetify date picker
        const newDay = new Date(this.editableDate).getUTCDate()
        const newMonth = new Date(this.editableDate).getUTCMonth()
        const newYear = new Date(this.editableDate).getUTCFullYear()

        // update the newDate which is the one we already had
        newDate.setUTCDate(newDay)
        newDate.setUTCMonth(newMonth)
        newDate.setUTCFullYear(newYear)

        // dispatch to updateMeetupData
        this.$store.dispatch('updateMeetupData', {
          id: this.meetup.id,
          date: newDate
        })
      }
    },
    created () {
      // construct the new date based on the old date
      this.editableDate = new Date(this.meetup.date).toISOString()
    }
  }
</script>

<style scoped>

</style>
