import {
    element,
    template,
    attribute,
    delegate
} from 'ceb';

export const WeatherMapLocation = element().builders(
    template(`
        <div>
            <strong class="name"></strong>
            <small class="country"></small>
        </div>
        <ul class="list-inline">
            <li><i class="wi wi-thermometer"></i> <span class="temperature"></span></li>
            <li><i class="wi wi-barometer"></i> <span class="pressure"></span></li>
        </ul>
    `),

    delegate(attribute('name')).to('.name').property('textContent'),

    delegate(attribute('country')).to('.country').property('textContent'),

    delegate(attribute('temperature')).to('.temperature').property('textContent'),

    delegate(attribute('pressure')).to('.pressure').property('textContent')
).register('weather-map-location');
