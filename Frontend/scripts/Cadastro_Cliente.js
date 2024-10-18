const formCliente = document.getElementById('formCliente');
window.onload = exibirClientes;
var modo = 'gravar'

formCliente.onsubmit = (evento) => {
    const nomeInput = document.getElementById("nome");
    const cpfInput = document.getElementById("cpf");
    const generoInput = document.getElementById("genero");
    const dataNascimentoInput = document.getElementById("dataNascimento");
    const telefoneInput = document.getElementById("telefone");
    const emailInput = document.getElementById("email");
    const enderecoInput = document.getElementById("endereco");

    const nome = nomeInput.value;
    const cpf = cpfInput.value;
    const genero = generoInput.value;
    const dataNascimento = new Date(dataNascimentoInput.value).toLocaleDateString();
    const telefone = telefoneInput.value;
    const email = emailInput.value;
    const endereco = enderecoInput.value;
    
    
    if (alertaNome(nome) &&
        alertaCpf(cpf) &&
        alertaGenero(genero) &&
        alertaDataNascimento(dataNascimento) &&
        alertaTelefone(telefone) &&
        alertaEmail(email) &&
        alertaEndereco(endereco))
    {
        if(modo === 'gravar') {
            fetch('http://localhost:3000/clientes', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "nome":nome,
                    "cpf":cpf,
                    "genero":genero,
                    "dataNascimento":dataNascimento, 
                    "telefone":telefone,
                    "email":email,
                    "endereco":endereco
                })
            })
            .then((res) => { return res.json(); })
            .then((resJSON) => {
                if(resJSON.status){
                    alert(resJSON.mensagem);
                    formCliente.reset();
                    exibirClientes();
                }
                else {
                    alert(resJSON.mensagem);
                }
            })
            .catch((erro) =>{
                alert('Erro ao incluir o cliente: ' + erro.message);
            })
        }
        else {
            fetch('http://localhost:3000/clientes/' + cpf, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "nome": nome,
                    "cpf": cpf,
                    "genero": genero,
                    "dataNascimento": dataNascimento, 
                    "telefone": telefone,
                    "email": email,
                    "endereco": endereco
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
                    const input = document.getElementById('cpf');
                    input.disabled = false;
                    formCliente.reset();
                    exibirClientes();
                }
                else {
                    alert(resJSON.mensagem);
                }
            })
            .catch((erro) =>{
                alert('Erro ao atualizar o cliente: ' + erro.message);
            })
        }
        limparClassesValidacao();
    }
    else {
        //=======================================================
        //nome
        if (!alertaNome(nome)) 
        {
            nomeInput.classList.remove('is-valid');
            nomeInput.classList.add('is-invalid');
        } else {
            nomeInput.classList.remove('is-invalid');
            nomeInput.classList.add('is-valid');
        }

        //=======================================================
        //cpf
        if (!alertaCpf(cpf)) 
        {
            cpfInput.classList.remove('is-valid');
            cpfInput.classList.add('is-invalid');
        } else {
            cpfInput.classList.remove('is-invalid');
            cpfInput.classList.add('is-valid');
        }

        //=======================================================
        //genero
        if (!alertaGenero(genero)) 
        {
            generoInput.classList.remove('is-valid');
            generoInput.classList.add('is-invalid');
        } else {
            generoInput.classList.remove('is-invalid');
            generoInput.classList.add('is-valid');
        }

        //=======================================================
        // dataNascimento
        if (!alertaDataNascimento(dataNascimento)) 
        {
            dataNascimentoInput.classList.remove('is-valid');
            dataNascimentoInput.classList.add('is-invalid');
        } else {
            dataNascimentoInput.classList.remove('is-invalid');
            dataNascimentoInput.classList.add('is-valid');
        }

        //=======================================================
        // telefone
        if (!alertaTelefone(telefone)) 
        {
            telefoneInput.classList.remove('is-valid');
            telefoneInput.classList.add('is-invalid');
        } else {
            telefoneInput.classList.remove('is-invalid');
            telefoneInput.classList.add('is-valid');
        }
        
        //=======================================================
        // email
        if (!alertaEmail(email)) 
        {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }

        //=======================================================
        // endereco
        if (!alertaEndereco(endereco)) 
        {
            enderecoInput.classList.remove('is-valid');
            enderecoInput.classList.add('is-invalid');
        } else {
            enderecoInput.classList.remove('is-invalid');
            enderecoInput.classList.add('is-valid');
        }
    }

    evento.stopPropagation();
    evento.preventDefault();
}
function limparClassesValidacao() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });

    const select = document.querySelector('select');
    select.classList.remove('is-invalid', 'is-valid');
}

//===========================================================================//

