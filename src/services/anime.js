const { Op } = require('sequelize');
const Anime = require('../models/animes');
const Sites = require('../models/sites');
const Scrape = require('../scrape')

const get = async ({ id = null, idMal = null, idAl = null, update = false } = {}) => {
    let where
    if (id) where = { id: id }
    else if (idMal) where = { idMal: idMal };
    else if (idAl) where = { idAl: idAl };
    if (where) {
        const entry = await Anime.findOne({ where: where, include: Sites })
        if (update == true) {
            await Scrape.updateFromSite(entry, entry.sites)
        }
        return await entry.serialize()
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

const update = async (list) => {
    return await Promise.all(
        list.map(async (item) => {
            where = null;
            if (item.idMal) where = { idMal: item.idMal };
            else if (item.idAl) where = { idAl: item.idAl };
            const entry = await Anime.findOne({ where: where, include: Sites });
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
                });
            }
            return entry.serialize();
        })
    );
}

module.exports = { get, search, update }