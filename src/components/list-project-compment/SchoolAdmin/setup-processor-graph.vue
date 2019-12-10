<template>
  <div>
    <div class="md-layout md-alignment-center-center">
        <md-toolbar class="md-item md-layout md-alignment-center-center" style="width:50vw">
            <md-button 
                class="md-icon-button md-raised" :class="currentCursorType=='mouse'?'md-dense md-primary':''"
                :md-ripple="false"
                @click="clickToobar('mouse')">
                <md-icon>mouse</md-icon>
            </md-button>
            <md-button 
                class="md-icon-button md-raised" :class="currentCursorType=='delete'?'md-dense md-primary':''"
                :md-ripple="false"
                @click="clickToobar('delete')">
                <md-icon>delete</md-icon>
            </md-button>
            <md-button 
                class="md-icon-button md-raised" :class="currentCursorType=='pin'?'md-dense md-primary':''"
                :md-ripple="false"
                @click="clickToobar('pin')">
                <md-icon>golf_course</md-icon>
            </md-button>
            <md-button 
                class="md-icon-button md-dense md-accent md-raised"
                @click="showSelectNewProcessor=true">
                <md-icon>add</md-icon>
            </md-button>
        </md-toolbar>
    </div>
    <d3-network 
    :net-nodes="nodes" :net-links="links" :options="options" :link-cb="lcb"
    @node-click="clickNode"/>
    
    <svg>
        <defs>
            <marker id="m-end" markerWidth="20" markerHeight="20" refX="9" refY="1" orient="auto" markerUnits="strokeWidth" >
                <path d="M 0 0 L 2.5 1.25 L 0 2.5 z"></path>
            </marker>
            <rect width="3" height="6"></rect>
        </defs>
    </svg>

    <md-table
        v-if="previousNode!=null">
        <md-table-toolbar>
            <h1 class="md-title">Selected algorithm</h1>
        </md-table-toolbar>
        <md-table-head md-numeric>Index</md-table-head>
        <md-table-head>Parameter Name</md-table-head>
        <md-table-head>Instruction</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head v-if="previousNode.id!=0">From Processor[Index]</md-table-head>
        <md-table-head v-if="previousNode.id!=0">From Output</md-table-head>

        <md-table-row v-for="(item,index) in ProgramJson_temp[previousNode.id].algorithmParameterJson" v-bind:key="index">
            <md-table-cell>
                <span>{{index}}</span>
            </md-table-cell>
            <md-table-cell>
                <span>{{item.parameterName}}</span>
            </md-table-cell>
            <md-table-cell>
                <span>{{item.instruction}}</span>
            </md-table-cell>
            <md-table-cell>
                <span>{{item.type}}</span>
            </md-table-cell>
            <md-table-cell>
                <md-field v-if="previousNode.id!=0">
                    <md-select v-model="ProgramJson_temp[previousNode.id].parameterValue[index].fromNode">
                        <md-option v-for="(processor,processorIndex) in getNodesBefore(previousNode.id)" :key="processorIndex" :value="processorIndex">
                            {{'[' + processorIndex + ']' + processor.name}}
                        </md-option>
                    </md-select>
                </md-field>
            </md-table-cell>
            <md-table-cell>
                <md-field v-if="previousNode.id!=0">
                    <md-select 
                        v-model="ProgramJson_temp[previousNode.id].parameterValue
                        [ProgramJson_temp[previousNode.id].parameterValue[index].fromNode]
                        .resultIndex" 
                        v-if="ProgramJson_temp[previousNode.id].parameterValue[index].fromNode==0">
                        <md-option v-for="(input,inputIndex) in ProgramJson_temp[0].algorithmParameterJson" :key="inputIndex" :value="inputIndex">
                            {{'[' + inputIndex + ']' + input.parameterName}}
                        </md-option>
                    </md-select>
                    <md-input v-else-if="ProgramJson_temp[previousNode.id].parameterValue[index].fromNode!=0" v-model="ProgramJson_temp[previousNode.id].parameterValue[index].resultIndex" readonly />
                </md-field>
            </md-table-cell>
        </md-table-row>

        
    </md-table>
    <select-new-dialog
        v-if="showSelectNewProcessor"
        :showDialog.sync="showSelectNewProcessor"
        @onSelected="addNode"/>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network'
