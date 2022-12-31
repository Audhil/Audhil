import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Mustache from 'mustache';
import fs from 'fs';

dotenv.config();

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
    refresh_date: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
        timeZone: 'Asia/Kolkata',
    }),
};

async function setWeatherInformation() {
    await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
    )
        .then(r => r.json())
        .then(r => {
            DATA.city_temperature = Math.round(r.main.temp);
            DATA.city_weather = r.weather.city_weather
            DATA.city_weather_icon = r.weather.city_weather_icon
            DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata',
            });
            DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata',
            });
        });
}

async function generateReadMe() {
    await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}

async function action() {
    await setWeatherInformation();
    await generateReadMe();
}

action();
