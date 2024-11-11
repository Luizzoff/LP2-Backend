import { legacy_createStore as createStore, combineReducers } from "redux";
import reduxCategoria from "./redux.categoria";
import reduxCliente from './redux.cliente';
import reduxFornecedor from "./redux.fornecedor";
import reduxProduto from "./redux.produto";
import reduxUsuarios from "./redux.usuario";

const repositorio = combineReducers({
    categorias: reduxCategoria,
    clientes: reduxCliente,
    fornecedores: reduxFornecedor,
    produtos: reduxProduto,
    usuarios: reduxUsuarios
});

const store = createStore(repositorio);

export default store;