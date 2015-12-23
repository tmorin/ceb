import {
    element,
    template,
    attribute,
    method,
    property
} from 'ceb';

import 'leaflet/dist/leaflet.css';

import {
    map,
    tileLayer,
    marker,
    Icon
} from 'leaflet/dist/leaflet.js';

Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet/v0.7.7/images';

export const WeatherMap = element().builders(
    template(`
        <div class="well"></div>
    `),

    attribute('shown').boolean().listen((el, oldVal, newVal) => {
        el.style.display = newVal ? '' : 'none';
        el._map.invalidateSize();
    }),

    method('createdCallback').invoke(el => {
        el._markers = {};
        el.style.display = 'none';
    }),

    method('attachedCallback').invoke(el => {
        el._map = map(el.querySelector('.well')).fitWorld();
        tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(el._map);
    }),

    method('detachedCallback').invoke(el => {
        el._map.remove();
        el._map = null;
    }),

    method('addMarker').invoke((el, data) => {
        let weatherMapLocation = document.createElement('weather-map-location');
        weatherMapLocation.name = data.name;
        weatherMapLocation.country = data.sys.country;
        weatherMapLocation.temperature = data.main.temp;
        weatherMapLocation.pressure = data.main.pressure;
        el._markers[data.id] = marker([data.coord.lat, data.coord.lon]).bindPopup(weatherMapLocation);
        el._map.addLayer(el._markers[data.id]);
        el._map.fitWorld();
    }),

    method('updateMarker').invoke((el, data) => {
        let weatherMapLocation = el._markers[data.id].getPopup().getContent();
        weatherMapLocation.name = data.name;
        weatherMapLocation.country = data.sys.country;
        weatherMapLocation.temperature = data.main.temp;
        weatherMapLocation.pressure = data.main.pressure;
    }),

    method('removeMarker').invoke((el, data) => {
        el._map.removeLayer(el._markers[data.id]);
        delete el._markers[data.id];
        el._map.fitWorld();
    })
).register('weather-map');
