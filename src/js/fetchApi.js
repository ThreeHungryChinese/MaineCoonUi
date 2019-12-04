class fetchApi{
    apiAddress = 'https://localhost:44356/';
    fetchApi(addressString){
        this.apiAddress=addressString;
    }
    Get(requestString){
        return fetch(this.apiAddress+requestString,{
            credentials: 'include',
            method:'GET'
        })
    }
    Post(requestString,data){
        return fetch(this.apiAddress+requestString,{
            credentials: 'include',
            method:'POST',
            body:JSON.stringify(data),  
            headers: new Headers({
                'Content-Type': 'application/json'
              })
        })
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
    Delete(requestString,data){
        return fetch(this.apiAddress+requestString,{
            credentials: 'include',
            method:'DELETE',
            body:JSON.stringify(data),  
            headers: new Headers({
                'Content-Type': 'application/json'
              })
        })
    }
}
export{
    fetchApi
}