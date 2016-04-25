const API_BASE_URL = 'http://api.openweathermap.org/data/2.5';
const API_FIND = `${API_BASE_URL}/find`;
const API_WEATHER = `${API_BASE_URL}/weather`;
const API_GROUP = `${API_BASE_URL}/group`;
const APP_ID = 'edf756882a6c411b7da79ef99e9f3010';

import {getUnits} from './storage.js';

export function find(query) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status === 0) {
                reject();
            } else {
                reject(xhr);
            }
        };
        xhr.open('GET', `${API_FIND}?q=${query}&type=like&mode=json&APPID=${APP_ID}&units=${getUnits()}&dust=${Date.now()}`);
        xhr.send();
    });
}

export function getById(id) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status === 0) {
                reject();
            } else {
                reject(xhr);
            }
        };
        xhr.open('GET', `${API_WEATHER}?id=${id}&mode=json&APPID=${APP_ID}&units=${getUnits()}&dust=${Date.now()}`);
        xhr.send();
    });
}
export function getByIds(ids) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status === 0) {
                reject();
            } else {
                reject(xhr);
            }
        };
        xhr.open('GET', `${API_GROUP}?id=${ids.join(',')}&mode=json&APPID=${APP_ID}&units=${getUnits()}&dust=${Date.now()}`);
        xhr.send();
    });
}
