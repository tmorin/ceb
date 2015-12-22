import {
    element,
    template,
    method,
    toArray
} from 'ceb';

import {getLocationIds, setLocationIds} from './storage.js';

function appendCard(el, data) {
    let weatherCard = document.createElement('weather-location');
    weatherCard.locationId = data.id;
    weatherCard.data = data;
    el.querySelector('.locations').appendChild(weatherCard);
}

export const WeatherLocations = element().builders(
    template(`
       <section class="locations"></section>
    `),

    method('createdCallback').invoke(el => {
        el.appendChild(document.createElement('weather-api'));
        let locationIds = getLocationIds();
        if (locationIds.length > 0) {
            el.querySelector('weather-api').getByIds(locationIds).then(data => {
                data.list.forEach(locationData => appendCard(el, locationData));
            }, xhr => {
                storage.setLocationIds([]);
                if (xhr) {
                    console.error(el.tagName, 'addLocation', xhr);
                    alert('Unable to load locations.');
                }
            });
        }
    }),

    method('addLocation').invoke((el, locationId) => {
        let locationIds = getLocationIds();

        if (locationIds.indexOf(locationId) > -1) {
            return;
        }

        locationIds.push(locationId);
        setLocationIds(locationIds);

        el.querySelector('weather-api').getById(locationId).then(data => {
            appendCard(el, data);
        }, xhr => {
            let storage = el.querySelector('weather-storage');
            let locationIds = getLocationIds();
            setLocationIds(locationIds.splice(locationIds.indexOf(locationId), 1));
            if (xhr) {
                console.error(el.tagName, 'addLocation', xhr);
                alert('Unable to add the location.');
            }
        });
    }),

    method('removeLocation').invoke((el, locationId) => {
        let locationIds = getLocationIds();
        let index = locationIds.indexOf(locationId);
        if (index > -1) {
            locationIds.splice(index, 1);
            setLocationIds(locationIds);
            let location = el.querySelector(`[location-id="${locationId}"]`);
            location.parentNode.removeChild(location);
        }
    }),

    method('removeAllLocations').invoke(el => {
        setLocationIds([]);
        toArray(el.querySelectorAll('weather-location')).forEach(child => child.parentNode.removeChild(child));
    }),

    method('refreshAllLocations').invoke(el => {
        let locationIds = getLocationIds();
        if (locationIds.length > 0) {
            el.querySelector('weather-api').getByIds(locationIds).then(data => {
                data.list.forEach(locationData => el.querySelector(`[location-id="${locationData.id}"]`).data = locationData);
            }, xhr => {
                storage.setLocationIds([]);
                if (xhr) {
                    console.error(el.tagName, 'refreshAllLocations', xhr);
                    alert('Unable to load locations.');
                }
            });
        }
    })
).register('weather-locations');
