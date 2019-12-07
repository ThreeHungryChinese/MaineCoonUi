<template>
  <div>
      <md-table>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Parameter Name</md-table-head>
        <md-table-head>Instruction</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Delete</md-table-head>
        <md-table-row v-for="(item,index) in formResult.ProgramParameterJson" v-bind:key="index">
            <md-table-cell md-numeric>{{index}}</md-table-cell>
            <md-table-cell>
                <md-field :class="(isprogramParameterInValid(index,'parameterName'))?'md-invalid':''">
                    <span class="md-error md-gutter" 
                        v-if="isAlgorithmParameterInValid(index,'parameterName')">
                        This field is required.
                    </span>
                    <md-input :name="'parameterName' + index" :id="'parameterName' + index" 
                        v-model="$v.formResult.ProgramParameterJson.$model[index].parameterName" 
                        :disabled="formControl.sending" />
                </md-field>
            </md-table-cell>
            
            <md-table-cell>
                <md-field :class="(isprogramParameterInValid(index,'instruction'))?'md-invalid':''">
                    <span class="md-error md-gutter" 
                        v-if="isprogramParameterInValid(index,'instruction')">
                        This field is required.
                    </span>
                    <md-input :name="'instruction' + index" :id="'instruction' + index" 
                        v-model="$v.formResult.ProgramParameterJson.$model[index].instruction" 
                        :disabled="formControl.sending" />
                </md-field>
            
            </md-table-cell>
            <md-table-cell>
                <md-field>
                    <md-select v-model="$v.formResult.ProgramParameterJson.$model[index].type" :name="'type' + index" :id="'type' + index">
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
    props:['value'],
}
</script>

<style>

</style>