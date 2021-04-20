const parseState = (state) => {
    console.log(state)
    state = state.toLowerCase()
    switch (state) {
        case 'en emision':
        case 'emitiendose':
            return 1
        case 'finalizado':
        case 'concluido':
            return 2
        case 'proximamente':
            return 3
        default:
            return 3
    }
}

const getSiteName = (site) => {
    switch (site) {
        // case 'AnimeFLV': return 'flv'
        case 'JkAnime': return 'jk'
        case 'OtakusTV': return 'otakus'
        case 'AnimeTW': return 'tw'
        case 'AnimeBoom': return 'boom'
        case 'AnimeFenix': return 'fenix'
        default: return site
    }
}

module.exports = { parseState, getSiteName }
