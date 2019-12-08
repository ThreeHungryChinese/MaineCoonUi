<template>
    <div class=" md-gutter md-layout md-alignment-center-space-around">
        <md-speed-dial 
            class=" md-layout-item md-gutter"
            v-for="(processor, index) in ProgramJson_temp"
            :class="'md-elevation-' + index + ' ' + getProcessorFlowSetValidation(index)" 
            :key="index" >
            <md-speed-dial-target>
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
    </div>
</template>

<script>
export default {
    name:'setup-processor-flow',
    props:['ProgramJson'],
    data:()=>({
        showDialog:false,
        ProgramJson_temp:[]
    }),
    methods:{
        deleteProcessor(){

        },
        getProcessorFlowSetValidation(){
            
        },
        addParameter(index){

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

    }
}
</script>

<style>

</style>