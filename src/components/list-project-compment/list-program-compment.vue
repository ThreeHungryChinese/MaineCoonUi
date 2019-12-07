<template>
    <div>
        <md-empty-state
        v-if="programs==null"
        description="program"
        md-icon="devices_other"
        md-label="Create your first program"
        md-description="Creating program, you'll be able to do something.">
            <md-button class="md-primary md-raised" @click="showCreateProgramDialog=true">Create first program</md-button>
        </md-empty-state>
        <div v-if="programs!=null" class="md-alyout md-alignment-top-space-around">
            <md-card class="md-layout-item md-gutter" v-for="program in programs" v-bind:key="program.Id">
                <md-card-header>
                    <div class="md-title">{{program.ProgramName}}</div>
                    <div class="md-subhead">Has been Called: {{program.Count}} times</div>
                </md-card-header>

                <md-card-content>
                    {{program.ProgramIntroduction}}
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
                                @click="editProgram(program.Id)">Edit</md-button>
                            <md-button class="md-button md-accent md-raised" 
                                @click="deletingProgramId=program.Id;showWarningDialog=true;">Delete</md-button>
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
                    <md-button class="md-button md-raised md-icon-button" style="float:right" @click="showCreateProgramDialog=true">
                        <md-icon>plus_one</md-icon>
                    </md-button>
                </md-card-content>
            </md-card>
        </div>
        <edit-create-program-dialog 
            v-if="showCreateProgramDialog" 
            v-on:unshowDialog="showCreateProgramDialog=false" 
            v-on:actionOk="refreshContent" />
        <edit-create-program-dialog 
            v-if="showEditProgramDialog" 
            v-on:unshowDialog="showEditProgramDialog=false" 
            v-on:actionOk="refreshContent();
            this.$emit('notification','Your program is saved.')"
            :id="editProgramId" />
        <warning-dialog
            :showDialog.sync="showWarningDialog"
            title="Are you sure to delete it"
            content="This action cannot undo"
            confirmText="Comfirm"
            cancelText="Cancel"
            @onConfirm="deleteProgram"/>
    </div>
</template>

<script>
import EditCreateProgramDialog from './edit-create-program-dialog'
import WarningDialog from './warning-dialog'
export default {
    name:'list-program-compment',
    props:['user'],
    data:()=>({
        programs:null,
        staticCountTemp:[],
        showCreateProgramDialog:false,
        showEditProgramDialog:false,
        showWarningDialog:false,
        editProgramId:null,
        deletingProgramId:null
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
        this.getUsersprograms(this.user);
    },
    methods: {
       getUsersprograms(user){
           if(user.isLoged){
                var f = new window.fetchApi.fetchApi();
                var getTarget = 'UniversityPrograms/Users/';
                var response = f.Get(getTarget + user.userId);
                response.then(r =>{
                    if(r.status==200){
                        r.json().then(body=>{
                            this.programs=body;
                        });
                    }
                });
           }
       },
       editProgram(id){
           this.editProgramId=id;
           this.showEditProgramDialog=true;
       },
       deleteProgram(){
           var f = new window.fetchApi.fetchApi();
           var response = f.Delete('UniversityPrograms/'+this.deletingProgramId);
                response.then(r =>{
                    if(r.status==200){
                        this.$emit('notification',"Your program is deleted");
                        this.refreshContent();
                    }
                });
       },
       refreshContent(){
           this.getUsersprograms(this.user);
           this.showCreateProgramDialog=false;
           this.showEditProgramDialog=false;
       }
    },
    components:{
        EditCreateProgramDialog,WarningDialog
    }
}
</script>

<style>
  .md-card {
    width: 22vw;
    margin: 1vh;
    display: inline-block;
    vertical-align: top;
    min-height: 15vh;
  }
  .md-empty-state{
      top:30vh;
      position: relative;
  }
</style>