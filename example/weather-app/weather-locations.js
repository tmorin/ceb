import {
    element,
    template,
    method,
    on,
    dispatchCustomEvent,
    toArray
} from 'ceb';

import {getLocationIds, setLocationIds} from './storage.js';

function appendFirst(parent, child) {
    if (parent.firstChild) {
        parent.insertBefore(child, parent.firstChild);
    } else {
        parent.appendChild(child);
    }
}

export const WeatherLocations = element().builders(
    template(`
        <weather-api></weather-api>
        <section class="locations"></section>
    `),

    method('createdCallback').invoke(el => {
        let locationIds = getLocationIds();
        if (locationIds.length > 0) {
            el.querySelector('weather-api').getByIds(locationIds).then(data => {
                data.list.forEach(locationData => {
                    let weatherLocation = document.createElement('weather-location');
                    weatherLocation.data = locationData;
                    appendFirst(el.querySelector('.locations'), weatherLocation);
                });
            }, xhr => {
                setLocationIds([]);
                if (xhr) {
                    if (typeof console !== 'undefined') {
                        console.error(el.tagName, 'addLocation', xhr);
                    }
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
            let weatherLocation = document.createElement('weather-location');
            weatherLocation.data = data;
            appendFirst(el.querySelector('.locations'), weatherLocation);
        }, xhr => {
            let locationIds = getLocationIds();
            setLocationIds(locationIds.splice(locationIds.indexOf(locationId), 1));
            if (xhr) {
                if (typeof console !== 'undefined') {
                    console.error(el.tagName, 'addLocation', xhr);
                }
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
            let weatherLocation = el.querySelector(`[location-id="${locationId}"]`);
            weatherLocation.parentNode.removeChild(weatherLocation);
        }
    }),

    method('removeAllLocations').invoke(el => {
        setLocationIds([]);
        toArray(el.querySelectorAll('weather-location'))
            .forEach(child => child.parentNode.removeChild(child));
    }),

    method('refreshAllLocations').invoke(el => {
        let locationIds = getLocationIds();
        if (locationIds.length > 0) {
            el.querySelector('weather-api').getByIds(locationIds).then(data => {
                data.list.forEach(locationData => el.querySelector(`[location-id="${locationData.id}"]`).data = locationData);
            }, xhr => {
                if (xhr) {
                    if (typeof console !== 'undefined') {
                        console.error(el.tagName, 'refreshAllLocations', xhr);
                    }
                    alert('Unable to load locations.');
                }
            });
        }
    }),

    on('location-refreshed').skip().delegate('.locations').invoke((el, evt)=> {
        dispatchCustomEvent(el, 'location-refreshed', {detail: evt.target});
    }),

    on('location-attached').skip().delegate('.locations').invoke((el, evt)=> {
        dispatchCustomEvent(el, 'location-added', {detail: evt.target});
    }),

    on('DOMNodeRemoved').delegate('.locations').invoke((el, evt)=> {
        if (evt.target.tagName === 'weather-location'.toUpperCase()) {
            dispatchCustomEvent(el, 'location-removed', {detail: evt.target});
        }
    })
).register('weather-locations');
