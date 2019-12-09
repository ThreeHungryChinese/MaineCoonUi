<template>
    <div class=" md-gutter md-layout md-alignment-center-space-around">
        <!--md-speed-dial 
            class=" md-layout-item md-gutter"
            v-for="(processor, index) in ProgramJson_temp"
            :class="'md-elevation-' + index + ' ' + getProcessorFlowSetValidation(index)" 
            :key="index" >
            <md-speed-dial-target @click="editProcessor(index)">
                <span>{{processor.name[0]}}</span>
            </md-speed-dial-target>

            <md-speed-dial-content>
                <md-button class="md-icon-button md-accent" @click="deleteProcessor(index)">
                <md-icon>close</md-icon>
                </md-button>

                
                <md-button class="md-icon-button " @click="addParameter(index)">
                <md-icon>add</md-icon>
                </md-button>
            </md-speed-dial-content>
        </md-speed-dial>
        
        <md-button class="md-fab md-primary md-mini" style="float: right;" @click="addParameter">
            <md-icon>add</md-icon>
        </md-button>

        <edit-create-processorflow-dialog
            v-if="showAddProcessorDialog"
            :showDialog.sync="showAddProcessorDialog"
            :processorSetting.sync="ProgramJson_temp[newProcessorIndex]"
            @dataReturn="saveProcessor"
            /-->
        
    </div>
</template>

<script>
import { type } from 'os';
import EditCreateProcessorflowDialog from './edit-create-processorflow-dialog'
export default {
    name:'setup-processor-flow',
    props:['ProgramJson'],
    data:()=>({
        ProgramJson_temp:[],
        newProcessorIndex:null,
        showAddProcessorDialog:false,
    }),
    methods:{
        deleteProcessor(index){
            ProgramJson_temp.splice(index,1)
            //delete an element at <index>
        },
        getProcessorFlowSetValidation(){
            return ''
        },
        addParameter(index){
            if(type(index)=='undefined'){
                this.newProcessorIndex = ProgramJson_temp.length;
            }else{
                this.newProcessorIndex = index;
            }
            this.showAddProcessorDialog = true;
        },
        editProcessor(index){
            this.newProcessorIndex = ProgramJson_temp.length;
            this.showAddProcessorDialog = true;
        },
        saveProcessor(p){
            this.ProgramJson_temp.splice(newProcessorIndex,0,p);
            //insert the return vale to varible
        }
    },
    watch:{
        ProgramJson_temp:function(){
            this.$emit('update:ProgramJson',this.ProgramJson_temp)
        }
    },
    mounted:function(){
        this.ProgramJson_temp=this.ProgramJson;
    },
    components:{
        EditCreateProcessorflowDialog
    }
}
</script>

<style>

</style>