const formProduto = document.getElementById('formProduto');
window.onload = exibirProdutos;
var modo = 'gravar'

formProduto.onsubmit = (evento) => {
    const descricaoInput = document.getElementById('descricao');
    const precoCustoInput = document.getElementById('precoCusto');
    const precoVendaInput = document.getElementById('precoVenda');
    const qtdEstoqueInput = document.getElementById('qtdEstoque');
    const urlImagemInput = document.getElementById('urlImagem');
    const dataValidadeInput = document.getElementById('dataValidade');

    const descricao = descricaoInput.value;
    const precoCusto = precoCustoInput.value;
    const precoVenda = precoVendaInput.value;
    const qtdEstoque = qtdEstoqueInput.value;
    const urlImagem = urlImagemInput.value;
    const dataValidade = new Date(dataValidadeInput.value).toLocaleDateString();

    if (alertaDescricao(descricao) &&
        alertaPrecoCusto(precoCusto) &&
        alertaPrecoVenda(precoVenda) &&
        alertaQtdEstoque(qtdEstoque) &&
        alertaUrlImagem(urlImagem) &&
        alertaDataValidade(dataValidade))
    {
        if(modo === 'gravar') {
            fetch('http://localhost:3000/produtos', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "descricao":descricao,
                    "precoCusto":precoCusto,
                    "precoVenda":precoVenda,
                    "qtdEstoque":qtdEstoque,
                    "urlImagem":urlImagem,
                    "dataValidade":dataValidade
                })
            })
            .then((res) => { return res.json(); })
            .then((resJSON) => {
                if(resJSON.status == true){
                    alert(resJSON.mensagem + '. Código gerado: ' + resJSON.codigo + resJSON.tdOK);
                    formProduto.reset();
                    exibirProdutos();
                }
                else {
                    alert(resJSON.mensagem);
                }
            })
            .catch((erro) =>{
                alert('Erro ao incluir o produto: ' + erro.message);
            })
        }
        else {
            fetch('http://localhost:3000/produtos/' + codigo, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "codigo": codigo,
                    "descricao": descricao,
                    "precoCusto": precoCusto,
                    "precoVenda": precoVenda,
                    "qtdEstoque": qtdEstoque,
                    "urlImagem": urlImagem,
                    "dataValidade": dataValidade
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
                    const input = document.getElementById('codigo');
                    input.disabled = false;
                    formProduto.reset();
                    exibirProdutos();
                }
                else {
                    alert(resJSON.mensagem);
                }
            })
            .catch((erro) =>{
                alert('Erro ao atualizar o produto: ' + erro.message);
            })
        }
        limparClassesValidacao();
    }
    else {
        formProduto.classList.add("was-validated");
        //=======================================================
        //codigo
        if (!alertaCodigo(codigo)) 
        {
            codigoInput.classList.remove('is-valid');
            codigoInput.classList.add('is-invalid');
        } else {
            codigoInput.classList.remove('is-invalid');
            codigoInput.classList.add('is-valid');
        }

        //=======================================================
        //dataValidade
        if (!alertaDataValidade(dataValidade)) 
        {
            dataValidadeInput.classList.remove('is-valid');
            dataValidadeInput.classList.add('is-invalid');
        } else {
            dataValidadeInput.classList.remove('is-invalid');
            dataValidadeInput.classList.add('is-valid');
        }

        //=======================================================
        //descricao
        if (!alertaDescricao(descricao))
        {
            descricaoInput.classList.remove('is-valid');
            descricaoInput.classList.add('is-invalid');
        } else {
            descricaoInput.classList.remove('is-invalid');
            descricaoInput.classList.add('is-valid');
        }

        //=======================================================
        //precoCusto
        if (!alertaPrecoCusto(precoCusto))
        {
            precoCustoInput.classList.remove('is-valid');
            precoCustoInput.classList.add('is-invalid');
        } else {
            precoCustoInput.classList.remove('is-invalid');
            precoCustoInput.classList.add('is-valid');
        }

        //=======================================================
        //precoVenda
        if (!alertaPrecoVenda(precoVenda))
        {
            precoVendaInput.classList.remove('is-valid');
            precoVendaInput.classList.add('is-invalid');
        } else {
            precoVendaInput.classList.remove('is-invalid');
            precoVendaInput.classList.add('is-valid');
        }

        //=======================================================
        //qtdEstoque
        if (!alertaQtdEstoque(qtdEstoque))
        {
            qtdEstoqueInput.classList.remove('is-valid');
            qtdEstoqueInput.classList.add('is-invalid');
        } else {
            qtdEstoqueInput.classList.remove('is-invalid');
            qtdEstoqueInput.classList.add('is-valid');
        }

        //=======================================================
        //urlImagem
        if (!alertaUrlImagem(urlImagem)) 
        {
            urlImagemInput.classList.remove('is-valid');
            urlImagemInput.classList.add('is-invalid');
        } else {
            urlImagemInput.classList.remove('is-invalid');
            urlImagemInput.classList.add('is-valid');
        }
    }            

    botao.disable = true;
    evento.stopPropagation();
    evento.preventDefault();
};
function limparClassesValidacao() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
}

//===========================================================================//

