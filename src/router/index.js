import Vue from 'vue'
import VueRouter from 'vue-router'
import Events from '../components/Events'
import CreateEvent from '../components/CreateEvent'
import EditEvent from '../components/EditEvent'
import Register from '../components/Register'
import Home from '../components/Home'
import Members from '../components/Members'
import AuthGuard from './auth-guard';

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/events', name: 'events', component: Events,  beforeEnter: AuthGuard },
  { path: '/create-event', name: 'create-event', component: CreateEvent, beforeEnter: AuthGuard},
  { path: '/edit-event/:id', name: 'edit-event', props: true, component: EditEvent, beforeEnter: AuthGuard},
  { path: '/register/:id', name: 'register', props: true, component: Register },
  { path: '/members', name: 'members', component: Members,  beforeEnter: AuthGuard },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
