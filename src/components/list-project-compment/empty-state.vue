<template>
    <md-empty-state
    md-icon="devices_other"
    md-label="Create your first {{description()}}"
    md-description="Creating project, you'll be able to do something.">
    <md-button class="md-primary md-raised">Create first project</md-button>
    </md-empty-state>
</template>

<script>
export default {
    name:'empty-state',
    props:['description'],
    methods:{
        GetDescription(){
            if(this.description==null){
                return 'project';
            }
            else{
                return this.description;
            }
        }
    }
}
</script>

<style>

</style>