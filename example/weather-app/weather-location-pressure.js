import {
    element,
    attribute,
    template
} from 'ceb';

import {getTempUnit} from './storage.js';

export const WeatherLocationPressure = element().builders(
    template(`
        <div class="thumbnail text-center">
            <weather-location-value class="lead pressure" description="pressure" icon="barometer"></weather-location-value>
            <hr>
            <div class="row">
                <weather-location-value class="col-sm-6 sea_level" description="sea level" value="n/a"></weather-location-value>
                <weather-location-value class="col-sm-6 grnd_level" description="ground level" value="n/a"></weather-location-value>
            </div>
        </div>
    `),

    attribute('pressure').listen((el, oldVal, newVal) => {
        el.querySelector('.pressure').setAttribute('value', `${newVal} hPa`);
    }),

    attribute('sea_level').listen((el, oldVal, newVal) => {
        el.querySelector('.sea_level').setAttribute('value', `${newVal} hPa`);
    }),

    attribute('grnd_level').listen((el, oldVal, newVal) => {
        el.querySelector('.grnd_level').setAttribute('value', `${newVal} hPa`);
    })
).register('weather-location-pressure');
