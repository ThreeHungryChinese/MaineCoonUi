<template>
    <component :is="user.isLoged?'user-info':'signin-button'" v-model="user"></component>
</template>

<script>
import SigninButton from './sign-button.vue'
import UserInfo from './user-info.vue'
export default {
    data:()=>({
    user:{
        messageCount:0,
        isLoged: false,
        userName: null,
        userId: null,
        sysRole: null
    }
    }),
    methods: {
        userLogined:function(loginedUserInfo){
            this.user = loginedUserInfo;
            this.$emit('login-successed',this.user);
        }
    },
    components:{
        SigninButton,UserInfo
    }
}
</script>

<style>

</style>