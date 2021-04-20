const cheerio = require('cheerio')
const axios = require('axios')
const Utils = require('./utils')

const BASE_URL = 'https://www.animefenix.com/'
const ANIME_URL = (id) => `${BASE_URL}${id}`
const EPISODE_URL = (id, episode) => `${BASE_URL}ver/${id}-${episode}`
const DIRECTORY_URL = (page) => `${BASE_URL}animes?page=${page}`

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

const servers = async (id, episode) => {
    try {
        const { data } = await axios.get(EPISODE_URL(id, episode))
        const $ = cheerio.load(data)
        const names = $('ul.episode-page__servers-list > li').toArray().map((element) => $(element).text().trim())
        // const script = $($('script').toArray().filter((element) => $(element).html().includes('var video = [];'))[0]).html()
        const script = $('.player-container').find('script').html()
        const serverUrl = script.match(/(?<=src=["'])([^"'])*/gm).map(it => {
            return it.replace('..', '').replace('/stream/amz.php', 'https://www.animefenix.com/stream/amz.php')
        })
        console.log(serverUrl)
        const serverList = []
        names.forEach((name, i) => serverList.push({ name, url: serverUrl[i], web: 'AnimeFenix' }))
        return serverList.map(it => {
            if (it.name == 'M') it.name = 'Mega'
            return it
        })
    } catch (e) {
        console.log(e)
        return null
    }
    return $('.menu_server > ul > li').toArray().map(element => {
        return {
            name: $(element).find('span').eq(1).text(),
            url: $(element).find('a').attr('rel'),
            web: 'AnimeFenix'
        }
    })
}


const directory = async (page) => {
    const { data } = await axios.get(DIRECTORY_URL(page))
    const $ = cheerio.load(data)
    return $('.list-series > .serie-card').toArray().map(element => {
        return {
            id: $(element).find('a').attr('href').split('/')[3],
            title: $(element).find('a').attr('title')
        }
    })
}



module.exports = { home, info, servers }