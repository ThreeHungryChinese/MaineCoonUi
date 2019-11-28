<template>
    <div>
        <md-menu md-direction="bottom-end" md-align-trigger>
            <md-button md-menu-trigger class="md-icon-button md-raised md-dense md-primary">
                <md-icon>person</md-icon>
            </md-button>
            <md-menu-content>
                <md-menu-item @click="showSigninDialog=true">Sign in</md-menu-item>
                <md-menu-item @click="showSignupDialog=true">Sign up</md-menu-item>
            </md-menu-content>
        </md-menu>
        <sign-in-dialog v-on:unshowDialog="showSigninDialog=false" :showDialog="showSigninDialog" v-model="user"></sign-in-dialog>
    </div>
</template>

<script>
import SignInDialog from './sign-in-dialog'
export default {
    name:'signin-button',
    props:['value'],
    data: () => ({
        showSigninDialog: false,
        showSignupDialog: false,
        user:null
    }),
    created:function(){
        this.user=this.value;
    },
    watch: {
        user:function(newVal, oldVal){
            this.$emit('input',newVal);
        },
        value:function(newVal,oldVal){
            this.user = this.value;
        }
    },
    components:{
        SignInDialog
    }
}
</script>

<style>

</style>