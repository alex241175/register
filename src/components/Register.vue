<template>
  <v-container>
    <!-- event info -->
    <v-layout row>
        <v-flex>
           <v-card outlined color="transparent"> 
              <v-card-title>
                <h5>{{ '[' + event.category + '] ' +  event.title + ' ' + formatDateTime(event.start)  + ' 至 ' + formatTime(event.end) + ' (' + formatWeekDay(event.start) + ')'}}</h5>
              </v-card-title>
              <v-card-text>
                {{ event.location + ' ' + event.remark}}
            </v-card-text>
           </v-card>
        </v-flex>
    </v-layout>
    <!-- registering new member-->
    <v-layout row class="ma-1 pa-1" style="background-color:#eeeeee;" v-if="addNew || event.mode != '1'">
      <v-flex xs-4>
        <!-- <v-text-field label="姓名" v-model="newMember.name" clearable></v-text-field> -->
         <v-combobox label="請輸入姓名" item-text="name" item-value="id" 
         style="max-width: 200px;"
         v-model="memberObj" :items="membersSelection" :filter="customFilter"
         menu-props="auto"
         @change="memberSelected"
         @blur="memberSelected" 
         clearable hide-details></v-combobox>
        <!-- @input.native="memberObj =$event.srcElement.value"  menu-props control the selection list -->
      </v-flex>
      <v-flex xs-4 class="ml-1">
        <v-radio-group v-model="newMember.gender" row>
          <v-radio label="男" value="男"></v-radio>
          <v-radio label="女" value="女"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex xs-4>
        <v-select style="max-width: 200px;" :items="schools" label="地區" v-model="newMember.school" ></v-select>
      </v-flex>
      <v-flex xs-12>
        <v-btn :disabled="!formIsValid" @click="CreateRegisteredMember">報名</v-btn>
      </v-flex>
    </v-layout>
    <!-- Members list -->
    <v-simple-table>
      <thead>
        <tr>
          <!-- <th class="text-left" @click="sortBy('id')">No</th> -->
          <th class="text-left" @click="sortBy('gender')">性別</th>
          <th class="text-left" @click="sortBy('school')">地區</th>
          <th class="text-left" @click="sortBy('name')">姓名</th>
          <th class="text-right"><span v-if="event.mode == '1'">出席？</span></th>
        </tr>
      </thead>
       <tbody>
        <tr v-for="(member) in membersList" :key="member.id" >
            <!-- <td> {{index + 1 }}</td> -->
            <td>{{ member.gender}} </td>
            <td>{{ member.school}} </td>
            <td class="hand" @click.stop="openMemberDialog(member)">
              {{ member.name}}
               <p v-if="member.remark"><small>{{ member.remark}}</small></p>
            </td>
            <td class="text-right">
                <v-icon v-if="markAttendance || event.mode =='1'" class="hand" @click="toggleAttend(member)">{{ setAttendIcon(member.attend) }}</v-icon>
                <v-icon @click="deleteRegisteredMember(member)" v-if="!markAttendance && event.mode != '1'">fa-solid fa-xmark</v-icon>
            </td>
        </tr>
      </tbody>
    </v-simple-table>
    <!-- <v-layout row v-for="(member, index) in event.members" :key="member.id" class="ma-2 py-2 underline">
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
    </v-layout> -->
    <!-- total-->
    <v-layout row class="ma-2">
      <v-flex xs12>
        {{ '男:' + maleSum + '  女:' + femaleSum + '  共:' + (maleSum + femaleSum) }}
      </v-flex>
      <v-flex xs12 class="mt-2">
        <v-btn small text v-if="event.mode != '1'" @click="toggleMarkAttendance">{{ markAttendance ? '關閉掛號':'開啟掛號'}}</v-btn>
        <v-btn small text v-if="event.mode == '1'" @click="addNew = !addNew">新增人員</v-btn>
        <v-btn small text @click="exportList">清單</v-btn>
      </v-flex>
    </v-layout>  
     <RegisteredMemberDialog  :member="selectedMember" :visible="showRegisteredMemberDialog" @close="showRegisteredMemberDialog=false"
     @deleteRegisteredMember="deleteRegisteredMember" @updateRegisteredMember="updateRegisteredMember"/>
  </v-container>

