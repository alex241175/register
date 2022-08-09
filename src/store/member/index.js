import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../../db'
import firebase from 'firebase/compat/app'  // for version 9
import 'firebase/compat/auth'
import router from '@/router'

Vue.use(Vuex)

export default {
  state: {
    members:[],
  },
  getters:{
    members(state) {
        return state.members;
      },
  },
  mutations: {
    setMembers(state, payload) {
      state.members = payload
    },
  },
  actions:{
    loadMembers({  // cannot load from members - because it will not update , unless you preload
        commit,
        getters,
        dispatch
      },payload) {
        //retrieve a collection
        db.collection('members')
        .orderBy('name')
        .get()
        .then(querySnapshot => {
           const members = []
           querySnapshot.docs.forEach(async doc => {
              members.push({
                id: doc.id,
                school: doc.data().school,
                category: doc.data().category,
                name: doc.data().name,
                gender: doc.data().gender,
              })
          })
          commit('setMembers', members);
        })
      },
      async createMember({ 
        commit,
        getters,
        dispatch
      }, payload) {

      // check if exist already
      const snap = await db.collection("members")
      .where("category", "==", payload.category)
      .where("name", "==", payload.name )
      .get()

      if (snap.size > 0 ){  // found
          console.log("member existed already : " + payload.name)
      }else{
          await db.collection('members').add(payload)
          console.log('new member added')
      }
      },
      updateMember({
        commit
      }, payload) {
  
        db.collection('members')
        .doc(payload.id)
        .update(payload)
        .then(() => {
          console.log('memberupdated!')
        })
  
      },
      deleteMember({
        commit,dispatch
      }, payload) {
  
        db.collection('members')
        .doc(payload)
        .delete()
        .then(() => {
          dispatch('loadMembers')  // reload
          console.log('member deleted!')
        })
      },
  }
}