import SelectNewDialog from './select-new-dialog'
import { aquamarine } from 'color-name';
export default {
    name:'setup-processor-graph',
    props:['ProgramJson','ProgramParameterJson'],
    data:()=>({
        options:{
            force: 10000,
            nodeSize: 40,
            nodeLabels: true,
            fontSize:14,
            linkWidth:3,
            canvas:false,
            linkLabels:true,
            strLinks:true
        },
        showSelectNewProcessor:false,
        currentCursorType:'mouse',
        previousNode:null,
        ProgramJson_temp:[
            {
                processorId:0,
                name:'User Inputs',
                parameterValue:[],
                algorithmParameterJson:[],
            },
            {
                processorId:0,
                name:'Output',
                parameterValue:[{
                    fromNode:null,
                    resultIndex:0
                }],
                algorithmParameterJson:[{
                    instruction:'Flow Output',
                    parameterName:'Output',
                    type:'number'
                }],
            }
        ],
    }),
    computed:{
        nodes(){
            var _nodes = [];
            /*
            for(var parameter of this.ProgramJson_temp.values()){
                _nodes.push({
                    processorId:parameter.processorId,
                    name:parameter.name,
                    _cssClass:(parameter.processorId==0?'nodePrimary':'nodeError'),
                    _labelClass:(parameter.processorId==0?'nodePrimary':'nodeError')
                })
            }*/
            for(var i=0; i<this.ProgramJson_temp.length;i++){
                var newNode = {
                    processorId:this.ProgramJson_temp[i].processorId,
                    name:this.ProgramJson_temp[i].name,
                    _cssClass:null,
                    _labelClass:null
                }
                newNode._cssClass = newNode.processorId==0?'nodePrimary':(this.isNodeValid(i)?'nodeCorrect':'nodeError')
                newNode._labelClass = newNode._cssClass
                _nodes.push(newNode)
            }
            return _nodes;
        },
        links(){
            var _links = [];
            var existedLinksTo=new Map();
            for(var parameterIndex of this.ProgramJson_temp.keys()){
                existedLinksTo.clear()
                for(var parameterLinkPair of this.ProgramJson_temp[parameterIndex].parameterValue.values()){
                    if(parameterLinkPair.fromNode!=null&&
                        parameterLinkPair.resultIndex!=null&&
                        !existedLinksTo.has(parameterLinkPair.fromNode)){

                        if(parameterLinkPair.fromNode<parameterIndex){
                            _links.push({
                                name:null,
                                sid:parameterLinkPair.fromNode,
                                tid:parameterIndex,
                                _color:'aquamarine'
                            })
                        }
                        else{
                            _links.push({
                                name:'error',
                                sid:parameterLinkPair.fromNode,
                                tid:parameterIndex,
                                _color:'#ff5252'
                            })
                        }
                        existedLinksTo.set(parameterLinkPair.fromNode)
                    }
                }
            }
            return _links;
        }
    },
    methods:{
        lcb (link) {
            link._svgAttrs = { 'marker-end': 'url(#m-end)' }
            return link
        },
        clickToobar(type){
            this.currentCursorType = type;
        },
        clickNode(event,node){
            if(this.currentCursorType=='mouse'){
                if(this.previousNode!=null){
                    if(this.previousNode.processorId!=0){
                        this.previousNode._labelClass=this.isNodeValid(this.previousNode.index)?'nodeCorrect':'nodeError';
                        this.previousNode._cssClass=this.previousNode._labelClass;
                    }
                    else{
                        this.previousNode._labelClass='nodePrimary';
                        this.previousNode._cssClass=this.previousNode._labelClass;
                    }
                }
                node._labelClass='nodeSelected';
                node._cssClass=node._labelClass;
                this.previousNode = node;
            }
            else if(this.currentCursorType=='delete'){
                this.previousNode=null;
                if(node.processorId!=0){
                    for(var i = node.index + 1; i< this.ProgramJson_temp.length; i++){
                        for(var j of this.ProgramJson_temp[i].parameterValue.keys()){
                            if(this.ProgramJson_temp[i].parameterValue[j].fromNode>node.index){
                                //if a Algorithm get input from an Alg whose index bigger than this, minus the source index
                                this.ProgramJson_temp[i].parameterValue[j].fromNode--;
                            }
                            else if(this.ProgramJson_temp[i].parameterValue[j].fromNode==node.index){
                                //if a Algorithm get input from this Alg, delete it
                                this.ProgramJson_temp[i].parameterValue[j].fromNode=null;
                            }
                        }
                    }
                    this.ProgramJson_temp.splice(node.index,1)
                }
            }

        },
        isNodeValid(index){
            for(var parameter of this.ProgramJson_temp[index].parameterValue.values()){
                if(parameter.fromNode==null)return false;
            }
            return true;
        },
        addNode(processor){
            var newProcessor = {
                processorId:processor.id,
                name:processor.name,
                parameterValue:[],
                algorithmParameterJson:processor.algorithmParameterJson
            }
            for(var index of processor.algorithmParameterJson.keys()){
                newProcessor.parameterValue.push({
                    fromNode:null,
                    resultIndex:0
                })
            }
            this.previousNode=null
            this.ProgramJson_temp.splice(this.ProgramJson_temp.length-1,0,newProcessor)
        },
        getNodesBefore(index){
            return this.nodes.slice().splice(0,index);
        }
    },
    watch:{
        ProgramJson_temp:function(){
            this.$emit('update:ProgramJson',this.ProgramJson_temp)
        }
    },
    components:{
        D3Network,SelectNewDialog
    },
    mounted:function(){
        this.$emit('update:ProgramJson',this.ProgramJson_temp)
        this.ProgramJson_temp[0].algorithmParameterJson = this.ProgramParameterJson
        if(this.ProgramJson!=null||this.ProgramJson.length>=2){
            this.ProgramJson_temp=this.ProgramJson;
        }
    },
}
</script>

<style>
.nodePrimary{
    fill:#448aff;
}
.nodeError{
    fill:pink;
    stroke:#ff5252
}
.nodeCorrect{
    fill:aquamarine;
    stroke:green;
}
.nodeSelected{
    fill: orange;
    stroke: darkorange
}
.labels{
    fill:#5f5f5f;
    stroke:#5f5f5f;
    font-weight: 20 !important;
}
#m-end{
    stroke:#5f5f5f;
    fill:transparent
}
path{
    fill: transparent
}
</style>