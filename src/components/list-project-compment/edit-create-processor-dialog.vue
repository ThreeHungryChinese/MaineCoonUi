<template>
      <div>
        <md-dialog @md-closed="$emit('unshowDialog')" :md-active.sync="showDialog" style="width: 60vw;">
            <md-dialog-title>New Algorithm</md-dialog-title>
            <md-dialog-content class="md-gutter">
                <md-steppers md-alternative md-linear :md-active-step.sync="formControl.activatedStep" style="max-width:55vw" >
                    <md-step id="first" md-label="Basic Information" :md-done.sync="formControl.stepsReady.first">
                        <md-field v-for="(value, name) in formInfo.generateField" v-bind:key="name" :class="getValidationClass($v.formResult[name])">
                            <label :for="name">{{value.title}}</label>
                            <span class="md-error md-gutter" v-if="!($v.formResult[name].required)">The {{name}} is required.</span>
                            <span class="md-error md-gutter" v-else-if="typeof($v.formResult[name].url)!='undefined'?(!($v.formResult[name].url)):false ">
                                The {{name}} must be an url.
                            </span>
                            <md-input :name="name" :id="name" v-model="$v.formResult[name].$model" :disabled="formControl.sending" />
                            <span class="md-helper-text">{{value.instruction}}</span>
                        </md-field>
                        <md-switch class="md-accent md-gutter" name="isGetResultNeedWaitCallback" id="isGetResultNeedWaitCallback" 
                        v-model="formResult.isGetResultNeedWaitCallback" :disabled="formControl.sending">
                            {{formInfo.isGetResultNeedWaitCallback.instruction}}
                        </md-switch>
                    </md-step>

                    <md-step id="second" md-label="Parameters">
                        <md-table>
                            <md-table-head md-numeric>ID</md-table-head>
                            <md-table-head>Parameter Name</md-table-head>
                            <md-table-head>Instruction</md-table-head>
                            <md-table-head>Type</md-table-head>
                            <md-table-head>Delete</md-table-head>
                            <md-table-row v-for="(item,index) in formResult.algorithmParameterJson" v-bind:key="index">
                                <md-table-cell md-numeric>{{index}}</md-table-cell>
                                <md-table-cell>
                                    <md-field :class="(isAlgorithmParameterInValid(index,'parameterName'))?'md-invalid':''">
                                        <span class="md-error md-gutter" 
                                            v-if="isAlgorithmParameterInValid(index,'parameterName')">
                                            This field is required.
                                        </span>
                                        <md-input :name="'parameterName' + index" :id="'parameterName' + index" 
                                            v-model="$v.formResult.algorithmParameterJson.$model[index].parameterName" 
                                            :disabled="formControl.sending" />
                                    </md-field>
                                </md-table-cell>
                                
                                <md-table-cell>
                                    <md-field :class="(isAlgorithmParameterInValid(index,'instruction'))?'md-invalid':''">
                                        <span class="md-error md-gutter" 
                                            v-if="isAlgorithmParameterInValid(index,'instruction')">
                                            This field is required.
                                        </span>
                                        <md-input :name="'instruction' + index" :id="'instruction' + index" 
                                            v-model="$v.formResult.algorithmParameterJson.$model[index].instruction" 
                                            :disabled="formControl.sending" />
                                    </md-field>
                                
                                </md-table-cell>
                                <md-table-cell>
                                    <md-field>
                                        <md-select v-model="$v.formResult.algorithmParameterJson.$model[index].type" :name="'type' + index" :id="'type' + index">
                                            <md-option value="number">number</md-option>
                                            <md-option value="text">text</md-option>
                                            <md-option value="file">file</md-option>
                                        </md-select>
                                    </md-field>
                                </md-table-cell>
                                <md-table-cell>
                                    <md-button class="md-fab md-primary md-mini" @click="deleteParameter(index)">
                                        <md-icon>clear</md-icon>
                                    </md-button>
                                </md-table-cell>
                            </md-table-row>
                        </md-table>
                        <md-button class="md-fab md-primary md-mini" style="float: right;" @click="addParameter">
                            <md-icon>add</md-icon>
                        </md-button>
                    </md-step>

                    <md-step id="third" md-label="Summary">
                        <md-field>
                            <md-textarea :placeholder="JSON.stringify(formResult)" :disabled="true"></md-textarea>
                        </md-field>
                    </md-step>
                </md-steppers>
            </md-dialog-content>

            <!--<pre>{{this.user}}</pre>-->
            <md-dialog-actions>
            <md-button class="md-raised md-primary floatright" :disabled="$v.$invalid || !$v.$anyDirty || isAlgorithmParameterInValid()" @click="nextStep()">
                {{(formControl.activatedStep=='third')?'Submit':'Continue'}}
            </md-button>
            <md-button class="md-accent" @click="$emit('unshowDialog')">Cancel</md-button>
            </md-dialog-actions>
            <md-progress-bar md-mode="indeterminate" v-if="sending"></md-progress-bar>
        </md-dialog>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { type } from 'os';
