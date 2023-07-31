import { createRouter, createWebHashHistory } from 'vue-router'

import CreateResident from '../components/CreateResident.vue';
import AllResidents from '../components/AllResidents.vue';
import EditResident from '../components/EditResidents.vue';
import AllPeriods from '../components/AllPeriods'
import AllBills from '../components/AllBills'

const routes = [

  {
    path: '/',
    name: 'AllResidents',
    component: AllResidents,
  },

  {
    path: '/create-resident',
    name: 'CreateResident',
    component: CreateResident,
  },

  {
    path: '/edit-resident/:id',
    name: 'EditResident',
    component: EditResident,
  },

  {
    path: '/all-periods',
    name: 'AllPeriods',
    component: AllPeriods,
  },

  {
    path: '/all-bills',
    name: 'AllBills',
    component: AllBills
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  base: process.env.BASE_URL,
  routes
})

export default router
