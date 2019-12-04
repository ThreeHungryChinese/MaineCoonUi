<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>{{title}}</md-dialog-title>
        <md-dialog-content>
            <span>{{content}}</span>
        </md-dialog-content>
        <md-dialog-actions>
        <md-button class="md-button md-accent" @click="$emit('onConfirm');$emit('update:showDialog',false)">{{confirmText}}</md-button>
        <md-button class="md-button md-primary" @click="$emit('onCancel');$emit('update:showDialog',false)">{{cancelText}}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
export default {
    name:'warning-dialog',
    props:['title','content','confirmText','cancelText','showDialog']
};
</script>

<style>
</style>