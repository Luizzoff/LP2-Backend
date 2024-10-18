import conectar from "./Conexao.js"
import Produto from "../modelo/Produto.js"
import Categoria from "../modelo/Categoria.js";

export default class DAO_Produto{
    constructor(){
        this.init();
    }
    async init(){
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS produto (
                    pro_codigo INT NOT NULL AUTO_INCREMENT,
                    pro_descricao VARCHAR(200) NOT NULL,
                    pro_precoCusto DECIMAL(10,2) NOT NULL,
                    pro_precoVenda DECIMAL(10,2) NOT NULL,
                    pro_qtdEstoque INT NOT NULL DEFAULT 0,
                    pro_urlImagem VARCHAR(250) NOT NULL,
                    pro_dataValidade DATE NOT NULL,
                    cat_codigo INT NOT NULL,
                    CONSTRAINT pk_produtos PRIMARY KEY (pro_codigo),
                    CONSTRAINT fk_produto_categoria FOREIGN KEY (cat_codigo) REFERENCES categoria (cat_codigo)
                );
            `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch(e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(produto){
        if(produto instanceof Produto){
            const conexao = await conectar();
            const sql = `
                INSERT INTO produto (pro_descricao, pro_precoCusto, pro_precoVenda, pro_qtdEstoque, pro_urlImagem, pro_dataValidade, cat_codigo)
                values(?,?,?,?,?,str_to_date(?,'%d/%m/%Y'),?)
            `;
            let parametros = [
                produto.descricao,
                produto.precoCusto,
                produto.precoVenda,
                produto.qtdEstoque,
                produto.urlImagem,
                produto.dataValidade,
                produto.categoria.codigo
            ];
            const resultado = await conexao.execute(sql,parametros);
            produto.codigo = resultado[0].insertId;
            await conexao.release();
        }
    }

    async deletar(produto){
        if(produto instanceof Produto){
            const conexao = await conectar();
            const sql = `DELETE FROM produto WHERE pro_codigo = ?`;
            let parametros = [produto.codigo];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async atualizar(produto){
        if(produto instanceof Produto){
            const conexao = await conectar();
            const sql = `
                UPDATE produto SET pro_descricao=?, pro_precoCusto=?, pro_precoVenda=?, pro_qtdEstoque=?, pro_urlImagem=?, pro_dataValidade=str_to_date(?,'%d/%m/%Y'), cat_categoria=? 
                WHERE pro_codigo = ?
            `;
            let parametros = [
                produto.descricao,
                produto.precoCusto,
                produto.precoVenda,
                produto.qtdEstoque,
                produto.urlImagem,
                produto.dataValidade,
                produto.categoria.codigo,
                produto.codigo
            ];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async consultar(termo){
        const conexao = await conectar();
        let sql = `
            SELECT * FROM produto p 
            INNER JOIN categoria c
            ON p.cat_codigo = c.cat_codigo
        `;
        let parametros = [];// parametros tem que ser um array
        
        if(!isNaN(parseInt(termo))){
            sql += " WHERE pro_codigo = ?";
            parametros = [termo];
        }
        
        const [dataBase, campos] = await conexao.execute(sql,parametros);
        await conexao.release();
        
        let listaProdutos = [];
        for(const linha of dataBase){
            const categoria = new Categoria(linha.cat_codigo, linha.cat_descricao);
            const produto = new Produto(
                linha.pro_codigo,
                linha.pro_descricao,
                linha.pro_precoCusto,
                linha.pro_precoVenda,
                linha.pro_qtdEstoque,
                linha.pro_urlImagem,
                linha.pro_dataValidade,
                categoria // objeto
            );
            listaProdutos.push(produto);
        }
        return listaProdutos;
    }
}