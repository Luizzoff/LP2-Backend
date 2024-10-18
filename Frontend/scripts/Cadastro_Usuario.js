const formUsuario = document.getElementById('formUsuario');
window.onload = exibirUsuarios;
var modo = 'gravar'

formUsuario.onsubmit = (evento) => {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const senhaConfirmacaoInput = document.getElementById('senha_confirmacao');
    const perfilInput = document.getElementById('perfil');

    const nome = nomeInput.value;
    const email = emailInput.value;
    const senha = senhaInput.value;
    const senha_confirmacao = senhaConfirmacaoInput.value;
    const perfil = perfilInput.value;


    if (!validarUsuario(nome) &&
        validarEmail(email) &&
        !vazioSenha(senha) &&
        !vazioSenhaConfirmacao(senha_confirmacao) &&
        !validarSenha(senha,senha_confirmacao) &&
        !validarPerfil(perfil))
    {
        if(modo === 'gravar') {
            fetch('http://localhost:3000/usuarios', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "nome":nome,
                    "email":email,
                    "senha":senha,
                    "senha_confirmacao":senha_confirmacao,
                    "perfil":perfil
                })
            })
            .then((res) => { return res.json(); })
            .then((resJSON) => {
                if(resJSON.status){
                    alert(resJSON.mensagem);
                    formUsuario.reset();
                    exibirUsuarios();
                }
                else {
                    alert(resJSON.mensagem);
                }
            })
            .catch((erro) =>{
                alert('Erro ao incluir o usuario: ' + erro.message);
            })
        }
        else {
            fetch('http://localhost:3000/usuarios/' + email, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "nome":nome,
                    "email":email,
                    "senha":senha,
                    "senha_confirmacao":senha_confirmacao,
                    "perfil":perfil
                })
            })
            .then((res) => { return res.json(); })
            .then((resJSON) => {
                if(resJSON.status){
                    alert(resJSON.mensagem);
                    const botao = document.getElementById('botao');
                    botao.classList.remove('btn-warning');
                    botao.classList.add('btn-success');
                    botao.innerText = 'Confirmar';
                    modo = 'gravar';
                    const input = document.getElementById('email');
                    input.disabled = false;
                    formUsuario.reset();
                    exibirUsuarios();
                }
                else {
                    alert(resJSON.mensagem);
                }
            })
            .catch((erro) =>{
                alert('Erro ao atualizar o usuario: ' + erro.message);
            })
        }
        limparClassesValidacao();
    }
    else{
        //nome
        if (validarUsuario(nome)) {
            nomeInput.classList.remove('is-valid');
            nomeInput.classList.add('is-invalid');
        }
        else{
            nomeInput.classList.remove('is-invalid');
            nomeInput.classList.add('is-valid');
        }
        
        //email
        if (!validarEmail(email)) {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
        }
        else{
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }
        
        //senha
        if(!vazioSenha(senha) && !vazioSenhaConfirmacao(senha_confirmacao)){
            if (validarSenha(senha,senha_confirmacao)) {
                senhaInput.classList.remove('is-valid');
                senhaInput.classList.add('is-invalid');
                senhaConfirmacaoInput.classList.remove('is-valid');
                senhaConfirmacaoInput.classList.add('is-invalid');
                alert("Senhas não coincidem")
            }
            else{
                senhaInput.classList.remove('is-invalid');
                senhaInput.classList.add('is-valid');
                senhaConfirmacaoInput.classList.remove('is-invalid');
                senhaConfirmacaoInput.classList.add('is-valid');
            }
        }
        else{
            if(vazioSenha(senha)){
                senhaInput.classList.remove('is-valid');
                senhaInput.classList.add('is-invalid');
            }
            if(vazioSenhaConfirmacao(senha_confirmacao)){
                senhaConfirmacaoInput.classList.remove('is-valid');
                senhaConfirmacaoInput.classList.add('is-invalid');
            }
        }
        
        //perfil
        if (validarPerfil(perfil)) {
            perfilInput.classList.remove('is-valid');
            perfilInput.classList.add('is-invalid');
        }
        else{
            perfilInput.classList.remove('is-invalid');
            perfilInput.classList.add('is-valid');
        }
    }

    evento.stopPropagation();
    evento.preventDefault();
};
email.addEventListener('input', function() {
    const email = this.value;
    if (!validarEmail(email)) {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
    }
});
function limparClassesValidacao() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });

    const select = document.querySelector('select');
    select.classList.remove('is-invalid', 'is-valid');    
}

