<template>
  <v-container>
    <!-- event info -->
    <v-layout>
        <v-flex>
           <v-card> 
              <v-card-title>
                <h5>{{ '[' + event.category + '] ' +  event.title + ' ' + formatDateTime(event.start)  + ' 至 ' + formatTime(event.end) + ' (' + formatWeekDay(event.start) + ')'}}</h5>
              </v-card-title>
              <v-card-text>
                {{event.location}}
            </v-card-text>
           </v-card>
        </v-flex>
    </v-layout>
    <!-- registering new member-->
    <v-layout row class="ma-2">
      <v-flex xs-6>
        <!-- <v-text-field label="姓名" v-model="newMember.name" clearable></v-text-field> -->
        
         <v-combobox label="姓名" item-text="name" item-value="id" 
         v-model="memberObj" :items="membersSelection" :filter="customFilter"
         @change="memberSelected" 
         @input.native="memberObj =$event.srcElement.value"
         clearable hide-details ></v-combobox>
       
      </v-flex>
      <v-flex xs-3>
        <v-radio-group v-model="newMember.gender" row>
          <v-radio label="男" value="男"></v-radio>
          <v-radio label="女" value="女"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex xs-3>
        <v-select :items="schools" label="地區" v-model="newMember.school" ></v-select>
      </v-flex>
      <v-flex xs-12>
        <v-btn @click="register">報名</v-btn>
      </v-flex>
    </v-layout>
    <!-- Members list -->
    <v-layout row v-for="(member, index) in event.members" :key="member.id" class="ma-2 py-2 underline">
      <v-flex md1 p-1 class="align-content-start"> {{index + 1 }}</v-flex>
      <v-flex md2 p-1 class="align-content-start">{{ member.gender}} </v-flex>
      <v-flex md3 p-1 class="align-content-start">{{ member.school}} </v-flex>
      <v-flex md3 p-1 class="align-content-start hand" @click.stop="openMemberDialog(member)">{{ member.name}} </v-flex>
      <v-flex md3 p-1 class="align-content-start" v-if="markAttendance">
        <v-icon class="hand" @click="toggleAttend(member)">{{ setAttendIcon(member.attend) }}</v-icon>
      </v-flex>
      <v-flex md3 p-1>
        <v-btn small fab @click="deleteMember(member)" v-if="!markAttendance">X</v-btn>
      </v-flex>
    </v-layout>
    <!-- total-->
    <v-layout row class="ma-2">
      <v-flex xs12>
        {{ '男:' + maleSum + '  女:' + femaleSum + '  共:' + (maleSum + femaleSum) }}
      </v-flex>
      <v-flex xs12 class="mt-2">
        <v-btn @click="toggleMarkAttendance">{{ markAttendance ? '關閉掛號':'開啟掛號'}}</v-btn>
      </v-flex>
    </v-layout>  
     <MemberDialog  :member="selectedMember" :visible="showMemberDialog" @close="showMemberDialog=false" @updateMember="updateMember"/>
  </v-container>

</template>

<script>

import MemberDialog from './MemberDialog.vue'

export default {
  name: 'Register',
  props: ['id'] ,
  data() {
    return {
      newMember:{
        gender: '',
        name: '',
        school: '士C',
      },
      memberObj:null,
      schools:['士C','士D','地南','古來'],
      showMemberDialog : false,
      selectedMember:{},
      markAttendance: false,
    }
  },
  components: {
      MemberDialog
  },
  created() {
    this.$store.dispatch('loadRegisteredEvent', this.id)
    this.$store.dispatch('loadMembers')
  },
  methods: {
    openMemberDialog(member){
        this.selectedMember = member
        this.showMemberDialog = true
    },
    customFilter (item, queryText, itemText) {
        const textOne = item.name.toLowerCase()
        const searchText = queryText.toLowerCase()
        return textOne.indexOf(searchText) > -1 
    },
    register(){
      if (this.memberObj instanceof Object == false){  // user type value
          this.newMember.name = this.memberObj
      }
      const payload = {
        id: this.id,  // event id
        gender : this.newMember.gender,
        name : this.newMember.name,
        school: this.newMember.school,
        remark:'',
        attend: 0,
        category: this.event.category
      }
      this.$store.dispatch('register', payload)
      this.newMember.gender = ''
      this.newMember.name = ''
      this.memberObj = null
      //reload
      this.$store.dispatch('loadRegisteredEvent', this.id)
    },
    deleteMember(member){
      const payload = {
        eventId : this.id,
        memberId : member.id
      }
      this.$store.dispatch('deleteMember', payload)
      //reload
      this.$store.dispatch('loadRegisteredEvent', this.id)
    },
    updateMember(member){
      const payload = {
        eventId : this.id,
        member : member
      }
      this.$store.dispatch('updateMember', payload)
      //reload
      this.showMemberDialog=false
      this.$store.dispatch('loadRegisteredEvent', this.id)
    },
    
    setAttendIcon(attend){
       switch(attend){
            case 0 : return "far fa-square"
            case 1 : return "fas fa-check"
            case 2 : return "fas fa-times"
        }
    },
    toggleAttend(member){
      switch(member.attend){
          case 0 : 
            member.attend = 1
            break
          case 1 : 
            member.attend = 2
            break
          case 2 : 
            member.attend = 0
            break
      }
      this.updateMember(member);
    },
    toggleMarkAttendance(){
      this.markAttendance = !this.markAttendance
    },
    memberSelected(){
      this.newMember.gender = this.memberObj.gender
      this.newMember.name = this.memberObj.name
      this.newMember.school = this.memberObj.school
    }

  },
  computed: {
     userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    event() {
        return this.$store.getters.registeredEvent;
    },
    maleSum(){
        return this.event.members.filter(m => m.gender == '男').length
    },
    femaleSum(){
        return this.event.members.filter(m => m.gender == '女').length
    },
    formIsValid() {
        return this.newMember.gender != '' && this.newMember.name != ''  && this.newMember.school != '';
    },
    membersSelection(){
      return this.$store.getters.members;
    }
 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .underline {
    border-bottom: 1px solid lightgray;
  }
</style>