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
                <md-field>
                    <md-select v-model="ProgramJson_temp[previousNode.id].parameterValue[index].fromNode">
                        <md-option v-for="(processor,processorIndex) in getNodesBefore(previousNode.id)" :key="processorIndex" :value="processorIndex">
                            {{'[' + processorIndex + ']' + processor.name}}
                        </md-option>
                    </md-select>
                </md-field>
            </md-table-cell>
            <md-table-cell>
                <md-field >
                    <md-select 
                        v-model="ProgramJson_temp[previousNode.id].parameterValue
                        [ProgramJson_temp[previousNode.id].parameterValue[index].fromNode]
                        .resultIndex" 
                        v-if="ProgramJson_temp[previousNode.id].parameterValue[index].fromNode==0">
                        <md-option v-for="(input,inputIndex) in ProgramJson_temp[previousNode.id].algorithmParameterJson" :key="inputIndex" :value="inputIndex">
                            {{'[' + inputIndex + ']' + input.name}}<!--MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM-->
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
            force: 20000,
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
                algorithmParameterJson:null,
            },
            {
                processorId:0,
                name:'Output',
                parameterValue:[{
                    fromNode:0,
                    resultIndex:0
                }],
                algorithmParameterJson:null,
            }
        ],
    }),
    computed:{
        nodes(){
            var _nodes = [];
            for(var parameter of this.ProgramJson_temp.values()){
                _nodes.push({
                    processorId:parameter.processorId,
                    name:parameter.name,
                    _cssClass:(parameter.id==0?'nodePrimary':'nodeError'),
                    _labelClass:(parameter.id==0?'nodePrimary':'nodeError')
                })
            }
            return _nodes;
        },
        links(){
            var _links = [];
            for(var parameterIndex of this.ProgramJson_temp.keys()){
                for(var parameterLinkPair of this.ProgramJson_temp[parameterIndex].parameterValue.values()){
                    if(parameterLinkPair.fromNode!=null&&parameterLinkPair.resultIndex!=null){
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
                    }
                }
            }
            console.log(_links)
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
                        this.previousNode._labelClass=this.isNodeValid(this.previousNode)?'nodeCorrect':'nodeError';
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
                if(node.processorId!=0){
                    this.ProgramJson_temp.splice(node.index,1)
                }
            }

        },
        isNodeValid(node){
            return false;
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
            this.ProgramJson_temp.splice(this.ProgramJson_temp.length-1,0,newProcessor)
        },
        getNodesBefore(index){
            console.log(index)
            return this.nodes.splice().splice(0,index);
        }
    },
    components:{
        D3Network,SelectNewDialog
    },
    mounted:function(){
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