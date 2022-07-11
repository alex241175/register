<template>
    <div>
        <v-card>
            <v-card-title>
                <h4>新增課程</h4>
            </v-card-title>
            <v-card-text>
                <form @submit.prevent="CreateEvent">
                    <v-row>
                        <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                            <v-select :items="categories" label="課程" id="class" autocomplete hide-selected
                            v-model="event.category" required></v-select>
                        </v-flex>
                    </v-row>
                    <v-row>
                        <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-text-field name="title" label="標題" id="title" v-model="event.title" clearable
                        ></v-text-field>
                        </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-datetime-picker label="開始" v-model="event.start"> </v-datetime-picker>
                        <!-- <v-text-field name="start" label="開始" v-model="event.start" type="datetime-local"
                        ></v-text-field> -->
                    </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-datetime-picker label="結束" v-model="event.end"> </v-datetime-picker>
                        <!-- <v-text-field name="end" label="結束" v-model="event.end" type="datetime-local"
                        ></v-text-field> -->
                    </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-text-field name="location" label="地點" v-model="event.location" clearable
                        ></v-text-field>
                    </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-text-field name="head" label="班負責" v-model="event.head" clearable
                        ></v-text-field>
                    </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-text-field name="speaker" label="講員" v-model="event.speaker" clearable
                        ></v-text-field>
                    </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-text-field name="service" label="班務" v-model="event.service" clearable
                        ></v-text-field>
                    </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-textarea name="remark" label="備註" v-model="event.remark" clearable
                        ></v-textarea>
                    </v-flex>
                    </v-row>
                    <v-row>
                        <v-flex xs-3>
                            <v-radio-group v-model="event.mode" row>
                            <v-radio label="一般" value="0"></v-radio>
                            <v-radio label="指定人員" value="1"></v-radio>
                            </v-radio-group>
                        </v-flex>
                    </v-row>
                    <v-row>
                    <v-flex xs10 sm10 md8 offset-sm-1 offset-md-2>
                        <v-btn class="primary" :disabled="!formIsValid" type="submit">新增</v-btn>
                    </v-flex>
                    </v-row>
                </form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

export default {
  name: 'CreateEvent',
  props: {
   
  },
  data() {
    return {
        event: {
          title:'',
          category :'',
          start:'',
          end: '',
          location: '',
          head:'',
          speaker:'',
          service:'',
          mode: '0',  // 0 - normal  1 - designated members list
          remark:'',
        },
    }
  },
  methods: {
    CreateEvent(){
        // convert to date object
        this.event.start = new Date(this.event.start)
        this.event.end = new Date(this.event.end)
        this.$store.dispatch('createEvent', this.event)
        this.$store.dispatch('loadEvents')
        this.$router.push('/events')
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    formIsValid() {
        return this.event.category !== '' && this.event.title !== '';
    },
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
