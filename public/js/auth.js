const miFormulario = document.querySelector('form')

const url = (window.location.hostname.includes('localhost')) 
? 'http://localhost:8080/api/auth/' 
: 'https://restservidornode.herokuapp.com/api/auth/google';


miFormulario.addEventListener('submit', ev =>{
    ev.preventDefault();

    const formData = {}

    for(let el of miFormulario.elements){
        if(el.name.length > 0){
            formData[el.name] = el.value;
        }
    }
    
    fetch( url + 'login',{
        method: 'POST',
        body:JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response =>response.json())
    .then(({msg,token}) =>{
        if(msg){
            return console.error(msg)
        }
        localStorage.setItem('token',token)
        window.location = 'chat.html'
    })
    .catch(console.warn)
})


function handleCredentialResponse(response) {
    //GOOGLE TOKEN: ID_TOKEN
   const token = { id_token: response.credential};
    //Es como hacer un metodo http post en angular
   fetch('https://restservidornode.herokuapp.com/api/auth/google',{
       method:'POST',
       headers:{
           'Content-Type':'application/json'
        },
        body: JSON.stringify(token)
    })
    .then(response=>response.json())
/*     .then(response=>{
        console.log(response);
    }) */
    .then( ({token}) =>{
        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch(console.warn)
}
//Funcion para cerra la sesion
const button = document.getElementById('google_signout');
button.onclick = ()=>{
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'),done=>{
        localStorage.clear();
        location.reload();
    })
}