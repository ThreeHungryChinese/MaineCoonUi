<template>
    <div>
        <md-empty-state
        v-if="projects==null"
        md-icon="devices_other"
        md-label="Create your first project"
        md-description="Creating project, you'll be able to do something.">
            <md-button class="md-primary md-raised" >Create first project</md-button>
        </md-empty-state>
        <div v-if="projects!=null" class="md-alyout md-alignment-top-space-around">
            <md-card class="md-layout-item md-gutter" v-for="project in projects" v-bind:key="project.Id">
                <md-card-header>
                    <div class="md-title">{{project.friendlyName}}</div>
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
                            <md-button class="md-button md-primary md-raised" @click="editProcessor(project.Id)">Edit</md-button>
                            <md-button class="md-button md-accent md-raised">Delete</md-button>
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
                    <md-button class="md-button md-raised md-icon-button" style="float:right" @click="showCreateProcessorDialog=true">
                        <md-icon>plus_one</md-icon>
                    </md-button>
                </md-card-content>
            </md-card>
        </div>
        <edit-create-processor-dialog v-if="showCreateProcessorDialog" v-on:unshowDialog="showCreateProcessorDialog=false" ></edit-create-processor-dialog>
        <edit-create-processor-dialog v-if="showEditProcessorDialog" v-on:unshowDialog="showEditProcessorDialog=false" :id="editProcessorId"></edit-create-processor-dialog>
    </div>
</template>

<script>
import EditCreateProcessorDialog from './edit-create-processor-dialog'
export default {
    name:'list-project-compment',
    props:['user'],
    data:()=>({
        projects:null,
        staticCountTemp:[],
        showCreateProcessorDialog:false,
        showEditProcessorDialog:false,
        editProcessorId:null
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
        this.getUsersProjects(this.user);
    },
    methods: {
       getUsersProjects(user){
           if(user.isLoged){
                var f = new window.fetchApi.fetchApi();
                var getTarget = (user.sysRole == 'Developer'? 'Processors/Users/' : 'UniversityPrograms/Users/');
                var response = f.Get(getTarget + user.userId);
                response.then(r =>{
                    if(r.status==200){
                        r.json().then(body=>{
                            this.projects=body;
                        });
                    }
                });
           }
       },
       editProcessor(id){
           this.editProcessorId=id;
           this.showEditProcessorDialog=true;
       }
    },
    components:{
        EditCreateProcessorDialog
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