function excluir(codigo) {
    if (confirm("Deseja realmente excluir?")){
        fetch('http://localhost:3000/produtos/' + codigo, {
            method:"DELETE"
        })
        .then((res) => { return res.json(); })
        .then((resJSON) => {
            if(resJSON.status) {
                alert(resJSON.mensagem);// ta vindo do controle a resposta
                exibirProdutos();
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
function exibirProdutos() {
    const divTabela = document.getElementById('tabelaProdutos');
    divTabela.innerHTML = "";
    
    fetch('http://localhost:3000/produtos', {
        method:"GET"
    })
    .then((res) => { return res.json(); })
    .then((listaProdutos) => {
        if (listaProdutos.length > 0) {
            divTabela.classList.remove('fw-bold');
            const tabela = document.createElement('table');
            tabela.className = 'table table-striped table-hover';
    
            const cabecalho = document.createElement('thead');
            cabecalho.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Preço de Custo</th>
                <th>Preço de Venda</th>
                <th>Estoque</th>
                <th>Validade</th>
                <th>Imagem</th>
                <th>ID Categoria</th>
                <th>Categoria</th>
                <th>####</th>
            </tr>`;
    
            const corpo = document.createElement('tbody');
            for (let i = 0; i < listaProdutos.length; i++) {
                const tr = document.createElement('tr');
                //string literals
                tr.innerHTML = `
                    <td>${listaProdutos[i].codigo}</td>
                    <td>${listaProdutos[i].descricao}</td>
                    <td>${listaProdutos[i].precoCusto}</td>
                    <td>${listaProdutos[i].precoVenda}</td>
                    <td>${listaProdutos[i].qtdEstoque}</td>
                    <td style>${new Date(listaProdutos[i].dataValidade).toLocaleDateString()}</td>
                    <td>
                        <img width='32px' heigth='32px' src='${listaProdutos[i].urlImagem}'>
                    </td>
                    <td>${listaProdutos[i].categoria.codigo}</td>
                    <td>${listaProdutos[i].categoria.descricao}</td>
                    <td>
                        <button type='button' class='btn btn-danger' onclick='excluir("${listaProdutos[i].codigo}")'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                        <button type='button' class='btn btn-warning' onclick='devolverHtml("${listaProdutos[i].codigo}",
                                                                                            "${listaProdutos[i].descricao}",
                                                                                            "${listaProdutos[i].precoCusto}",
                                                                                            "${listaProdutos[i].precoVenda}",
                                                                                            "${listaProdutos[i].qtdEstoque}",
                                                                                            "${listaProdutos[i].urlImagem}",
                                                                                            "${listaProdutos[i].dataValidade}")'>
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
            divTabela.classList.add('fw-bold');
            const alertaMensagem = document.createElement('p');
            alertaMensagem.innerText = "Não Há Produtos Cadastrados!";
            divTabela.appendChild(alertaMensagem);
        }
    })
    .catch((erro) => {
        divTabela.classList.add('fw-bold');
        const alertaMensagem = document.createElement('p');
        alertaMensagem.innerText = "Não foi possivel recuperar os produtos!";
        divTabela.appendChild(alertaMensagem);
        alert("Erro no banco de dados: " + erro.message);
    })
}
function devolverHtml(codigo, descricao, precoCusto, precoVenda, qtdEstoque, urlImagem, dataValidade) {
    limparClassesValidacao();
    const botao = document.getElementById('botao');
    botao.classList.remove('btn-success');
    botao.classList.add('btn-warning');
    botao.innerText = 'Atualizar';
    modo = 'atualizar';

    const input = document.getElementById('codigo');
    input.value = codigo;
    // input.disabled = true;
    document.getElementById('descricao').value = descricao;
    document.getElementById('precoCusto').value = precoCusto;
    document.getElementById('precoVenda').value = precoVenda;
    document.getElementById('qtdEstoque').value = qtdEstoque;
    document.getElementById('urlImagem').value = urlImagem;
    document.getElementById('dataValidade').value = formatarData(dataValidade);
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

//########### Alertas ###########//
function alertaCodigo(codigo) {
    if (codigo <= 0 || codigo === "") {
        return false;
    } else {
        return true;
    }
}
function alertaDescricao(descricao) {
    if (descricao === "") {
        return false;
    } else {
        return true;
    }
}
function alertaPrecoCusto(precoCusto) {
    if (precoCusto === "" || isNaN(precoCusto) || precoCusto <= 0) {
        return false;
    } else {
        return true;
    }
}
function alertaPrecoVenda(precoVenda) {
    if (precoVenda === "" || isNaN(precoVenda) || precoVenda <= 0) {
        return false;
    } else {
        return true;
    }
}
function alertaQtdEstoque(qtdEstoque) {
    if (qtdEstoque === "" || isNaN(qtdEstoque) || qtdEstoque < 0) {
        return false;
    } else {
        return true;
    }
}
function alertaUrlImagem(urlImagem) {
    if (urlImagem === "") {
        return false;
    } else {
        return true;
    }
}
function alertaDataValidade(dataValidade) {
    if (dataValidade === "Invalid Date") {
        return false;
    } else {
        return true;
    }
}
