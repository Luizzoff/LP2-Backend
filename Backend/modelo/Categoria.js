import DAO_Categoria from "../Persistencia/DAO_Categoria.js";

export default class Categoria{
    #codigo;
    #descricao;
    
    get codigo() { return this.#codigo; }
    get descricao() { return this.#descricao; }
    set codigo(novoCodigo) { this.#codigo = novoCodigo; }
    set descricao(novoDescricao) { this.#descricao = novoDescricao; }

    constructor(codigo=0,descricao=""){
        this.#codigo=codigo;
        this.#descricao=descricao;
    }

    toJSON(){
        return {
            "codigo": this.#codigo,
            "descricao": this.#descricao
        }
    }

    async gravar(){
        const categoriaDAO = new DAO_Categoria();
        await categoriaDAO.gravar(this);
    }
    
    async deletar(){
        const categoriaDAO = new DAO_Categoria();
        await categoriaDAO.deletar(this);
    }
    
    async atualizar(){
        const categoriaDAO = new DAO_Categoria();
        await categoriaDAO.atualizar(this);  
    }


    async consultar(termo){
        const categoriaDAO = new DAO_Categoria();
        return await categoriaDAO.consultar(termo);
    }

}