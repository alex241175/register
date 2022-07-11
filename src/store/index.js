import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../db'
import firebase from 'firebase/compat/app'  // for version 9
import 'firebase/compat/auth'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedEvents:[],
    registeredEvent:{},
    user: null,
    filterStart:'',
    members:[],
  },
  getters: {
    loadedEvents(state) {
      return state.loadedEvents;
    },
    loadedEvent(state) {
      return eventId => {
        return state.loadedEvents.find(event => {
          return event.id === eventId;
        });
      };
    },
    registeredEvent(state) {
      return state.registeredEvent;
    },
    categories() {
      return ['壇人班','學人班','正啟班','會議','活動','課程']
    },
    user(state) {
      return state.user;
    },
    filterStart(state){
      return state.filterStart
    },
    members(state) {
      return state.members;
    },
  },
  mutations: {
    setLoadedEvents(state, payload) {
      state.loadedEvents = payload;
    },
    setRegisteredEvent(state, payload) {
      state.registeredEvent = payload;
    },
    setUser(state, payload) {
      state.user = payload
    },
    setFilterStart(state, payload) {
      state.filterStart = payload;
    },
    setMembers(state, payload) {
      state.members = payload
    },
  },
  actions: {

    loadEvents({
      commit,
      getters,
      dispatch
    },payload) {
      //retrieve a collection
      db.collection('events')
      .where('start', '>=', new Date(getters.filterStart))
      .orderBy('start')
      .get()
      .then(querySnapshot => {
        const events = []
         querySnapshot.docs.forEach(async doc => {

            // get members count
            const path = 'events/' + doc.id + '/members'
            const snap = await db.collection(path).get()
            const membersCount = snap.size

            events.push({
              id: doc.id,
              title: doc.data().title,
              category: doc.data().category,
              start: doc.data().start.toDate(),
              end: doc.data().end.toDate(),
              location: doc.data().location,
              head: doc.data().head,
              speaker: doc.data().speaker,
              service: doc.data().service,
              remark: doc.data().remark,
              mode: doc.data().mode,
              membersCount,
            })
        })
        // do something with documents
        //console.log('events', events)

        commit('setLoadedEvents', events);
      })
    },

    loadRegisteredEvent({
      commit,
      getters,
      dispatch
    },payload) {
      //retrieve a collection
      db.collection('events')
      .doc(payload)
      .get()
      .then(async doc => {
        const event = {}
        event.id = doc.id
        event.title = doc.data().title
        event.category = doc.data().category
        event.location = doc.data().location
        event.start = doc.data().start.toDate()
        event.end = doc.data().end.toDate()
        event.remark = doc.data().remark

        const path = 'events/' + payload + '/members'
        event.members = await db.collection(path).get()
        .then( querySnapshot => { 
            return querySnapshot.docs.map(doc => {
              return {
                id: doc.id,
                gender: doc.data().gender,
                name: doc.data().name,
                school: doc.data().school,
                remark: doc.data().remark,
                attend: doc.data().attend,
                dateAdded: doc.data().dateAdded.toDate(),
              }
            })
        })
        commit('setRegisteredEvent', event);
      })
    },

    loadMembers({
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

    async createEvent({ //create quotes from cloud firestore
      commit,
      getters,
      dispatch
    }, payload) {
     
      // get new document id
      let newId = '1'
      const snap = await db.collection('events').orderBy('dateAdded','desc').limit(1).get()
      if (snap.size > 0){
          newId = ((Number)(snap.docs[0].id) +  1).toString()
      }

      payload.dateAdded = new Date()
      db.collection('events')
      .doc(newId)
      .set(payload)
      .then(() => {
        dispatch('loadEvents')  // reload
        console.log('event created!')
      })
    },

    updateEvent({
      commit
    }, payload) {

      db.collection('events')
      .doc(payload.id)
      .update(payload)
      .then(() => {
        console.log('event updated!')
      })

    },

    async duplicateEvent({
      commit,dispatch
    }, payload) {

      // copy members for mode 1
      if (payload.mode == "1"){

        const path = 'events/' + payload.id + '/members'
        const snap = await db.collection(path).get()
        var members = []
        snap.docs.forEach(doc => {
            members.push({
              gender: doc.data().gender,
              name: doc.data().name,
              school: doc.data().school,
              attend: 0,
              dateAdded : new Date(),
              remark:'',
            })
          })
      }
      // get new document id
      let newId = '1'
      const snap = await db.collection('events').orderBy('dateAdded','desc').limit(1).get()
      if (snap.size > 0){
          newId = ((Number)(snap.docs[0].id) +  1).toString()
      }

      payload.dateAdded = new Date()
      delete payload.id
      delete payload.membersCount

      //copy to new event
      await db.collection('events').doc(newId).set(payload)

      //copy to new members
      if (payload.mode == "1"){
        members.forEach( async member =>{
          await db.collection('events').doc(newId).collection('members').add(member)
        })
      }
      dispatch('loadEvents')  // reload
      console.log("new event duplicated ok!")
    },

    deleteEvent({
      commit,dispatch
    }, payload) {

      db.collection('events')
      .doc(payload)
      .delete()
      .then(() => {
        dispatch('loadEvents')  // reload
        console.log('event deleted!')
      })
    },
    async register({ 
      commit,
      getters,
      dispatch
    }, payload) {

      // add to Members collection if not exist
      const snap = await db.collection("members")
      .where("category", "==", payload.category)
      .where("name", "==", payload.name )
      .get()

      if (snap.size == 0 ){  // not found
        db.collection('members')
        .add({
          gender: payload.gender,
          name : payload.name,
          school : payload.school,
          category: payload.category,
        })
      }
      // register new member
      const member = {
        gender: payload.gender,
        name : payload.name,
        school : payload.school,
        remark : payload.remark,
        attend : payload.attend,
        dateAdded : new Date()
      }

      db.collection('events')
      .doc(payload.id)
      .collection('members')
      .add(member)
      .then(() => {
        console.log('new member registered')
      })
    },
    deleteMember({
      commit
    }, payload) {
      
      db.collection('events')
      .doc(payload.eventId)
      .collection('members')
      .doc(payload.memberId)
      .delete()
      .then(() => {
        console.log('member deleted!')
      })
    },
    updateMember({
      commit
    }, payload) {

      db.collection('events')
      .doc(payload.eventId)
      .collection('members')
      .doc(payload.member.id)
      .update(payload.member)
      .then(() => {
        console.log('member updated!')
      })
    },
    signIn({commit},payload){  // google sign in
      let provider = new firebase.auth.GoogleAuthProvider();
      let persistType = firebase.auth.Auth.Persistence.LOCAL  //remember me across browser sessions
      firebase
      .auth()
      .setPersistence(persistType)
      .then(()=>{
        return firebase.auth().signInWithPopup(provider)
      })      
      .then((result) => {
        let token = result.credential.accessToken;
        let user = result.user;
        //check if signIn user is in local users database
        db.collection("users").where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.size > 0){
              commit('setUser', {displayName: user.displayName, email: user.email, id: user.uid})
              router.push('/events');
            }else{
              alert("You are not authorised to sign in.");
            }
        })
        .catch((error) => {
            console.log('error')
        });
       
      })
      .catch((err) => {
        console.log(err); // This will give you all the information needed to further debug any errors
      });
    },

    signOut({commit},payload){
      firebase
      .auth()
      .signOut()
      .then(() => {
        commit('setUser', null)
        alert("Successfully signed out.");
      });
    }
  },
})
