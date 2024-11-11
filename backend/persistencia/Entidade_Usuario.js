import conectar from "./Conexao.js"
import Usuario from "../modelo/Usuario.js"

export default class DAO_Usuario{
    constructor(){
        this.iniciaDataBase();
    }
    async iniciaDataBase(){
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS usuarios (
                    nome VARCHAR(100) NOT NULL,
                    email VARCHAR(50) NOT NULL,
                    senha VARCHAR(50) NOT NULL,
                    senha_confirmacao VARCHAR(50) NOT NULL,
                    perfil VARCHAR(9) NOT NULL,
                    CONSTRAINT pk_usuarios PRIMARY KEY(email)
                )
            `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch(e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(usuario){
        if(usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `
                INSERT INTO usuarios(nome, email, senha, senha_confirmacao, perfil)
                values(?,?,?,?,?)
            `;
            let parametros = [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.senha_confirmacao,
                usuario.perfil
            ];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async excluir(usuario){
        if(usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `DELETE FROM usuarios WHERE email = ?`;
            let parametros = [usuario.email];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async atualizar(usuario){
        if(usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `UPDATE usuarios SET nome=?, senha=?, senha_confirmacao=?, perfil=?
                WHERE email = ?
            `;
            let parametros = [
                usuario.nome,
                usuario.senha,
                usuario.senha_confirmacao,
                usuario.perfil,
                usuario.email
            ];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async consultar(termo){
        const conexao = await conectar();
        const sql = `SELECT senha FROM usuarios WHERE nome = ?`;
        const parametros = [termo];
        const [dataBase, campos] = await conexao.execute(sql,parametros);
        await conexao.release();
        if (dataBase.length > 0) {
            return { senha: dataBase[0].senha, perfil: dataBase[0].perfil }; // Retorna a senha do primeiro usuário encontrado
        } else {
            return null; // Nenhum usuário encontrado
        }
    }
}
