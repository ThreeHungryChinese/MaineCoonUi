<template>
    <component :is="user.isLoged?'user-info':'signin-button'" v-model="user"></component>
</template>

<script>
import SigninButton from './signin-button'
import UserInfo from './user-info'
export default {
    data:()=>({
        user:{
            messageCount:null,
            isLoged: false,
            userName: null,
            userId: null,
            sysRole: null
        }
    }),
    props:['value'],
    watch:{
        user:function(newVal,oldVal){
            this.$emit('input',this.user);
        }
    },
    methods: {
        
    },
    components:{
        SigninButton,UserInfo
    }
}
</script>

<style>

</style>