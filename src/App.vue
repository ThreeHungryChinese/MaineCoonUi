<template>
  <md-app style="height: 100vh;" md-mode="reveal">
      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>
          <md-list>
            <md-list-item @click="menuVisible=false">
              <md-icon>dashboard</md-icon>
              <span class="md-list-item-text">Dashboard</span>
            </md-list-item>

            <md-list-item @click="menuVisible=false">
              <md-icon>devices_other</md-icon>
              <span class="md-list-item-text">processors</span>
            </md-list-item>

            <md-list-item @click="menuVisible=false">
              <md-icon>data_usage</md-icon>
              <span class="md-list-item-text">Statistics</span>
            </md-list-item>

            <md-list-item @click="menuVisible=false">
              <md-icon>info</md-icon>
              <span class="md-list-item-text">About</span>
            </md-list-item>
          </md-list>
      </md-app-drawer>
      <md-app-toolbar class="md-primary md-gutter md-toolbar-row">
          <div class="md-toolbar-section-start">        
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>
          </div>
          <div>
              <div class="md-title" style="text-align:center;">Auto Admission System</div>
          </div>
          <div class="md-toolbar-section-end">
            <login-compment v-model="user"></login-compment>
          </div>
      </md-app-toolbar>
      <md-app-content>
        <boot-screen v-if="!(user.isLoged)"></boot-screen>
        <list-processor-compment :user="user" v-if="user.isLoged" v-on:notification="showSnackBar"></list-processor-compment>
        <md-snackbar md-position="center" :md-duration="snackBar.duration" :md-active.sync="snackBar.show" md-persistent>
          <span>{{snackBar.info}}</span>
        </md-snackbar>
        <md-dialog-confirm
          :md-active.sync="deleting"
          md-title="Are you sure to Delete this Processor?"
          md-content="This action Cannot undo!"
          md-confirm-text="Agree"
          md-cancel-text="Disagree"
          @md-cancel="onCancel"
          @md-confirm="onConfirm" />
      </md-app-content>
  </md-app>
</template>

<script>
import BootScreen from './components/boot-screen'
import LoginCompment from './components/login-compment/login-compment'
import ListProcessorCompment from './components/list-project-compment/list-processor-compment'
export default {
  name: 'app',
  data:()=>({
    menuVisible:false,
    user:{
      messageCount:null,
      isLoged: false,
      userName: null,
      userId: null,
      sysRole: null
    },
    snackBar:{
      info:null,
      show:false,
      duration:4000
    },
    deleting:false
  }),
  components: {
    BootScreen,
    LoginCompment,
    ListProcessorCompment
  },
  methods: {
    showSnackBar(info){ 
      this.snackBar.show=true;
      this.snackBar.info=info;
    }
  },
}
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
