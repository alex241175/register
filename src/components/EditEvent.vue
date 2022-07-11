<template>
    <div>
        <v-card class="ma-2 pa-2" outlined color="transparent">
            <v-card-title>
                <h4>修改課程</h4>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-select :items="categories" label="課程" id="class" autocomplete hide-selected
                        v-model="editedEvent.category" required></v-select>
                    </v-flex>
                </v-row>
                <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-text-field name="title" label="標題" id="title" v-model="editedEvent.title" clearable
                    ></v-text-field>
                    </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-datetime-picker label="開始" v-model="editedEvent.start"> </v-datetime-picker>
                    <!-- <v-text-field name="start" label="開始" v-model="editedEvent.start" type="datetime-local"
                    ></v-text-field> -->
                </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-datetime-picker label="結束" v-model="editedEvent.end"> </v-datetime-picker>
                    <!-- <v-text-field name="end" label="結束" v-model="editedEvent.end" type="datetime-local"
                    ></v-text-field> -->
                </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-text-field name="location" label="地點" v-model="editedEvent.location" clearable
                    ></v-text-field>
                </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-text-field name="head" label="班負責" v-model="editedEvent.head" clearable
                    ></v-text-field>
                </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-text-field name="speaker" label="講員" v-model="editedEvent.speaker" clearable
                    ></v-text-field>
                </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-text-field name="service" label="班務" v-model="editedEvent.service" clearable
                    ></v-text-field>
                </v-flex>
                </v-row>
                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-textarea name="remark" label="備註" v-model="editedEvent.remark" clearable
                    ></v-textarea>
                </v-flex>
                </v-row>
                <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-radio-group v-model="editedEvent.mode" row>
                        <v-radio label="一般" value="0"></v-radio>
                        <v-radio label="指定人員" value="1"></v-radio>
                        </v-radio-group>
                    </v-flex>
                </v-row>

                <v-row>
                <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                    <v-btn plain><v-icon @click="editEvent">fa-solid fa-floppy-disk</v-icon></v-btn>
                    <v-btn plain class="ma-2"><v-icon @click="exit">fa-solid fa-xmark</v-icon></v-btn>
                </v-flex>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

export default {
  name: 'EditEvent',
  props:  ['id'],
  data() {
    return {
    }
  },
  methods: {
    editEvent(){
        this.$store.dispatch('updateEvent', this.editedEvent)
        this.$router.push('/events')
    },
    exit(){
        this.$router.push('/events')
    }
  },
  computed: {
    editedEvent() {
        return this.$store.getters.loadedEvent(this.id);
    },
    categories() {
      return this.$store.getters.categories;
    },
    formIsValid() {
        return this.editedEvent.category !== '' && this.editedEvent.title !== '';
    },
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
