const baseURL = "http://127.0.0.1:5500"


// Autenticação usuário

function loginFireBase(email, senha){
    firebase
    .auth()
    .signInWithEmailAndPassword(email,senha)
    .then(result => {
        alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
        window.location.href = `${baseURL}/Controle-Fatec.html`
    })
    .catch(error => {
        let mensagem = '';
        switch(error.message){
            case 'auth/invalid-email':
                mensagem = 'O E-mail informado é inválido!'
                break;
            case 'auth/email-already-exists':
                mensagem = 'O e-mail informado já está sendo utilizado!'
                break;
            default:
                mensagem = error.message    
        }
        alert(`Erro ao efetuar o login: ${mensagem}`)
    }) 
}

// Cadastrar novo Usuario
function NovoUsuario(email,senha){
    firebase.auth().createUserWithEmailAndPassword(email,senha)
    .then((result)=>{
        alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
        window.location.href = `${baseURL}/Controle-Fatec.html`
    })
    .catch(error => {
        let mensagem = '';
        switch(error.code){
            case 'auth/invalid-email':
                mensagem = 'O E-mail informado é inválido!'
                break;
            case 'auth/email-already-exists':
                mensagem = 'O e-mail informado já está sendo utilizado!'
                break;
            default:
                mensagem = error.message    
        }
        alert(`Não foi possivel cadastrar o usuário: ${mensagem}`)
        console.log(error.message);
    })
}

function logoutFirebase(){
    firebase
    .auth()
    .signOut()
    .then(function() {
      window.location.href = `${baseURL}/Home.html`
    })
    .catch(function(error) {
      alert(`Não foi possível efetuar o logout \n Erro: ${error.message}`)
    });
  }

  /**
 * verificaLogado.
 * Verifica se o usuário deve ter acesso a página que será carregada
 * @return {null} - Caso não esteja logado, redireciona para o início
 */
function verificaLogado(){
    firebase
    .auth()
    .onAuthStateChanged(user => {
      if(user){
        console.log('Usuário logado!')
      } else {
        console.log('Usuário não logado. Redirecionando...')
        window.location.href = `${baseURL}/Home.html`
      }
    })
    }