//===========================================================================//

function excluir(email) {
    if (confirm("Deseja realmente excluir?")){
        fetch('http://localhost:3000/usuarios/' + email, {
            method:"DELETE"
        })
        .then((res) => { return res.json(); })
        .then((resJSON) => {
            if(resJSON.status) {
                alert(resJSON.mensagem);// ta vindo do controle a resposta
                exibirUsuarios();
            }
            else {
                alert("Erro ao excluir: " + resJSON.mensagem);
            }
        })
        .catch((erro) => {
            alert("Erro no banco de dados: " + erro.message);
        })
    }
}
function exibirUsuarios(){
    const divTabela = document.getElementById('tabela');    
    divTabela.innerHTML = '';

    fetch('http://localhost:3000/usuarios', {
        method:"GET"
    })
    .then((res) => { return res.json(); })
    .then((listaUsuarios) => {
        if(listaUsuarios.length > 0){
            divTabela.classList.remove('w-25');
            divTabela.classList.remove('fw-bold');
            divTabela.classList.add('w-75');
            
            const tabela = document.createElement('table');
            tabela.className = 'table table-striped table-hover text-center';

            const cabecalho = document.createElement('thead');
            cabecalho.innerHTML=`
            <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Senha</th>
                <th>Perfil</th>
                <th>####</th>
            </tr>`;

            const corpo = document.createElement('tbody');
            for (let i = 0; i < listaUsuarios.length; i++){
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${listaUsuarios[i].nome}</td>
                    <td>${listaUsuarios[i].email}</td>
                    <td>${listaUsuarios[i].senha}</td>
                    <td>${listaUsuarios[i].perfil}</td>
                    <td>
                        <button type='button' class='btn btn-danger' onclick='excluir("${listaUsuarios[i].email}")'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                        <button type='button' class='btn btn-warning' onclick='devolverHtml("${listaUsuarios[i].nome}",
                                                                                            "${listaUsuarios[i].email}",
                                                                                            "${listaUsuarios[i].senha}",
                                                                                            "${listaUsuarios[i].senha_confirmacao}",
                                                                                            "${listaUsuarios[i].perfil}")'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                        </button>
                    </td>
                `;
                corpo.appendChild(tr);
            }
            tabela.appendChild(cabecalho);
            tabela.appendChild(corpo);
            divTabela.appendChild(tabela);
        }
        else{
            divTabela.classList.remove('w-75');
            divTabela.classList.add('w-25');
            divTabela.classList.add('fw-bold');
            const alertaMensagem = document.createElement('p');
            alertaMensagem.innerText = "Não Há Usuários Cadastrados!";
            divTabela.appendChild(alertaMensagem);
        }
    })
    .catch((erro) => {
        divTabela.classList.remove('w-75');
        divTabela.classList.add('w-25');
        divTabela.classList.add('fw-bold');
        const alertaMensagem = document.createElement('p');
        alertaMensagem.innerText = "Não foi possivel recuperar os usuarios!";
        divTabela.appendChild(alertaMensagem);
        alert("Erro no banco de dados: " + erro.message);
    })
}
function devolverHtml(nome, email, senha, senha_confirmacao, perfil) {
    limparClassesValidacao();
    const botao = document.getElementById('botao');
    botao.classList.remove('btn-success');
    botao.classList.add('btn-warning');
    botao.innerText = 'Atualizar';
    modo = 'atualizar';

    const input = document.getElementById('email');
    input.value = email;
    input.disabled = true;
    document.getElementById('nome').value = nome;
    document.getElementById('senha').value = senha;
    document.getElementById('senha_confirmacao').value = senha_confirmacao;
    document.getElementById('perfil').value = perfil;
}

//===========================================================================//

//########## ALERTAS ##########//
function validarUsuario(nome){
    if (nome === "") {
        return true;
    } else {
        return false;
    }
}
function validarEmail(email){
    const regex = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com|outlook\.com)$/;
    return regex.test(email);
}
function validarSenha(senha,senha_confirmacao){
    if (senha !== senha_confirmacao) {
        return true;
    } else {
        return false;
    }
}
function vazioSenha(senha){
    if(senha === ""){
        return true;
    }
    else{
        return false;
    }
}
function vazioSenhaConfirmacao(senha_confirmacao){
    if(senha_confirmacao === ""){
        return true;
    }
    else{
        return false;
    }
}   
function validarPerfil(perfil){
    if (perfil === "") {
        return true;
    } else {
        return false;
    }   
}