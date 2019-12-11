<template>
    <div class="md-layout md-alignment-center-center">
        <boot-screen v-if="choosedBootScreen==0">
            <div class="md-layout-item welcomeText">
                <h4>Welcome!</h4>
                <md-button @click="showDialog=true" class="md-raised md-size-60">Click here start</md-button>
            </div>
        </boot-screen>
        <boot-screen-color v-if="choosedBootScreen==1">
            <div class="md-layout-item welcomeText">
                <h4>Welcome!</h4>
                <md-button @click="showDialog=true" class="md-raised md-size-60">Click here start</md-button>
            </div>
        </boot-screen-color>

        <md-dialog @md-closed="$emit('unshowDialog')" v-if="showDialog" :md-active.sync="showDialog" class="md-size-80" >
            <md-dialog-title>Start a new Admission</md-dialog-title>
            <md-dialog-content class="md-gutter">
                <md-steppers md-dynamic-height md-alternative md-linear :md-active-step.sync="formControl.activatedStep" style="max-width:90vw">
                    <md-step id="first" md-label="Basic Information" >
                        <md-empty-state
                            style="top:0"
                            md-icon="send"
                            md-label="Are you ready to start an admission?"
                            md-description="Click the continue button, then let's start!">
                        </md-empty-state>
                    </md-step>

                    <md-step id="second" md-label="Choose a program to apply">
                        <md-table v-model="searched" md-sort="name" md-sort-order="asc" @md-selected="onSelect">
                            <md-table-toolbar>
                                <md-field md-clearable class="md-toolbar-section-end">
                                    <md-input placeholder="Search by name..." v-model="searchText" @input="searchOnTable" />
                                </md-field>
                            </md-table-toolbar>

                            <md-table-empty-state
                                md-label="No program found"
                                :md-description="'No program found for this' + searchText +' query. Try a different search term'">
                            </md-table-empty-state>

                            <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                                <md-table-cell md-label="Instruction" md-sort-by="instruction">{{ item.instruction }}</md-table-cell>
                                <md-table-cell md-label="Provider" md-sort-by="userName">{{ item.userName }}</md-table-cell>
                            </md-table-row>
                        </md-table>
                    </md-step>

                    <md-step id="third" md-label="Input your Information">
                        <md-field v-for="(value, index) in selectedProgramParmeters" v-bind:key="index" 
                        :class="(parameterValue[index]==null || parameterValue[index]=='')?'md-invalid':''">
                            <label :for="'i' + index">{{value.parameterName}}</label>
                            <span class="md-error md-gutter" v-if="(parameterValue[index]==null || parameterValue[index]=='')">
                                The {{value.parameterName}} is required.
                            </span>
                            <md-file 
                                v-if="value.type=='file'" 
                                :name="'i'+ index" :id="'i' + index" 
                                @change="getfile(index,$event)"/>
                            <md-input v-else :name="'i'+ index" :id="'i' + index" v-model="parameterValue[index]" :type="value.type" />
                            <span class="md-helper-text">{{value.instruction}}</span>
                        </md-field>
                    </md-step>
                    
                    <md-step id="forth" md-label="Get your Score!">
                        <md-empty-state
                            style="top:0"
                            :md-icon="sending?'':'send'"
                            :md-label="sending?'':'Your score is :'">
                            <pre>{{result}}</pre>
                            <md-progress-spinner v-if="sending" :md-diameter="200" :md-stroke="20" md-mode="indeterminate"></md-progress-spinner>
                        </md-empty-state>
                    </md-step>
                </md-steppers>
            </md-dialog-content>

            <md-dialog-actions>
            <md-button class="md-raised md-primary floatright" :disabled="!isValid()" @click="nextStep()">
                {{(formControl.activatedStep=='forth')?'Finish':'Continue'}}
            </md-button>
            <md-button v-if="formControl.activatedStep!='forth'" class="md-accent" @click="showDialog=false">Cancel</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
  
