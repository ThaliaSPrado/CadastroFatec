function salvar(event, collection) {
    event.preventDefault() 
    
    if (document.getElementById('nome').value === '') { alert('⚠ É obrigatório informar o nome!') }
    else if (document.getElementById('sobrenome').value === '') { alert('⚠ É obrigatório informar o sobrenome!') }
    else if (document.getElementById('email').value === '') { alert('⚠ É obrigatório informar o email!') }
    else if (document.getElementById('dataNascimento').value === '') { alert('⚠ É obrigatório informar a data de nascimento!') }
    else if (document.getElementById('id').value !== '') { alterar(event, collection) }
    else { incluir(event, collection) }
}

function incluir(event, collection) {
    event.preventDefault()
    const form = document.forms[0]
    const data = new FormData(form)
    const values = Object.fromEntries(data.entries())
    return firebase.database().ref(collection).push(values)
        .then(() => {
            alert('✔ Registro cadastrado com sucesso!')
            document.getElementById('formCadastro').reset() //limpar o formulário
        })
        .catch(error => {
            console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
            alert(`❌ Falha ao incluir: ${error.message}`)
        })
}

function obtemDados(collection) {
    var tabela = document.getElementById('tabelaCadastro')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'table-warning'
        cabecalho.insertCell().textContent = 'Nome'
        cabecalho.insertCell().textContent = 'Sobrenome'
        cabecalho.insertCell().textContent = 'Email'
        cabecalho.insertCell().textContent = 'Data de Nascimento'
        cabecalho.insertCell().textContent = 'Genero'
        cabecalho.insertCell().textContent = 'Curso'
        cabecalho.insertCell().textContent = 'Opções'

        snapshot.forEach(item => {
            //Dados do Firebase
            let db = item.ref.path.pieces_[0] //collection
            let id = item.ref.path.pieces_[1] //id
            let registro = JSON.parse(JSON.stringify(item.val()))
            //Criando as novas linhas na tabela
            let novalinha = tabela.insertRow()
            novalinha.insertCell().textContent = item.val().nome
            novalinha.insertCell().textContent = item.val().sobrenome
            novalinha.insertCell().textContent = item.val().email
            novalinha.insertCell().textContent = item.val().dataNascimento
            novalinha.insertCell().textContent = item.val().genero
            novalinha.insertCell().textContent = item.val().Cursos
            novalinha.insertCell().innerHTML =
                `
            <button class ='btn btn-danger' title='Remove o registro corrente' onclick=remover('${db}','${id}')>🗑 Excluir </button>
            <button class ='btn btn-warning' title='Edita o registro corrente' onclick=carregaDadosAlteracao('${db}','${id}')>✏ Editar </button>
            `
        })
        
        let rodape = tabela.insertRow()
        rodape.className = 'table-warning'
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
    })
}

function totalRegistros(collection) {
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() === 0) {
            retorno = '‼ Ainda não há nenhum aluno cadastrado!'
        } else {
            retorno = `Total de Registros: ${snapshot.numChildren()}`
        }
    })
    return retorno
}

function remover(db, id) {
    
    if (window.confirm('Excluir Cadastro?')) {
        let dadoExclusao = firebase.database().ref().child(db + '/' + id)
        dadoExclusao.remove()
            .then(() => {
                alert('✅Cadastro removido com sucesso!')
            })
            .catch(error => {
                alert('❌Falha ao excluir: ' + error.message)
            })
    }
}

function carregaDadosAlteracao(db, id) {
    firebase.database().ref(db).on('value', (snapshot) => {
        snapshot.forEach(item => {
            if (item.ref.path.pieces_[1] === id) {
                document.getElementById('id').value = item.ref.path.pieces_[1]
                document.getElementById('nome').value = item.val().nome
                document.getElementById('sobrenome').value = item.val().sobrenome
                document.getElementById('email').value = item.val().email
                document.getElementById('dataNascimento').value = item.val().dataNascimento
                
                if(item.val().Cursos ==='GTI'){
                    document.getElementById('GTI').checked = true
                }
                else if(item.val().Cursos ==='ADS'){
                    document.getElementById('ADS').checked = true
                }
                else if(item.val().Cursos ==='GE'){
                    document.getElementById('GE').checked = true
                }
                else if(item.val().Cursos ==='Eventos'){
                    document.getElementById('Eventos').checked = true
                }
                else
                {
                    document.getElementById('Mecatronica').checked = true
                }
               
                if (item.val().genero === 'Masculino') {
                    document.getElementById('Masculino').checked = true
                } else {
                    document.getElementById('Feminino').checked = true
                }
                
                
          
            }
        })
    })
}

function alterar(event, collection) {
    event.preventDefault()
    
    const form = document.forms[0];
    const data = new FormData(form);
    
    const values = Object.fromEntries(data.entries());
    console.log(values)
    
    return firebase.database().ref().child(collection + '/' + values.id).update({
      nome: values.nome,
      sobrenome: values.sobrenome,
      email: values.email,
      genero: values.genero,
      nascimento: values.dataNascimento,
      Cursos: values.Cursos
    })
      .then(() => {
        alert('✅ Registro alterado com sucesso!')
        document.getElementById('formCadastro').reset()
      })
      .catch(error => {
        console.log(error.code)
        console.log(error.message)
        alert('❌ Falha ao alterar: ' + error.message)
      })
  }