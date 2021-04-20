const cheerio = require('cheerio')
const axios = require('axios')
const Utils = require('./utils')

const BASE_URL = 'https://www3.animeflv.net/'
const ANIME_URL = (id) => `${BASE_URL}anime/${id}`
const EPISODE_URL = (id, episode) => `${BASE_URL}ver/${id}-${episode}`

const fs = require('fs')

const home = async () => {
    const { data } = await axios.get(BASE_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19' } })
    const $ = cheerio.load(data)
    // const $ = cheerio.load(fs.readFileSync('flv.html'))
    const homeLists = {}
    homeLists.latest_episodes = $('ul.ListEpisodios > li')
        .toArray()
        .map((element) => {
            try {
                return {
                    id: $(element)
                        .find('a')
                        .attr('href')
                        .match(/(?<=ver\/).*(?=-)/g)[0],
                    title: $(element).find('.Title').text(),
                    episode: parseInt($(element).find('.Capi').text().match(/\d+/)[0]),
                    thumbnail: `https://cdn.animeflv.net/screenshots/${$(element).find('.Image > img').attr('src').match(/\d+/)[0]}/${$(element).find('.Capi').text().match(/\d+/)[0]}/3.jpg`
                }
            } catch (e) {
                console.log(e)
                return null
            }
        })
        .filter((it) => it != null)
    homeLists.latest_additions = $('ul.ListAnimes > li')
        .toArray()
        .map((element) => {
            try {
                return {
                    id: $(element)
                        .find('a')
                        .attr('href')
                        .match(/(?<=anime\/).*/g)[0],
                    title: $(element).find('h3.Title').text(),
                }
            } catch (e) {
                console.log(e)
                return null
            }
        })
        .filter((it) => it != null)
    homeLists.ongoings = $('ul.ListSdbr > li').toArray().map(element => {
        return {
            id: $(element).find('a').attr('href').split('/')[2],
            title: $(element).find('a').text()
        }
    })
    return homeLists
}

const info = async (id) => {
    const { data } = await axios.get(ANIME_URL(id))
    const $ = cheerio.load(data)
    return {
        id: id,
        title: $('h1.Title').text(),
        state: Utils.parseState($('p.AnmStts').text()),
        synopsis: $('.Description').text().trim(),
        episodes: $('script')
            .toArray()
            .map((it) => {
                if ($(it).html().includes('var anime_info')) {
                    return JSON.parse($(it).html().match(/(?<=episodes = ).*(?=;)/)).length
                } else null
            }).filter(it => it != null)[0]
    }
}

const servers = async (id, episode) => {
    const { data } = await axios.get(EPISODE_URL(id, episode))
    const $ = cheerio.load(data)
    return $('script').toArray().map(element => {
        if ($(element).html().includes('var videos')) {
            return JSON.parse($(element).html().match(/(?<=videos = ).*(?=;)/)).SUB.map(server => {
                return {
                    name: server.title,
                    url: server.code
                }
            })
        } else return null
    }).filter(it => it != null)[0]
}

module.exports = { home, info, servers }