</template>

<script>

const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.name).includes(toLower(term)))
    }
    return items
}


import BootScreen from '../../components/boot-screen'
import BootScreenColor from '../../components/boot-screen-color'
import { send } from 'q'
export default {
    name:'student',
    props:['user'],
    data:()=>({
        showDialog:false,
        sending:false,
        searched:[],
        searchText:null,
        getedPrograms:[],
        selectedProgram:null,
        selectedProgramParmeters:[],
        parameterValue:[],
        result:null,
        formControl:{
            activatedStep:'first',
            stepNames: ['first','second','third','forth'],
        },
    }),
    methods:{
        nextStep(){
            if(this.formControl.activatedStep=='second'){
                this.getSelectedPsParameter();
            }
            if(this.formControl.activatedStep=='third'){
                this.submit();
            }
            if(this.formControl.stepNames.indexOf(this.formControl.activatedStep)<3){
                this.formControl.activatedStep = this.formControl.stepNames[
                    this.formControl.stepNames.indexOf(this.formControl.activatedStep) + 1];
            }
            else{
                this.showDialog=false
            }
        },
        isValid(){
            if(this.formControl.activatedStep=='second' && this.selectedProgram == null) return false;
            if(this.formControl.activatedStep=='third'){
                if(this.parameterValue.length==0)return false
                for(item in this.parameterValue.values())
                    if(item==null || item == '')return false
            }
            return true
        },
        onSelect(value){
            this.selectedProgram = value;
        },
        searchOnTable () {
            this.searched = searchByName(this.getedPrograms, this.searchText)
        },
        getClass(){
            return 'md-primary'
        },
        getSelectedPsParameter(){
            if(this.selectedProgram==null){
                this.selectedProgramParmeters = []
            }
            else{
                var f = new window.fetchApi.fetchApi();
                f.Get('UniversityPrograms/' + this.selectedProgram.id).then(r=>{
                        if(!r.ok){
                            alert('error!')
                            this.$emit('update:showDialog',false)
                        }
                        else{
                            r.json().then(body=>{
                                if(body!=null){
                                    this.selectedProgramParmeters = body
                                }
                            })
                        }
                    }
                )
                this.parameterValue.length = this.selectedProgramParmeters.length
            }
        },
        getfile(index,e){
            var files = e.target.files || e.dataTransfer.files;
            if (files.length){
                var fileReader = new FileReader()
                fileReader.readAsBinaryString(files[0])
                fileReader.onload = (e) => {
                    console.log(e)
                    this.parameterValue[index] = btoa(e.target.result);
                };
            }
        },
        submit(){
            this.sending=true;
            var f = new window.fetchApi.fetchApi()
            var studentInfo = {
                programId : this.selectedProgram.id,
                value : this.parameterValue
            }
            f.Post('Quests/',studentInfo).then(r=>{
                    if(!r.ok){
                        alert('error!')
                        this.$emit('update:showDialog',false)
                    }
                    else{
                        r.json().then(body=>{
                            if(body!=null){
                                this.result = body
                            }
                        })
                    }
                }
            )
            this.sending=false
        }
    },
    computed:{
        choosedBootScreen(){
            return Math.floor(Math.random() * Math.floor(2));
        }
    },
    mounted() {
        var f = new window.fetchApi.fetchApi();
        f.Get('UniversityPrograms/').then(r=>{
                if(!r.ok){
                    alert('error!')
                    this.$emit('update:showDialog',false)
                }
                else{
                    r.json().then(body=>{
                        if(body!=null){
                            this.getedPrograms = body;
                            this.searched = body;
                        }
                    })
                }
            }
        )
    },
    components:{
        BootScreen,
        BootScreenColor
    }
}
</script>

<style>
.welcomeText{
    top:30%;
    position:relative;
    text-align: center;
    font-weight: 300;
    color: #fff;
    font-size: 10vmax
}
</style>