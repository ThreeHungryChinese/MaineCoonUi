<template>
  <md-dialog @md-closed="$emit('update:showDialog',false)" :md-active.sync="showDialog">
      <md-dialog-content>

      </md-dialog-content>
      <md-dialog-actions>
            <md-button class="md-raised md-primary floatright" :disabled="false" @click="save">
                Save
            </md-button>
            <md-button class="md-accent" @click="$emit('update:showDialog',false)">Cancel</md-button>
        </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
    name:'edit-create-processorflow-dialog',
    props:['processorSetting','showDialog'],
    data:()=>({
        setting:{
            processorId:null,
            parameterFrom:[],
            name:null
        },
        processorInfo:{
            id:null,
            name:null,
            userName:null,
            instruction:null,
            algorithmParameterJson:[]
        }
    }),
    methods:{
        save(){
            $emit('update:processorSetting',setting)
            $emit('update:showDialog',false);
        }
    }
}
</script>

<style>

</style>