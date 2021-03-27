const cheerio = require('cheerio');
const axios = require('axios');
const Utils = require('./utils');

const BASE_URL = 'https://jkanime.net/';
const ANIME_URL = (id) => `${BASE_URL}${id}`;
const EPISODE_URL = (id, episode) => `${BASE_URL}${id}/${episode}`;

const home = async () => {
    const { data } = await axios.get(BASE_URL)
    const $ = cheerio.load(data)
    const homeList = {}
    homeList.latest_episodes = $('div.slider-box > .nivoSlider > a').toArray().map(element => {
        return {
            id: $(element).attr('href').split('/')[3],
            title: $(element).find('img').attr('title'),
            episode: parseInt($(element).attr('href').split('/')[4]),
        }
    })
    homeList.latest_episodes.push(...$('.ovas-container > a').toArray().map(element => {
        return {
            id: $(element).attr('href').split('/')[3],
            title: $(element).find('img').attr('title'),
            episode: parseInt($(element).attr('href').split('/')[4]) || 1,
        }
    }))
    homeList.ongoings = $('#programacion').find('.overview > a').toArray().map(element => {
        return {
            id: $(element).attr('href').split('/')[3],
            title: $(element).attr('title'),
            episode: parseInt($(element).attr('href').split('/')[4]),
        }
    })
    homeList.top_anime = $('.topten-ul > [class*="top"]').toArray().map(element => {
        return {
            id: $(element).find('a').attr('href').split('/')[3],
            title: $(element).find('img').attr('title')
        }
    })
    homeList.latest_additions = $('.content-box > .portada-box').toArray().map(div => {
        return {
            id: $(div).find('a').attr('href').split('/')[3],
            title: $(div).find('a').attr('title')
        }
    })
    return homeList
}

const info = async (id) => {
    const { data } = await axios.get(ANIME_URL(id));
    const $ = cheerio.load(data);
    return {
        id,
        title: $('.sinopsis-box > h2').text(),
        state: Utils.parseState($('.info-content > .info-field > .info-value').eq(6).text().trim()),
        synopsis: $('.sinopsis-box > .pc').text().replace('Sinopsis: ', '').trim(),
        episodes: parseInt($('div.navigation > a:last').html().match(/(\d+)(?!.*\d)/g)[0]),
    };
}

const servers = async (id, episode) => {
    const { data } = await axios.get(EPISODE_URL(id, episode))
    const $ = cheerio.load(data)
    const names = $('div.play-box > ul > li').toArray().map((element) => $(element).text())
    const script = $($('script').toArray().filter((element) => $(element).html().includes('var video = [];'))[0]).html()
    const serverUrl = script.match(/(?<=src=["'])([^"'])*/gm)
    const servers = []
    names.forEach((name, i) => servers.push({ name, url: serverUrl[i] }))
    return servers
}

module.exports = { home, info, servers }