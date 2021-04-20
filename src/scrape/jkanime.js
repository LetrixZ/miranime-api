const cheerio = require('cheerio')
const axios = require('axios')
const Utils = require('./utils')

const BASE_URL = 'https://jkanime.net/'
const ANIME_URL = (id) => `${BASE_URL}${id}`
const EPISODE_URL = (id, episode) => `${BASE_URL}${id}/${episode}`

const fs = require('fs')

const home = async () => {
    const { data } = await axios.get(BASE_URL)
    const $ = cheerio.load(data)
    // const $ = cheerio.load(fs.readFileSync('jk.html'))
    const homeList = {}
    homeList.latest_episodes = $('.hero__slider > div').toArray().map(element => {
        return {
            id: $(element).find('a').attr('href').split('/')[3],
            title: $(element).find('.hero__text > h2').text().trim(),
            episode: parseInt($(element).find('a').attr('href').split('/')[4]),
            thumbnail: $(element).attr('data-setbg')
        }
    })

    homeList.latest_episodes.push(...$('.solopc > .row > .col-lg-3').toArray().map(element => {
        return {
            id: $(element).find('a').attr('href').split('/')[3],
            title: $(element).find('.anime__item__text:last > h5').text(),
            episode: parseInt($(element).find('a').attr('href').split('/')[4]) || 1,
        }
    }))
    homeList.ongoings = $('.listadoanime-home > div > a').toArray().map(element => {
        return {
            id: $(element).attr('href').split('/')[3],
            title: $(element).find('.anime__sidebar__comment__item__text > h5').text(),
            episode: parseInt($(element).attr('href').split('/')[4]),
        }
    })
    homeList.top_anime = []
    const top1 = $('.destacados > .container > .row > div').eq(1)
    homeList.top_anime.push(
        {
            id: $(top1).find('a').attr('href').split('/')[3],
            title: $(top1).find('.comment').text().trim()
        }
    )
    $('.destacados > .container > .row > div').eq(2).find('.row > div').toArray().forEach(element => {
        homeList.top_anime.push({
            id: $(element).find('a').attr('href').split('/')[3],
            title: $(element).find('.comment').text().trim()
        })
    })
    homeList.latest_additions = $('.trending__anime > .row').eq(1).find('.anime__item').toArray().map(div => {
        return {
            id: $(div).find('a').attr('href').split('/')[3],
            title: $(div).find('a').attr('title')
        }
    })
    return homeList
}

const info = async (id) => {
    const { data } = await axios.get(ANIME_URL(id))
    const $ = cheerio.load(data)
    try {
        return {
            id,
            title: $('.anime__details__title').text(),
            state: Utils.parseState($('.anime__details__widget > div > div > ul > li:last').find('span:last').text().trim()),
            synopsis: $('.anime__details__text > p').text().replace('Sinopsis: ', '').trim(),
            episodes: parseInt($('.anime__pagination > a:last').html().match(/(\d+)(?!.*\d)/g)[0]),
        }
    } catch (e) {
        console.log(id)
        throw e
    }
}

const servers = async (id, episode) => {
    try {
        const { data } = await axios.get(EPISODE_URL(id, episode))
        const $ = cheerio.load(data)
        const names = $('div.bg-servers > a').toArray().map((element) => $(element).text())
        const script = $($('script').toArray().filter((element) => $(element).html().includes('var video = [];'))[0]).html()
        const serverUrl = script.match(/(?<=src=["'])([^"'])*/gm)
        const serverList = []
        names.forEach((name, i) => serverList.push({ name, url: serverUrl[i], web: 'JkAnime' }))
        return serverList
    } catch (e) {
        console.log(e)
        return null
    }
}

module.exports = { home, info, servers }