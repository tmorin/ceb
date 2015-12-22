import {
    element,
    template,
    on
} from 'ceb';

import './weather-app.less';

export {WeatherApi} from './weather-api.js';
export {WeatherLocation} from './weather-location.js';
export {WeatherLocationClouds} from './weather-location-clouds.js';
export {WeatherLocationHumidity} from './weather-location-humidity.js';
export {WeatherLocationPressure} from './weather-location-pressure.js';
export {WeatherLocationRain} from './weather-location-rain.js';
export {WeatherLocationSnow} from './weather-location-snow.js';
export {WeatherLocationSunrise} from './weather-location-sunrise.js';
export {WeatherLocationSunset} from './weather-location-sunset.js';
export {WeatherLocationTemperature} from './weather-location-temperature.js';
export {WeatherLocationValue} from './weather-location-value.js';
export {WeatherLocationWind} from './weather-location-wind.js';
export {WeatherLocations} from './weather-locations.js';
export {WeatherPlaceFinder} from './weather-place-finder.js';
export {WeatherToolbar} from './weather-toolbar.js';
export {WeatherUnitsSwitcher} from './weather-units-switcher.js';

export const WeatherApp = element().builders(
    template(`
        <div>
            <weather-place-finder></weather-place-finder>
            <weather-units-switcher></weather-units-switcher>
            <weather-toolbar></weather-toolbar>
        </div>
        <weather-locations></weather-locations>
    `),

    on('add-location').skip().invoke((el, evt) => {
        el.querySelector('weather-locations').addLocation(evt.detail);
    }),

    on('remove-location').skip().invoke((el, evt) => {
        el.querySelector('weather-locations').removeLocation(evt.detail);
    }),

    on('remove-all-locations').skip().invoke((el) => {
        el.querySelector('weather-locations').removeAllLocations();
    }),

    on('refresh-all-locations').skip().invoke((el) => {
        el.querySelector('weather-locations').refreshAllLocations();
    })
).register('weather-app');
