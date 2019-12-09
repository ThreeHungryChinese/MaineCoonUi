<template>
  <md-dialog @md-closed="$emit('update:showDialog',false)" :md-active.sync="showDialog" style="min-width:60vw">
      <md-dialog-title>Select an algrothim</md-dialog-title>
      <md-dialog-content>
          <md-table v-model="searched" md-sort="name" md-sort-order="asc" @md-selected="onSelect">
            <md-table-toolbar>
                <md-field md-clearable class="md-toolbar-section-end">
                    <md-input placeholder="Search by name..." v-model="searchText" @input="searchOnTable" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state
                md-label="No algrothim found"
                :md-description="'No algrothim found for this' + searchText +' query. Try a different search term'">
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Instruction" md-sort-by="instruction">{{ item.instruction }}</md-table-cell>
                <md-table-cell md-label="Provider" md-sort-by="userName">{{ item.userName }}</md-table-cell>
            </md-table-row>
        </md-table>
      </md-dialog-content>
      <md-dialog-actions>
            <md-button class="md-raised md-primary floatright" :disabled="selectedProcessor==null" @click="save">
                Save
            </md-button>
            <md-button class="md-accent" @click="$emit('update:showDialog',false)">Cancel</md-button>
        </md-dialog-actions>
  </md-dialog>
</template>

<script>

const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.name).includes(toLower(term)))
    }
    return items
}
export default {
    name:'select-new-dialog',
    props:['showDialog'],
    data:()=>({
        searched:[],
        searchText:null,
        selectedProcessor:null,
        processors:[]
    }),
    methods:{
        save(){
            this.$emit('onSelected',this.selectedProcessor);
            this.$emit('update:showDialog',false);
        },
        onSelect(value){
            this.selectedProcessor = value;
        },
        searchOnTable () {
            this.searched = searchByName(this.processors, this.searchText)
        },
        getClass(){
            return 'md-primary'
        }
    },
    mounted() {
        var f = new window.fetchApi.fetchApi();
        f.Get('Processors/').then(r=>{
                if(!r.ok){
                    alert('error!')
                    this.$emit('update:showDialog',false)
                }
                else{
                    r.json().then(body=>{
                        if(body!=null){
                            this.processors = body;
                            this.searched = body;
                        }
                    })
                }
            }
        )
    },
}
</script>

<style>

</style>