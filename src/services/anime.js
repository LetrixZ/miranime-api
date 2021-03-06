const { Op } = require('sequelize')
const Anime = require('../models/animes')
const Sites = require('../models/sites')
const Scrape = require('../scrape')
const { insert: insertSite } = require('./site')

const get = async ({ id = null, idMal = null, idAl = null, update = true } = {}) => {
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

const insertEntry = async (item) => {
    return await Anime.create({
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

const updateEntry = async (item, entry) => {
    // console.log(`Updated ${entry.idMal}: ${entry.title}`)
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
    if (item.sites) {
        await insertSite(item.sites.map(it => {
            return {
                name: it.name,
                anime: item.idMal,
                id: it.id
            }
        }))
    }
    return entry
}

const insert = async (list) => {
    return await Promise.all(
        list.map(async (item) => {
            try {
                const entry = await Anime.findOne({ where: { idMal: item.idMal } })
                if (entry) return await updateEntry(item, entry)
                else return await insertEntry(item)
            } catch (e) {
                console.log(e)
                return null
            }
        }).filter(it => it != null)
    )
}

const update = async (list) => {
    return await Promise.all(
        list.map(async (item) => {
            where = null
            if (item.id) where = { id: item.id }
            else if (item.idMal) where = { idMal: item.idMal }
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