const { required,url,requiredIf } = require('vuelidate/lib/validators')
export default {
    name:'edit-create-processor-dialog',
    mixins: [validationMixin],
    props:['id'],
    data:()=>({
        showDialog:true,
        sending:false,
        isEdit:false,
        editingProcessorId:null,
        formControl:{
            sending:false,    
            activatedStep:'first',
            stepNames: ['first','second','third'],
            stepsReady:{
                first: false,
                second: false,
                third: false
            }
        },
        formInfo:{
            generateField:{
                friendlyName:{
                    title:'Name',
                    instruction:'Give a name of your Algorithm'
                },
                instruction:{
                    title:'instruction',
                    instruction:'Give some instuctions to your users'
                },
                trainCallbackURL:{
                    title:'Training callback URL',
                    instruction:'the url to start training your algorithm'
                },
                resetURL:{
                    title:'Reset Algorithm URL',
                    instruction:'the url to reset your Algorithm'
                },
                getResultURL:{
                    title:'Get Result URL',
                    instruction:'the url to get an output from your Algorithm'
                }
            },
            isGetResultNeedWaitCallback:{
                instruction:'Will this algorithm give a result in a callback request rather than in http response?'
            }
        },
        formResult:{
            friendlyName:null,
            instruction:null,
            trainCallbackURL:null,
            resetURL:null,
            getResultURL:null,
            isGetResultNeedWaitCallback:false,
            TLSversion:1,
            algorithmParameterJson:[]
        }
    }),
    validations: {
        formResult: {
            friendlyName: {
                required
            },
            instruction:{
                required
            },
            trainCallbackURL:{
                url,
                required
            },
            resetURL:{
                url,
                required
            },
            getResultURL:{
                url,
                required
            },
            algorithmParameterJson:{
                required:requiredIf(function(){
                    return this.formControl.activatedStep=='second';
                })
            }
        }
    },
    methods: {
        nextStep(){
            this.$v.formResult.$touch();
            if (this.$v.$invalid) return;
            if(this.formControl.stepNames.indexOf(this.formControl.activatedStep)<2){
                this.formControl.stepsReady[this.formControl.activatedStep]=true;
                this.formControl.activatedStep = this.formControl.stepNames[
                    this.formControl.stepNames.indexOf(this.formControl.activatedStep) + 1];
            }
            else{
                this.submit();
            }
        },
        submit(){
            var f = new window.fetchApi.fetchApi();
            if(this.isEdit){
                f.Put('Processors/' + this.id,this.formResult).then(r=>{
                    if(!r.ok){
                        alert("error occured!");
                    }
                    else{
                        this.$emit('actionOk')
                    }
                });
            } else{
                f.Post('Processors/Create',this.formResult).then(r=>{
                    if(!r.ok){
                        alert("error occured!");
                    }
                    else{
                        this.$emit('actionOk')
                    }
                });
            }
        },
        getValidationClass(validation) {
            return {
                'md-invalid': validation.$invalid && validation.$dirty
            }
        },
        addParameter(){
            /*this.formResult.algorithmParameterJson.push({
                parameterName:null,
                instruction:null,
                type:'text'
            });
            */
            this.$v.formResult.algorithmParameterJson.$model.push({
                parameterName:null,
                instruction:null,
                type:'text'
            })

        },
        deleteParameter(index){
            //this.formResult.algorithmParameterJson.splice(index,1);
            this.$v.formResult.algorithmParameterJson.$model.splice(index,1);
        },
        isAlgorithmParameterInValid(index=-1,name=''){
            if(index!=-1){
                if(this.formResult.algorithmParameterJson[index][name]==null)return true;
            }
            else{
                if(this.formControl.activatedStep=='second')
                    for(var itemIndex in this.formResult.algorithmParameterJson)
                        for(var parameterIndex in this.formResult.algorithmParameterJson[itemIndex])
                            if(this.formResult.algorithmParameterJson[itemIndex][parameterIndex]==null) return true;
            }
            return false;
        }
    },
    mounted:function(){
        if(typeof(this.id)!='undefined'&&this.id!=null){
            //this is an edit dialog
            this.isEdit=true;
            var f = new window.fetchApi.fetchApi();
            f.Get('Processors/Details/' + this.id).then(r=>{
                if(!r.ok){
                    alert("error occured!");
                    //console.log('fetch Error!');
                    this.$emit('unShowDialog');
                }
                else{
                    r.json().then(responseBody=>{
                        console.log(responseBody);
                        if(responseBody.length==0){
                            this.$emit('unshowDialog');
                        }
                        for(var key in this.formResult){
                            this.formResult[key] = responseBody[0][key];
                        }
                        this.editingProcessorId = responseBody[0]['id'];
                    })
                }
            });
        }
    }
}
</script>

<style>
.floatright{
    float: right;
}
</style>