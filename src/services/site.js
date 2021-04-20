const { Op } = require('sequelize')
const Anime = require('../models/animes')
const Sites = require('../models/sites')
const Scrape = require('../scrape')
const { getSiteName } = require('../scrape/utils')

const get = async ({ id = null, idMal = null, idAl = null, update = false } = {}) => {
    let where
    if (id) where = { id: id }
    else if (idMal) where = { idMal: idMal }
    else if (idAl) where = { idAl: idAl }
    if (where) {
        const entry = await Anime.findOne({ where: where, include: Sites })
        if (entry == null) return null
        if (update == true) {
            await Scrape.updateFromSite(entry, entry.sites)
        }
        const anime = await entry?.serialize() || null
        return anime
    } else return null
}

const search = async (query) => {
    return await Promise.all(await (await Anime.findAll({
        where: {
            [Op.or]: {
                title: {
                    [Op.iLike]: `%${query}%`
                },
                synonyms: {
                    [Op.iLike]: `%${query}%`
                }
            }
        },
        include: Sites
    })).map(it => it.serialize()))
}

const fs = require('fs')

const insert = async (list) => {
    const non = []
    const sites = await Promise.all(
        list.map(async (item) => {
            try {
                const anime = await Anime.findOne({ where: { idMal: item.anime } })
                if (anime != null) {
                    return await Sites.create(
                        {
                            name: item.name,
                            animeId: anime.id,
                            link: item.id,
                            uid: `${getSiteName(item.name)}-${item.id}`
                        }
                    )
                } else {
                    console.log(item)
                    non.push(item)
                    return null
                }
            } catch (e) {
                return null
            }
        }).filter(it => it != null)
    )
    // fs.writeFileSync('non.json', JSON.stringify(non))
    return list
}

const update = async (list) => {
    return await Promise.all(
        list.map(async (item) => {
            where = null
            if (item.idMal) where = { idMal: item.idMal }
            else if (item.idAl) where = { idAl: item.idAl }
            const entry = await Anime.findOne({ where: where, include: Sites })
            if (entry) {
                await entry.update({
                    idMal: item?.idMal,
                    idAl: item?.idAl,
                    title: item?.title,
                    type: item?.type,
                    episodes: item?.episodes,
                    state: item?.state,
                    synopsis: item?.synopsis,
                    synonyms: item?.synonyms?.join('|'),
                    genres: item?.genres?.join('|'),
                    poster: item?.poster,
                    banner: item?.banner,
                    year: item?.year,
                    season: item?.season,
                })
            }
            return entry.serialize()
        })
    )
}

module.exports = { get, search, update, insert }