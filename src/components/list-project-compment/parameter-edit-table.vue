<template>
  <div>
      <md-table>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Parameter Name</md-table-head>
        <md-table-head>Instruction</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Delete</md-table-head>
        <md-table-row v-for="(item,index) in parameters" v-bind:key="index">
            <md-table-cell md-numeric>{{index}}</md-table-cell>
            <md-table-cell>
                <md-field :class="(isParameterInValid(index,'parameterName'))?'md-invalid':''">
                    <span class="md-error md-gutter" 
                        v-if="isParameterInValid(index,'parameterName')">
                        This field is required.
                    </span>
                    <md-input :name="'parameterName' + index" :id="'parameterName' + index" 
                        v-model="parameters[index].parameterName" 
                        :disabled="sending" />
                </md-field>
            </md-table-cell>
            
            <md-table-cell>
                <md-field :class="(isParameterInValid(index,'instruction'))?'md-invalid':''">
                    <span class="md-error md-gutter" 
                        v-if="isParameterInValid(index,'instruction')">
                        This field is required.
                    </span>
                    <md-input :name="'instruction' + index" :id="'instruction' + index" 
                        v-model="parameters[index].instruction" 
                        :disabled="sending" />
                </md-field>
            
            </md-table-cell>
            <md-table-cell>
                <md-field>
                    <md-select v-model="parameters[index].type" :name="'type' + index" :id="'type' + index">
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
  </div>
</template>

<script>
export default {
    name:'parameter-edit-table',
    props:['parameters','sending'],
    watch:{
        parameters:function(){
            this.$emit('update:parameters',this.parameters);
        }
    },
    methods: {
        addParameter(){
            /*this.formResult.algorithmParameterJson.push({
                parameterName:null,
                instruction:null,
                type:'text'
            });
            */
            this.parameters.push({
                parameterName:null,
                instruction:null,
                type:'text'
            })

        },
        deleteParameter(index){
            //this.formResult.algorithmParameterJson.splice(index,1);
            this.parameters.splice(index,1);
        },
        isParameterInValid(index=-1,name=''){
            try{
                if(this.parameters[index][name]=="" ||
                    this.parameters[index][name]==null)return true;
            }
            catch{
                return true;
            }
            return false;
        }
    },
}
</script>

<style>

</style>