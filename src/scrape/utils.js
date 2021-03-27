const parseState = (state) => {
    state = state.toLowerCase();
    switch (state) {
        case 'en emision':
        case 'emitiendose':
            return 1;
        case 'finalizado':
        case 'concluido':
            return 2;
        case 'proximamente':
            return 3;
        default:
            return 0;
    }
};

module.exports = { parseState };
