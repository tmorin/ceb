import {
    element,
    template,
    on
} from 'ceb';

import './weather-app.less';

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
export {WeatherMap} from './weather-map.js';
export {WeatherMapLocation} from './weather-map-location.js';
export {WeatherPlaceFinder} from './weather-place-finder.js';
export {WeatherToolbar} from './weather-toolbar.js';
export {WeatherUnitsSwitcher} from './weather-units-switcher.js';

export const WeatherApp = element().builders(
    template(`
        <div class="navbar navbar-default">
            <span class="navbar-brand">weather-app</span>
            <ul class="nav navbar-nav">
                <li class="navbar-form"><weather-units-switcher></weather-units-switcher></li>
                <li class="navbar-form"><weather-toolbar></weather-toolbar></li>
            </ul>
        </div>
        <weather-place-finder></weather-place-finder>
        <weather-map></weather-map>
        <weather-locations></weather-locations>
    `),

    on('toggle-place-finder').skip().invoke((el) => {
        let weatherPlaceFinder = el.querySelector('weather-place-finder');
        weatherPlaceFinder.shown = !weatherPlaceFinder.shown;
        if (weatherPlaceFinder.shown) {
            setTimeout(() => weatherPlaceFinder.focus(), 0);
        }
    }),

    on('toggle-map').skip().invoke((el) => {
        let weatherMap = el.querySelector('weather-map');
        weatherMap.shown = !weatherMap.shown;
    }),

    on('add-location').skip().invoke((el, evt) => {
        el.querySelector('weather-place-finder').shown = false;
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
    }),

    on('location-added').skip().invoke((el, evt) => {
        el.querySelector('weather-map').addMarker(evt.detail.data);
    }),

    on('location-refreshed').skip().invoke((el, evt) => {
        el.querySelector('weather-map').updateMarker(evt.detail.data);
    }),

    on('location-removed').skip().invoke((el, evt) => {
        el.querySelector('weather-map').removeMarker(evt.detail.data);
    })
).register('weather-app');
