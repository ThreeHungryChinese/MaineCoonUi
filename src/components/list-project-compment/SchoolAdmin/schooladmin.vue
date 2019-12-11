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
        <list-project-compment
            :projects="programs"
            projectTypeName="Program"
            @GoCreate="showCreateProgramDialog=true"
            @GoDelete="deleteProgram"
            @GoEdit="edit"
        />
        <edit-create-program-dialog 
            v-if="showCreateProgramDialog" 
            @unshowDialog="showCreateProgramDialog=false" 
            v-on:actionOk="refreshContent();
            $emit('notification','Your algorithm is saved.')"
            @actionOk="refreshContent" />
        <edit-create-program-dialog 
            v-if="showEditProgramDialog" 
            @unshowDialog="showEditProgramDialog=false" 
            v-on:actionOk="refreshContent();
            $emit('notification','Your algorithm is saved.')"
            :id="editProgramId" />
    </div>
</template>

<script>
import SetupProcessorGraph from './setup-processor-graph'
import EditCreateProgramDialog from './edit-create-program-dialog'
import ListProjectCompment from '../list-project-compment'
export default {
    name:'schooladmin',
    props:['user'],
    data:()=>({
        programs:null,
        staticCountTemp:[],
        showCreateProgramDialog:false,
        showEditProgramDialog:false,
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
       edit(id){
           this.editProgramId=id;
           this.showEditProgramDialog=true;
       },
       deleteProgram(deletingProgramId){
           var f = new window.fetchApi.fetchApi();
           var response = f.Delete('UniversityPrograms/'+deletingProgramId);
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
        EditCreateProgramDialog,
        ListProjectCompment,
        ////---temp
        SetupProcessorGraph
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