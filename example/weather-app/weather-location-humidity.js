import {
    element,
    attribute,
    template
} from 'ceb';

import {getTempUnit} from './storage.js';

export const WeatherLocationHumidity = element().builders(
    template(`
        <div class="thumbnail text-center">
            <weather-location-value class="lead humidity" description="humidity" icon="humidity"></weather-location-value>
        </div>
    `),

    attribute('humidity').listen((el, oldVal, newVal) => {
        el.querySelector('.humidity').setAttribute('value', `${newVal}%`);
    })
).register('weather-location-humidity');
