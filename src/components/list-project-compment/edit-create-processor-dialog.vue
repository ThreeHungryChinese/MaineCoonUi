<template>
      <div>
        <md-dialog @md-closed="$emit('unshowDialog')" :md-active.sync="showDialog" style="width: 60vw;">
            <md-dialog-title>Sign-in</md-dialog-title>
            <md-content class="md-layout md-gutter">
                <md-steppers md-alternative md-linear v-on:md-changed="stepChanged">
                    <md-step id="first" md-label="First Step">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <md-button class="md-raised md-primary floatright" @click="setDone('first', 'second')">Continue</md-button>
                    </md-step>

                    <md-step id="second" md-label="Second Step">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                    </md-step>

                    <md-step id="third" md-label="Third Step">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                    </md-step>
                </md-steppers>
            </md-content>

            <!--<pre>{{this.user}}</pre>-->
            <md-dialog-actions>
            <md-button class="md-primary md-raised" v-show="this.formContron.showSubmitButton" :disabled="sending">Confirm</md-button>
            <md-button class="md-accent" @click="$emit('unshowDialog');clearForm()">Cancel</md-button>
            </md-dialog-actions>
            <md-progress-bar md-mode="indeterminate" v-if="sending"></md-progress-bar>
        </md-dialog>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
const { required,url,requiredIf } = require('vuelidate/lib/validators')
export default {
    name:'edit-create-processor-dialog',
    mixins: [validationMixin],
    props:['showDialog'],
    data:()=>({
        sending:false,
        formContron:{
            sending:false,
            showSubmitButton:false,      
            active: 'first',
            first: false,
            second: false,
            third: false
        }
    }),
    validations: {
        form: {
            friendlyName: {
                required
            },
            Instruction: {
                required:requiredif
            },
            trainCallbackURL:{

            }
        }
    },
    methods: {
       clearForm(){

       } ,
       stepChanged(stepId){
           if(stepId=='third'){
               this.formContron.showSubmitButton=true;
           }
       },
       checkStepOk(oldStep,newStep){

       }
    },
}
</script>

<style>
.floatright{
    float: right;
}
</style>