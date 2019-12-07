<template>
    <div>
        <list-project-compment
            :projects="processors"
            projectTypeName="Algorithm"
            @GoCreate="showCreateProcessorDialog=true"
            @GoDelete="deleteProcessor"
            @GoEdit="editProcessor"
        />
        <edit-create-processor-dialog 
            v-if="showCreateProcessorDialog" 
            v-on:unshowDialog="showCreateProcessorDialog=false" 
            v-on:actionOk="refreshContent" />
        <edit-create-processor-dialog 
            v-if="showEditProcessorDialog" 
            v-on:unshowDialog="showEditProcessorDialog=false" 
            v-on:actionOk="refreshContent();
            this.$emit('notification','Your algorithm is saved.')"
            :id="editProcessorId" />
    </div>
</template>

<script>
import EditCreateProcessorDialog from './edit-create-processor-dialog'
import ListProjectCompment from './list-project-compment'
export default {
    name:'list-processor-compment',
    props:['user'],
    data:()=>({
        processors:null,
        showCreateProcessorDialog:false,
        showEditProcessorDialog:false,
        editProcessorId:null,
    }),
    mounted:function(){
        this.getUsersprocessors(this.user);
    },
    methods: {
       getUsersprocessors(user){
           if(user.isLoged){
                var f = new window.fetchApi.fetchApi();
                var getTarget = 'Processors/Users/';
                var response = f.Get(getTarget + user.userId);
                response.then(r =>{
                    if(r.status==200){
                        r.json().then(body=>{
                            this.processors=body;
                        });
                    }
                });
           }
       },
       editProcessor(id){
           this.editProcessorId=id;
           this.showEditProcessorDialog=true;
       },
       deleteProcessor(id){
           var f = new window.fetchApi.fetchApi();
           var response = f.Delete('Processors/'+id);
                response.then(r =>{
                    if(r.status==200){
                        this.$emit('notification',"Your algorithm is deleted");
                        this.refreshContent();
                    }
                });
       },
       refreshContent(){
           this.getUsersprocessors(this.user);
           this.showCreateProcessorDialog=false;
           this.showEditProcessorDialog=false;
       }
    },
    components:{
        EditCreateProcessorDialog,ListProjectCompment
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