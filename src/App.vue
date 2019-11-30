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
              <span class="md-list-item-text">Projects</span>
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
        <list-project-compment :user="user" v-if="user.isLoged"></list-project-compment>
      </md-app-content>
  </md-app>
</template>

<script>
import BootScreen from './components/boot-screen'
import LoginCompment from './components/login-compment/login-compment'
import ListProjectCompment from './components/list-project-compment/list-project-compment'
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
    }
  }),
  components: {
    BootScreen,
    LoginCompment,
    ListProjectCompment
  }
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