</template>

<script>

import RegisteredMemberDialog from './RegisteredMemberDialog.vue'

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
      schools:['士C','士D','地南','古來','居鑾','麻坡'],
      showRegisteredMemberDialog : false,
      selectedMember:{},
      markAttendance: false,
      addNew: false,
      sortKey: 'id',
    }
  },
  components: {
      RegisteredMemberDialog
  },
  created() {
    this.$store.dispatch('loadRegisteredEvent', this.id)
    this.$store.dispatch('loadMembers')
  },
  methods: {
    openMemberDialog(member){
        this.selectedMember = {...member};  // Spread Syntax
        this.showRegisteredMemberDialog = true
    },
    customFilter (item, queryText, itemText) {
        const textOne = item.name.toLowerCase()
        const searchText = queryText.toLowerCase()
        return textOne.indexOf(searchText) > -1 
    },
    CreateRegisteredMember(){
      // if (this.memberObj instanceof Object == false){  // user type value
      //     this.newMember.name = this.memberObj
      // }
      const payload = {
        id: this.id,  // event id
        gender : this.newMember.gender,
        name : this.newMember.name,
        school: this.newMember.school,
        remark:'',
        attend: 0,
        category: this.event.category
      }
      this.$store.dispatch('CreateRegisteredMember', payload)
      this.newMember.gender = ''
      this.newMember.name = ''
      this.memberObj = null
      //reload
      this.$store.dispatch('loadRegisteredEvent', this.id)
    },
    deleteRegisteredMember(member){
      const payload = {
        eventId : this.id,
        memberId : member.id,
        category: this.event.category,
        name: member.name
      }
      this.$store.dispatch('deleteRegisteredMember', payload)
      //reload
      this.showRegisteredMemberDialog=false
      this.$store.dispatch('loadRegisteredEvent', this.id)
    },
    updateRegisteredMember(member){
      const payload = {
        eventId : this.id,
        member : member
      }
      this.$store.dispatch('updateRegisteredMember', payload)
      //reload
      this.showRegisteredMemberDialog=false
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
      this.updateRegisteredMember(member);
    },
    toggleMarkAttendance(){
      this.markAttendance = !this.markAttendance
    },
    memberSelected(){
      if (this.memberObj instanceof Object == false){  // user type value
          this.newMember.name = this.memberObj
           this.newMember.school = '士C'
      }else{
        this.newMember.gender = this.memberObj.gender
        this.newMember.name = this.memberObj.name
        this.newMember.school = this.memberObj.school 
      }
    },
    exportList(){
      var text = '[' + this.event.category + ']' +  this.event.title + '\n'
      + this.formatDateTime(this.event.start) + ' - ' + this.event.location + '\n'
      + '\n'
      this.event.members.sort((a, b) => (a.gender < b.gender) ? 1 : -1).forEach((member, index) =>{
        text += (index + 1) + ')' + member.gender + ' '+ member.name + '\n'
      })
      text += '\n'
      text += '男:' + this.maleSum + '  女:' + this.femaleSum + '  共:' + (this.maleSum + this.femaleSum)
      this.copyToClipboard(text)
    },
    sortBy(key){
      this.sortKey = key
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
        return this.newMember.gender != '' 
        && this.newMember.name != ''
        && this.newMember.name != null  
        && this.newMember.school != '';
    },
    membersList(){
        switch(this.sortKey){
          case 'name' : 
            return this.event.members.sort((a, b) => (a.name > b.name) ? 1 : -1) 
          case 'school' :
            return this.event.members.sort((a, b) => (a.school > b.school) ? 1 : -1) 
          case 'gender' :
            return this.event.members.sort((a, b) => (a.gender < b.gender) ? 1: -1) 
          case 'id' :
            return this.event.members.sort((a, b) => (a.dateAdded < b.dateAdded) ? 1: -1) 
      }
    },
    membersSelection(){
      const registeredMembers = this.event.members.map( m => { return m.name})
      return this.$store.getters.members
      .filter(m => m.category == this.event.category && registeredMembers.indexOf(m.name) == -1)
      .sort((x,y)=>x.name.localeCompare(y.name, 'zh-CN'))  // sort by pin yin
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