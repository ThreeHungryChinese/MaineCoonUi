
<template>
    <div>
        <md-menu md-direction="bottom-end" md-size="huge" md-align-trigger>
        <component :is="isMessageExisted()" :user="user"></component>
        <md-menu-content>
            <md-toolbar class="md-layout md-alignment-center-center md-large md-transparent" md-elevation="0">
            <md-content>
                <md-avatar class="md-layout-item md-avatar-icon md-primary md-large md-gutter">{{user.userName[0]}}</md-avatar>
            </md-content>
            </md-toolbar>
            <md-menu-item lass="md-layout md-alignment-center-center">
                <span class="md-layout-item md-headline" style="text-align: center;">{{user.userName}}</span>
            </md-menu-item>
            <md-menu-item lass="md-layout md-alignment-center-center">
                <span class="md-layout-item md-caption" style="text-align: center;">{{user.sysRole}}</span>
            </md-menu-item>
            <md-menu-item lass="md-layout md-alignment-center-space-between">
                <md-button class="md-button md-raised md-layout-item" href="">Profile</md-button>
                <md-button class="md-button md-raised md-accent md-layout-item" href="">Sign Out</md-button>
            </md-menu-item>
        </md-menu-content>
        </md-menu>
    </div>
</template>
<script>
export default {
    name:'user-info',
    props:['user'],
    model:{
        prop:'user',
        event:'user-change'
    },
    methods:{
        isMessageExisted(){
            if(this.user.messageCount<=0){
                return 'without-message';
            }
            else{
                return 'with-message';
            }
        }
    },
    components:{
        'without-message':{
            props:['user'],
            template:`
                <md-button md-menu-trigger class="md-icon-button md-raised md-dense md-primary">
                    <md-avatar class="md-avatar-icon">{{user.userName[0]}}</md-avatar>
                </md-button>
            `
        },
        'with-message':{
            props:['user'],
            template:`
                <md-badge md-position="bottom" :md-content="user.messageCount">
                    <md-button md-menu-trigger class="md-icon-button md-raised md-dense md-primary">
                        <md-avatar class="md-avatar-icon">{{user.userName[0]}}</md-avatar>
                    </md-button>
                </md-badge>
            `
        }
    },
}
</script>

<style>

</style>