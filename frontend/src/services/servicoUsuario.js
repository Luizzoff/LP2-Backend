// const url = 'https://luizzoff-lp2-backend.vercel.app/usuarios/';
const url = 'http://localhost:5000/usuarios/'

export async function consultar(nick, senha) {
    const res = await fetch(url + nick + "/" + senha,{
        method:'GET'
    })
    return await res.json();
}   