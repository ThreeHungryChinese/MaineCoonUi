class fetchApi{
    apiAddress = 'https://localhost:44356/';
    fetchApi(){
    }
    fetchApi(addressString){
        this.apiAddress=addressString;
    }
    Get(requestString){
        requestString = String(requestString);
        fetch(apiAddress+requestString,{
            credentials: 'include',
            method:'GET'
        })
        .then(function(response){
            return response;
        })
    }
    post(){

    }
    Put(requestString,data){
        return fetch(this.apiAddress+requestString,{
            credentials: 'include',
            method:'PUT',
            body:JSON.stringify(data),  
            headers: new Headers({
                'Content-Type': 'application/json'
              })
        })
    }
}