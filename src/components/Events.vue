<template>
  <div>
    <v-layout class="ma-2">
        <v-flex>
            <v-text-field name="start" label="開始" v-model="start" type="date" @change="filterEvents"
            ></v-text-field>
            <v-btn to="/create-event" exact>新增課程</v-btn>
            <v-btn class="mx-2" @click="reload"><v-icon>fa-solid fa-arrow-rotate-right</v-icon></v-btn>
        </v-flex>
    </v-layout>
    <v-layout v-for="event in currentPageEvents" :key="event.id" class="mt-2" >
        <v-flex>
            <v-card> 
            <v-card-title>
                <h5 class="hand" @click="openEvent(event.id)">{{ event.id + ' [' + event.category + '] ' +  event.title + ' ' +
                   formatDate(event.start) + ' (' + formatWeekDay(event.start) + ') ' + formatTime(event.start) }}
                </h5>
                <v-spacer></v-spacer>
                 <v-btn class="mr-2" small fab @click="notice(event)">通知</v-btn>
                 <v-btn class="mr-2" small fab @click="register(event.id)">報名</v-btn>
                 <v-btn class="mr-2" small fab @click="duplicate(event)">復制</v-btn>
                 <v-btn small fab @click="deleteEvent(event.id)">X</v-btn>
            </v-card-title >
            <v-card-text>
                {{  event.location + ' 人數：' + event.membersCount }}
            </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>

export default {
  name: 'Events',
  props: {
   
  },
  data() {
    return {
        start: (new Date()).toISOString().slice(0,10)  // start -> '2022-07-09'
    }
  },
  created() {
        this.$store.commit('setFilterStart', this.start);
        this.$store.dispatch('loadEvents')
  },
  methods: {
    openEvent(id) {
      this.$router.push('/edit-event/' + id);
    },
    deleteEvent(id) {
        this.$store.dispatch('deleteEvent', id)
    },
    filterEvents(){
        // this.start -> '2022-07-09'
        this.$store.commit('setFilterStart', this.start);
        this.$store.dispatch('loadEvents')
    },
    register(id) {
      this.$router.push('/register/' + id);
    },
    duplicate(event) {
       this.$store.dispatch('duplicateEvent', event)
    },
    notice(event){
      const url = 'https://register-3c0b8.web.app/register/'+ event.id
      const text = '*[' + event.category + ']' +  event.title + '*\n'
      + this.formatDate(event.start) + ' ('+ this.formatWeekDay(event.start) + ') ' 
      + this.formatTime(event.start) + ' - ' + event.location + '\n'
      + '\n'      
      + '請點進去報名，謝謝。' + '\n'
      + url
            
      this.copyToClipboard(text)
        
    },
    reload(){
      this.$store.dispatch('loadEvents')
    }
   
  },
  computed: {
    currentPageEvents() {
      return this.$store.getters.loadedEvents
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
