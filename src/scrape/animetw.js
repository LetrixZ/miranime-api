const cheerio = require('cheerio')
const axios = require('axios')
const Utils = require('./utils')

const BASE_URL = 'https://animetw.net/'
const ANIME_URL = (id) => `${BASE_URL}anime/${id}`
const EPISODE_URL = (id, episode) => `${BASE_URL}ver/${id}-${episode}`

const home = async () => {
    const { data } = await axios.get(BASE_URL)
    const $ = cheerio.load(data)
    const homeLists = {}
    $('#app > .container > div > section').toArray().forEach((it, i) => {
        if (i == 0) {
            homeLists.latest_episodes = $(it).find('.card-grid > a').toArray().map(element => {
                return {
                    id: $(element).attr('href').match(/(?<=ver\/).*(?=-)/)[0],
                    title: $(element).find('div > h3').eq(0).text(),
                    episode: parseInt($(element).find('div > h3').text().match(/\d+/)[0]),
                    thumbnail: $(element).find('img').attr('src')
                }
            })
        } else if (i == 2) {
            homeLists.latest_additions = $(it).find('.card-grid > a').toArray().map(element => {
                return {
                    id: $(element).attr('href').split('/')[4],
                    title: $(element).find('div > h3').eq(0).text().replace(' Sub Español', '')
                }
            })
        }
    })
    return homeLists
}

const info = async (id) => {
    const { data } = await axios.get(ANIME_URL(id))
    const $ = cheerio.load(data)
    return {
        id: id,
        title: $('.AnimeSection__details > div > h1').text().replace(' Sub Español', ''),
        state: Utils.parseState($('.AnimeSection__status').text().trim()),
        synopsis: $('.AnimeSection__details > div.card > div.info-field').eq(3).find('.info-field__body').text().trim(),
        episodes: $('script')
            .toArray()
            .map((it) => {
                if ($(it).html().includes('window.episodesOfAnime')) {
                    return JSON.parse($(it).html().match(/\[(.*)]/)[0])[0].number
                } else null
            }).filter(it => it != null)[0]
    }
}

exports.outerHTML = function (str) {
    return $.html(this[0], this.options)
}

const servers = async (id, episode) => {
    try {
        const { data } = await axios.get(EPISODE_URL(id, episode))
        const $ = cheerio.load(data)
        let list = $('.PlayerSection__nav > a.PlayerSection__option').toArray().map(element => {
            return {
                name: $(element).text(),
                url: $.html(element).match(/(?<=').*(?=')/)[0],
                web: 'AnimeTW'
            }
        })
        if (list.length == 0) {
            list = [
                {
                    name: 'Default',
                    url: $('iframe#video').attr('src'),
                    web: 'AnimeTW'
                }
            ]
        }
        return list
    } catch (e) {
        console.log(e)
        return null
    }
}

module.exports = { home, info, servers }