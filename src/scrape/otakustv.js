const cheerio = require('cheerio')
const axios = require('axios')
const Utils = require('./utils')
const { assertValidExecutionArguments } = require('graphql/execution/execute')

const BASE_URL = 'https://www.otakustv.com/'
const ANIME_URL = (id) => `${BASE_URL}anime/${id}`
const EPISODE_URL = (id, episode) => `${BASE_URL}anime/${id}/episodio-${episode}`

const home = async () => {
    const { data } = await axios.get(BASE_URL)
    const $ = cheerio.load(data)
    const homeList = {}
    $('.index-base > div > div').toArray().forEach((it, index) => {
        switch (index) {
            case 0:
                homeList.latest_episodes = $(it).find('.row > div').toArray().map(element => {
                    return {
                        id: $(element).find('a').attr('href').split('/')[4],
                        title: $(element).find('h1').text(),
                        episode: parseInt($(element).find('p').last().text().match(/\d+/)[0]),
                        thumbnail: 'https://www.otakustv.com/' + $(element).find('img').attr('src')
                    }
                })
                break
            case 1:
                homeList.finished = $(it).find('.row > div').toArray().map(element => {
                    return {
                        id: $(element).find('a').attr('href').split('/')[4],
                        title: $(element).find('h1').text(),
                        episode: parseInt($(element).find('p').last().text().match(/\d+/)[0]),
                    }
                })
                break
            case 2:
                homeList.top_anime = $(it).find('.carusel_ranking > div.item').toArray().map(element => {
                    return {
                        id: $(element).find('a').attr('href').split('/')[4],
                        title: $(element).find('a > p').text(),
                    }
                })
                break
            case 3:
                homeList.ongoings = $(it).find('.carusel_simulcast > div.item').toArray().map(element => {
                    return {
                        id: $(element).find('a').attr('href').split('/')[4],
                        title: $(element).find('a > p').text(),
                    }
                })
                break
            case 5:
                homeList.latest_additions = $(it).find('.carusel_reciente > div.item').toArray().map(element => {
                    return {
                        id: $(element).find('a').attr('href').split('/')[4],
                        title: $(element).find('a > p').text(),
                    }
                })
                break
        }
    })
    return homeList
}

const info = async (id) => {
    const { data } = await axios.get(ANIME_URL(id))
    const $ = cheerio.load(data)
    return {
        id,
        title: $('div.inn-text > h1').text(),
        state: Utils.parseState($('div.inn-text > a').text().trim()),
        synopsis: $('div#myModal').find('.modal-body').text().trim(),
        episodes: parseInt($('div#nav-episodios > div').last().find('div > div.row > div >h1').text()?.match(/\d+/g)?.[0] || 0),
    }
}

const servers = async (id, episode, anime) => {
    try {
        let data = null
        if (anime?.type == 'movie' && anime?.episodes == 1) {
            data = (await axios.get(`${BASE_URL}anime/${id}/pelicula`)).data
        }
        else data = (await axios.get(EPISODE_URL(id, episode))).data
        const $ = cheerio.load(data)
        return $('.menu_server > ul > li').toArray().map(element => {
            return {
                name: $(element).find('span').eq(1).text(),
                url: $(element).find('a').attr('rel'),
                web: 'OtakusTV'
            }
        })
    } catch (e) {
        console.log(e)
        return null
    }
}


module.exports = { home, info, servers }