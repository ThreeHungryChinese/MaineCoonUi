<template>
  <div>
        <md-empty-state
        v-if="projects==null"
        md-icon="devices_other"
        :md-label="'Create your first' + projectTypeName"
        :md-description="'Creating' + projectTypeName + ', you\'ll be able to do something.'">
            <md-button class="md-primary md-raised" @click="$emit('GoCreate')">Create first {{projectTypeName}}</md-button>
        </md-empty-state>
        <div v-if="projects!=null" class="md-alyout md-alignment-top-space-around">
            <md-card class="md-layout-item md-gutter" v-for="project in projects" v-bind:key="project.id">
                <md-card-header>
                    <div class="md-title">{{project.name}}</div>
                    <div class="md-subhead">Has been Called: {{project.count}} times</div>
                </md-card-header>

                <md-card-content>
                    {{project.instruction}}
                </md-card-content>

                <md-card-expand>
                    <md-card-actions md-alignment="space-between">
                        <md-card-expand-trigger>
                            <md-button class="md-icon-button">
                                <md-icon>bar_chart</md-icon>
                            </md-button>
                        </md-card-expand-trigger>
                        <div>
                            <md-button class="md-button md-primary md-raised" 
                                @click="$emit('GoEdit',project.id)">Edit</md-button>
                            <md-button class="md-button md-accent md-raised" 
                                @click="showWarning=true;deleteingPrjoectId=project.id">Delete</md-button>
                        </div>
                    </md-card-actions>
                    <md-card-expand-content>
                        <md-card-content>
                            <bars
                                :data="staticCountTemp"
                                :gradient="['#6fa8dc', '#42b983']"
                                :barWidth="5">
                            </bars>
                        </md-card-content>
                    </md-card-expand-content>
                </md-card-expand>
            </md-card>
            
            <md-card class="md-layout-item md-gutter md-primary">
                <md-card-header>
                    <div class="md-title" style="text-align:center">NEW</div>
                </md-card-header>
                
                <md-card-content>
                    <md-button class="md-button md-raised md-icon-button" style="float:right" @click="$emit('GoCreate')">
                        <md-icon>plus_one</md-icon>
                    </md-button>
                </md-card-content>
            </md-card>
        </div>
        <warning-dialog
            :showDialog.sync="showWarning"
            title="Are you sure to delete it"
            content="This action cannot undo"
            confirmText="Comfirm"
            cancelText="Cancel"
            @onConfirm="$emit('GoDelete',deleteingPrjoectId)"/>
    </div>
</template>

<script>
import WarningDialog from './warning-dialog'
export default {
    name:'list-project-compment',
    props:['projects','projectTypeName'],
    data:()=>({
        showWarning:false,
        staticCountTemp:[],
        deleteingPrjoectId:null
    }),
    created:function(){
        const weekday = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
        var day = new Date();
        for(var i=0 ; i<20 ;i++){
            day.setDate(day.getDate() - 1);
            var temp = {
                value: Math.random(),
                title: weekday[day.getDay()]
            }
            this.staticCountTemp.unshift(temp);
        }
    },
    components:{
        WarningDialog
    }
}
</script>

<style>

</style>