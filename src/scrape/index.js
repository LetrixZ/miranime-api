const Anime = require('../models/animes')
const Sites = require('../models/sites')
const flv = require('./animeflv')
const tw = require('./animetw')
const jk = require('./jkanime')
const otakus = require('./otakustv')

const update = async (anime, data) => {
    if (data != null) {
        console.log(data)
        if (anime.synopsis == null || anime.synopsis.length < 1) { anime.synopsis = data?.synopsis; anime.save() }
        await anime.update({ episodes: data?.episodes, state: data?.state, })
    }
}

const updateFromSite = async (anime, sites) => {
    if (sites == null) {
        sites = await Sites.findAll({ where: { animeId: anime.id } })
    }
    if (anime.synopsis == null || anime.synopsis.length < 1 | anime.episodes == 0 | anime.state == 1 | anime.state == 3) {
        console.log('updating')
        if (sites.filter(it => it.name == 'JkAnime').length > 0) {
            const site = sites.filter(it => it.name == 'JkAnime')[0]
            await update(anime, await jk.info(site.link))
        } else if (sites.filter(it => it.name == 'AnimeFLV').length > 0) {
            const site = sites.filter(it => it.name == 'AnimeFLV')[0]
            await update(anime, await flv.info(site.link))
        } else if (sites.filter(it => it.name == 'AnimeTW').length > 0) {
            const site = sites.filter(it => it.name == 'AnimeTW')[0]
            await update(anime, await tw.info(site.link))
        } else if (sites.filter(it => it.name == 'OtakusTV').length > 0) {
            const site = sites.filter(it => it.name == 'OtakusTV')[0]
            await update(anime, await otakus.info(site.link))
        }
    }
}

const customHome = async () => {
    const homeList = {}
    const jkHome = jk.home()
    const otakusHome = otakus.home()
    // const flvHome = flv.home()
    homeList.top_anime = (await jkHome).top_anime
    homeList.latest_episodes = (await otakusHome).latest_episodes
    homeList.ongoings = (await otakusHome).ongoings
    homeList.latest_additions = (await jkHome).latest_additions
    return homeList
}

const getHome = async (site) => {
    let items = null
    switch (site) {
        case 'flv':
            items = await flv.home()
            break
        case 'jk':
            items = await jk.home()
            break
        case 'tw':
            items = await tw.home()
            break
        case 'otakus':
            items = await otakus.home()
            break
        default:
            items = await customHome()
            break
    }
    const lists = await Promise.all(Object.entries(items).map(async it => {
        return {
            title: it[0],
            list: (await Promise.all(it[1].map(async item => {
                const entry = (await Sites.findOne({ where: { link: item.id }, include: { model: Anime, include: Sites } }))
                const _anime = await entry?.anime
                const anime = await _anime?.serialize()
                if (anime != null) {
                    if (_anime.episodes == 0) {
                        _anime.episodes = item.episode
                        _anime.save()
                    }
                    anime.thumbnail = item.thumbnail
                    anime.latestEpisode = item.episode
                    return anime
                }
                else {
                    console.log(item)
                    return null
                }
            }))).filter(it => it != null)
        }
    }))
    return lists
}

module.exports = { updateFromSite, getHome }