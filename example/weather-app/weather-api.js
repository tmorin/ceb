import {
    element,
    method
} from 'ceb';

const API_BASE_URL = 'http://api.openweathermap.org/data/2.5';
const API_FIND = `${API_BASE_URL}/find`;
const API_WEATHER = `${API_BASE_URL}/weather`;
const API_GROUP = `${API_BASE_URL}/group`;
const APP_ID = '2de143494c0b295cca9337e1e96b00e0';

import {getUnits} from './storage.js';

export const WeatherApi = element().builders(
    method('createdCallback').invoke(el => {
        el.appendChild(document.createElement('weather-storage'));
    }),

    method('abort').invoke(el => {
        if (el.current) {
            el.current.abort();
        }
    }),

    method('find').invoke((el, query) => {
        el.abort();
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                el.current = null;
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else if (xhr.status === 0) {
                    reject();
                } else {
                    reject(xhr);
                }
            };
            xhr.open('GET', `${API_FIND}?q=${query}&type=like&mode=json&appid=${APP_ID}&units=${getUnits()}&dust=${Date.now()}`);
            xhr.send();
            el.current = xhr;
        });
    }),

    method('getById').invoke((el, id) => {
        el.abort();
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                el.current = null;
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else if (xhr.status === 0) {
                    reject();
                } else {
                    reject(xhr);
                }
            };
            xhr.open('GET', `${API_WEATHER}?id=${id}&mode=json&appid=${APP_ID}&units=${getUnits()}&dust=${Date.now()}`);
            xhr.send();
            el.current = xhr;
        });
    }),

    method('getByIds').invoke((el, ids) => {
        el.abort();
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                el.current = null;
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else if (xhr.status === 0) {
                    reject();
                } else {
                    reject(xhr);
                }
            };
            xhr.open('GET', `${API_GROUP}?id=${ids.join(',')}&mode=json&appid=${APP_ID}&units=${getUnits()}&dust=${Date.now()}`);
            xhr.send();
            el.current = xhr;
        });
    })
).register('weather-api');
