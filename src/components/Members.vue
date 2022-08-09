<template>
   <v-container>
      <!-- members query -->
    <v-layout class="ma-2">
        <v-flex>
            <v-select :items="categories" label="課程" autocomplete hide-selected
                            v-model="categoryFilter" clearable></v-select>
            <v-btn @click.stop="openMemberDialog(selectedMember)" exact>新增人員</v-btn>
            <v-btn class="mx-2" @click.stop="copyMemberDialog" exact>復制</v-btn>
        </v-flex>
    </v-layout>
    <!-- Members list -->
    <v-simple-table>
      <thead>
        <tr>
          <!-- <th class="text-left" @click="sortBy('id')">No</th> -->
          <th>
               <v-checkbox v-model="selectedAll"></v-checkbox>
          </th>
          <th class="text-left">性別</th>
          <th class="text-left">地區</th>
          <th class="text-left">姓名</th>
          <th class="text-left">課程</th>
          <th class="text-left"></th>
        </tr>
      </thead>
       <tbody>
        <tr v-for="(member) in members" :key="member.id" >
            <!-- <td> {{index + 1 }}</td> -->
            <td>
               <v-checkbox v-model="selected" :value="member.id"></v-checkbox>
            </td>
            <td>{{ member.gender}} </td>
            <td>{{ member.school}} </td>
            <td class="hand" @click.stop="openMemberDialog(member)">
              {{ member.name}}
            </td>
            <td>{{ member.category}} </td>
            <td class="text-right">
                <v-icon @click="deleteMember(member.id)">fa-solid fa-xmark</v-icon>
            </td>
        </tr>
      </tbody>
    </v-simple-table>
    <MemberDialog  :member="selectedMember" :visible="showMemberDialog" @close="closeMemberDialog" 
    @updateMember="updateMember"
    @createMember="createMember"
    />
    <v-dialog v-model="showCopyMemberDialog">
        <v-card>
            <v-card-title>
              <h4>復制到別的課程</h4>
            </v-card-title>
            <v-card-text>
              <v-select :items="categories" label="復制到課程" autocomplete hide-selected
                  v-model="copyToCategory" clearable></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="copyMember">復制</v-btn>
                <v-btn @click.stop="showCopyMemberDialog = false">X</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" color="black" top="top" timeout="2000">{{ snackbarText }}</v-snackbar>
   </v-container>
</template>
<script>

import MemberDialog from './MemberDialog.vue'

export default {
  name: 'Member',
  data() {
    return {
      snackbar : false,
      snackbarText : '',
      showMemberDialog : false,
      showCopyMemberDialog : false,
      sortKey: 'id',
      selectedMember: {},
      categoryFilter:'',
      copyToCategory: '',
      selected: [],
      top: true,
    }
  },
   components: {
      MemberDialog
  },
    created() {
    this.$store.dispatch('loadMembers')
  },
  methods: {
    openMemberDialog(member){
        this.selectedMember = {...member};  // Spread Syntax
        if (!member.school){
            this.selectedMember.school = '士C'
        }
        if (this.categoryFilter){
          this.selectedMember.category = this.categoryFilter
        }
        this.showMemberDialog = true
    },
    closeMemberDialog(){
        this.selectedMember = {}
        this.showMemberDialog = false
    },
    copyMemberDialog(){
        this.showCopyMemberDialog = true
    },
    deleteMember(id){
      this.$store.dispatch('deleteMember', id)
      this.snarkbarText = "刪除完成"
      this.snarkbar = true
    },
    updateMember(member){
      this.$store.dispatch('updateMember', member)
      this.selectedMember = {}
       this.showMemberDialog=false
       this.$store.dispatch('loadMembers')
    },
    createMember(member){
      this.$store.dispatch('createMember', member)
      this.selectedMember = {}
      this.showMemberDialog = false
      this.snarkbarText = "新增完成"
      this.snarkbar = true
      this.$store.dispatch('loadMembers')
    },
    copyMember(){
        // console.log(this.selected)
        this.selected.forEach(id => {
          const member = this.members.find(x => x.id === id)
          delete member.id
          member.category = this.copyToCategory
          this.$store.dispatch('createMember', member)
        })
        this.showCopyMemberDialog = false
        this.$store.dispatch('loadMembers')
        this.selected = []
        alert("復制完成")
    }
  },
  computed: {
    members() {
      // this.$store.getters.members.filter( m = {
      // if (this.categoryFilter) {
      //   result = result.filter(m => {
      //     return m.category == this.categoryFilter;
      //   })
      // }
      // return result.sort((x,y)=>x.name.localeCompare(y.name, 'zh-CN'))  // sort by pin yin
      // },
      return this.$store.getters.members
      .sort((x,y)=>x.name.localeCompare(y.name, 'zh-CN'))
      .filter(m => {
          if (this.categoryFilter) {
              return m.category == this.categoryFilter;
          }
          return true
      })
    },
    categories() {
        return this.$store.getters.categories;
    },
    selectedAll: {
      set(val) {
        this.selected = []
        if (val) {
          this.members.forEach( member => {
            this.selected.push(member.id)
          })
        }
      },
      get() {
        return this.selected.length === this.members.length
      }
    }
  }
}
</script>