function excluir(cpf) {
    if (confirm("Deseja realmente excluir?")){
        fetch('http://localhost:3000/clientes/' + cpf, {
            method:"DELETE"
        })
        .then((res) => { return res.json(); })
        .then((resJSON) => {
            if(resJSON.status) {
                alert(resJSON.mensagem);// ta vindo do controle a resposta
                exibirClientes();
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
function exibirClientes() {
    const divTabela = document.getElementById('tabelaClientes');
    divTabela.innerHTML="";
    
    fetch('http://localhost:3000/clientes', {
        method:"GET"
    })
    .then((res) => { return res.json(); })
    .then((listaClientes) => {
        if (listaClientes.length > 0) {
            divTabela.classList.remove('w-50');
            divTabela.classList.remove('fw-bold');
            divTabela.classList.add('w-100');

            const tabela = document.createElement('table');
            tabela.className = 'table table-striped table-hover';

            const cabecalho = document.createElement('thead');
            cabecalho.innerHTML = `
                <tr>
                    <th>Nome Completo</th>
                    <th>CPF</th>
                    <th>Genero</th>
                    <th>Data de Nascimento</th>
                    <th>Telefone</th>
                    <th>E-mail</th>
                    <th>Endereço</th>
                    <th>####</th>
                </tr>
            `;

            const corpo = document.createElement('tbody');
            for (let i = 0; i < listaClientes.length; i++) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${listaClientes[i].nome}</td>
                    <td>${listaClientes[i].cpf}</td>
                    <td>${listaClientes[i].genero}</td>
                    <td>${new Date(listaClientes[i].dataNascimento).toLocaleDateString()}</td>
                    <td>${listaClientes[i].telefone}</td>
                    <td>${listaClientes[i].email}</td>
                    <td rowspan="1">${listaClientes[i].endereco}</td>
                    <td>
                        <button type='button' class='btn btn-danger' onclick='excluir("${listaClientes[i].cpf}")'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                        <button type='button' class='btn btn-warning' onclick='devolverHtml("${listaClientes[i].nome}",
                                                                                            "${listaClientes[i].cpf}",
                                                                                            "${listaClientes[i].genero}",
                                                                                            "${listaClientes[i].dataNascimento}",
                                                                                            "${listaClientes[i].telefone}",
                                                                                            "${listaClientes[i].email}",
                                                                                            "${listaClientes[i].endereco}")'>
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
        else {
            divTabela.classList.remove('w-100');
            divTabela.classList.add('w-50');
            divTabela.classList.add('fw-bold');
            const alertaMensagem = document.createElement('p');
            alertaMensagem.innerText = "Não Há Clientes Cadastrados!";
            divTabela.appendChild(alertaMensagem);
        }
    })
    .catch((erro) => {
        divTabela.classList.remove('w-100');
        divTabela.classList.add('w-50');
        divTabela.classList.add('fw-bold');
        const alertaMensagem = document.createElement('p');
        alertaMensagem.innerText = "Não foi possivel recuperar os clientes!";
        divTabela.appendChild(alertaMensagem);
        alert("Erro no banco de dados: " + erro.message);
    })
}
function devolverHtml(nome, cpf, genero, dataNascimento, telefone, email, endereco) {
    limparClassesValidacao();
    const botao = document.getElementById('botao');
    botao.classList.remove('btn-success');
    botao.classList.add('btn-warning');
    botao.innerText = 'Atualizar';
    modo = 'atualizar';

    const input = document.getElementById('cpf');
    input.value = cpf;
    input.disabled = true;
    document.getElementById('nome').value = nome;
    document.getElementById('genero').value = genero;
    document.getElementById('dataNascimento').value = formatarData(dataNascimento);
    document.getElementById('telefone').value = telefone;
    document.getElementById('email').value = email;
    document.getElementById('endereco').value = endereco;
}
function formatarData(data) {
    let regex = /^(\d{4})-(\d{2})-(\d{2})/;
    let res = data.match(regex);
    if (res) {
        let ano = res[1];
        let mes = res[2];
        let dia = res[3];
        return `${ano}-${mes}-${dia}`;
    } else {
        return null;
    }
}

//===========================================================================//

//########## ALERTAS ##########//
function alertaNome(nome) {
    if (nome === "" || !isNaN(nome)) {
        return false;
    } else {
        return true;
    }
}
function alertaGenero(genero) {
    if (genero === "") {
        return false;            
    } else {
        return true;
    }
}
function alertaDataNascimento(dataNascimento) {
    if (dataNascimento === "Invalid Date") {
        return false;            
    } else {
        return true;
    }
}
function alertaCpf(cpf) {
    const regex_cpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex_cpf.test(cpf);
}
function alertaTelefone(telefone) {
    const regex_tel = /^\(\d{2}\)\s*\d{4,5}-\d{4}$/;
    return regex_tel.test(telefone);
}
function alertaEmail(email) {
    const regex_email = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com|outlook\.com)$/;
    return regex_email.test(email);
}
function alertaEndereco(endereco) {
    const regex_endereco = /^(Avenida|Rua|avenida|rua)\s(?:.*\s)?/;
    return regex_endereco.test(endereco);
}