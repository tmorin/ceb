import {
    element,
    attribute,
    template
} from 'ceb';

import {getTempUnit} from './storage.js';

export const WeatherLocationTemperature = element().builders(
    template(`
        <div class="thumbnail text-center">
            <weather-location-value class="lead temp" description="temperature" icon="thermometer"></weather-location-value>
            <hr>
            <div class="row">
                <weather-location-value class="col-md-6 temp_min" description="minimum" value="n/a"></weather-location-value>
                <weather-location-value class="col-md-6 temp_max" description="maximum" value="n/a"></weather-location-value>
            </div>
        </div>
    `),

    attribute('temp').listen((el, oldVal, newVal) => {
        el.querySelector('.temp').setAttribute('value', `${newVal} ${getTempUnit()}`);
    }),

    attribute('temp_min').listen((el, oldVal, newVal) => {
        el.querySelector('.temp_min').setAttribute('value', `${newVal} ${getTempUnit()}`);
    }),

    attribute('temp_max').listen((el, oldVal, newVal) => {
        el.querySelector('.temp_max').setAttribute('value', `${newVal} ${getTempUnit()}`);
    })
).register('weather-location-temperature');
