const { Op } = require('sequelize')
const Anime = require('../models/animes')
const Sites = require('../models/sites')
const Scrape = require('../scrape')
const { getSiteName } = require('../scrape/utils')
const JkAnime = require('../scrape/jkanime')
const AnimeTW = require('../scrape/animetw')
const OtakusTV = require('../scrape/otakustv')
const AnimeFenix = require('../scrape/animefenix')

const fs = require("fs")

const get = async ({ idMal, episode } = {}) => {
    console.log(idMal, episode)
    const entry = await Anime.findOne({ where: { idMal: idMal }, include: Sites })
    if (entry != null) {
        // return JSON.parse(fs.readFileSync('sites.json'))
        const sites = []
        if (entry.sites.filter(it => it.name == 'JkAnime').length > 0) {
            const site = entry.sites.filter(it => it.name == 'JkAnime')[0]
            const servers = await JkAnime.servers(site.link, episode)
            if (servers) sites.push({ site: 'JkAnime', servers})
        }
        if (entry.sites.filter(it => it.name == 'AnimeTW').length > 0) {
            const site = entry.sites.filter(it => it.name == 'AnimeTW')[0]
            const servers = await AnimeTW.servers(site.link, episode)
            if (servers) sites.push({ site: 'AnimeTW', servers})
        }
        if (entry.sites.filter(it => it.name == 'OtakusTV').length > 0) {
            const site = entry.sites.filter(it => it.name == 'OtakusTV')[0]
            const servers = await OtakusTV.servers(site.link, episode, entry)
            if (servers) sites.push({ site: 'OtakusTV', servers})
        }
        if (entry.sites.filter(it => it.name == 'AnimeFenix').length > 0) {
            const site = entry.sites.filter(it => it.name == 'AnimeFenix')[0]
            const servers = await AnimeFenix.servers(site.link, episode)
            if (servers) sites.push({ site: 'AnimeFenix', servers})
        }
        fs.writeFileSync('sites.json', JSON.stringify(sites))
        return sites
    } else return null
}

module.exports = { get }