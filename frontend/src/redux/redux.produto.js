const estadoInicialProduto = [];

const produtoReducer = (state = estadoInicialProduto, action) => {
    switch (action.type) {
        case 'setarPro':
            return action.payload;

        case 'gravarPro':
            return [...state, ...action.payload];

        case 'atualizarPro':
            return state.map(produto =>
                produto.codigo === action.payload.codigo ?
                    { ...produto, ...action.payload }
                    :
                    produto
            );

        case 'deletarPro':
            return state.filter(produto => produto.codigo !== action.payload.codigo);

        default:
            return state;
    }
};

export default produtoReducer;
