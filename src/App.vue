<template>
  <md-app style="height: 100vh;">
      <md-app-toolbar class="md-primary md-gutter md-toolbar-row">
          <div class="md-toolbar-section-start">
              <div class="md-title">My Title</div>
              <!--signin-button :logined="userLogined"></signin-button-->
              <!--user-info :user="user"></user-info-->
          </div>
          <div>
              <div class="md-title" style="text-align:center;">Auto Admission System</div>
          </div>
          <div class="md-toolbar-section-end">
            <login-compment></login-compment>
          </div>
      </md-app-toolbar>
      <md-app-content class="md-layout md-alignment-center-center">
        <boot-screen class="md-layout-item"></boot-screen>
        <div class="md-layout-item" v-if="false" >
          <md-empty-state
            md-icon="devices_other"
            md-label="Create your first project"
            md-description="Creating project, you'll be able to do something.">
            <md-button class="md-primary md-raised">Create first project</md-button>
          </md-empty-state>
        </div>
      </md-app-content>
  </md-app>
</template>

<script>
import BootScreen from './components/boot-screen'
import LoginCompment from './components/login-compment/login-compment'
export default {
  name: 'app',
  components: {
    BootScreen,
    LoginCompment
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
