const AnimeFLV = require('./animeflv')
const JkAnime = require('./jkanime')

const update = async (anime, data) => {
    if (data != null) {
        if (anime.synopsis == null) { anime.synopsis = data?.synopsis; anime.save() }
        await anime.update({ episodes: data?.episodes, state: data?.state, })
    }
}

const updateFromSite = async (anime, sites) => {
    if (sites.filter(it => it.name == 'JkAnime').length > 0) {
        const site = sites.filter(it => it.name == 'JkAnime')[0]
        await update(anime, await JkAnime.info(site.link))
    } else if (sites.filter(it => it.name == 'AnimeFLV').length > 0) {
        const site = sites.filter(it => it.name == 'AnimeFLV')[0]
        await update(anime, await AnimeFLV.info(site.link))
    }
}

module.exports = { updateFromSite, AnimeFLV, JkAnime }