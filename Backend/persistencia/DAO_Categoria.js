import conectar from "./Conexao.js";
import Categoria from "../modelo/Categoria.js";

export default class DAO_Categoria{
    constructor(){
        this.init();
    }

    async init(){
        try{
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS categoria (
                    cat_codigo INT NOT NULL AUTO_INCREMENT,
                    cat_descricao VARCHAR(200) NOT NULL,
                    CONSTRAINT pk_categoria PRIMARY KEY (cat_codigo)
                )
            `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch(e){
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(categoria){
        if(categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "INSERT INTO categoria (cat_descricao) VALUES (?)";
            const parametros = [categoria.descricao];
            const resultado = await conexao.execute(sql,parametros);
            categoria.codigo = resultado[0].insertId;
            await conexao.release();
        }
    }

    async deletar(categoria){
        if(categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "DELETE FROM categoria WHERE cat_codigo = ?";
            const parametros = [categoria.codigo];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async atualizar(categoria){
        if(categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "UPDATE categoria SET cat_descricao = ?";
            const parametros = [categoria.descricao];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }


    async consultar(termo){
        const conexao = await conectar();
        let sql = "SELECT * FROM categoria";
        let parametros = [];
        if(!isNaN(parseInt(termo))){
            sql += " WHERE cat_codigo = ?";
            parametros = [termo];
        }
        else
            sql += " ORDER by cat_descricao";
        
        const [dataBase, campos] = await conexao.execute(sql, parametros);
        let listaCategorias=[];
        for(const linha of dataBase){
            const categoria = new Categoria(
                linha.cat_codigo,
                linha.cat_descricao
            );
            listaCategorias.push(categoria);
        }
        return listaCategorias
    }
}