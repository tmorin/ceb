import {
    element,
    attribute,
    template
} from 'ceb';

import {getSpeedUnit} from './storage.js';

export const WeatherLocationWind = element().builders(
    template(`
        <div class="thumbnail text-center">
            <weather-location-value class="lead direction" description="direction"></weather-location-value>
            <hr>
            <div class="row">
                <weather-location-value class="col-sm-6 speed" description="speed" value="n/a"></weather-location-value>
                <weather-location-value class="col-sm-6 gust" description="gust" value="n/a"></weather-location-value>
            </div>
        </div>
    `),

    attribute('direction').listen((el, oldVal, newVal) => {
        let direction = el.querySelector('.direction');
        let newDegValue = Math.round(parseFloat(newVal));

        direction.setAttribute('value', `${newVal}°`);

        if (isNaN(newDegValue)) {
            direction.setAttribute('icon', 'na');
        } else {
            direction.setAttribute('icon', `wind towards-${newDegValue}-deg`);
        }
    }),

    attribute('speed').listen((el, oldVal, newVal) => {
        el.querySelector('.speed').setAttribute('value', `${newVal} ${getSpeedUnit()}`);
    }),

    attribute('gust').listen((el, oldVal, newVal) => {
        el.querySelector('.gust').setAttribute('value', `${newVal} ${getSpeedUnit()}`);
    })
).register('weather-location-wind');
