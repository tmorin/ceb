import {
    element,
    template,
    property,
    attribute,
    method,
    delegate,
    on,
    dispatchCustomEvent,
    toArray
} from 'ceb';

function padLeft(nbr, ref, val) {
    if (nbr > ref.length) {
        let paddedRef = ref;
        for (let i = ref.length; i < nbr; i++) {
            paddedRef = val + paddedRef;
        }
        return paddedRef;
    }
    return ref;
}

function getTime(date) {
    return `${padLeft(2, date.getHours() + '', '0')}:${padLeft(2, date.getMinutes() + '', '0')}`;
}

export const WeatherLocation = element().builders(
    template(`
        <div class="well">
            <weather-api></weather-api>
            <div class="pull-right">
                <button class="btn btn-default btn-sm" type="button" name="refresh">
                    <i class="glyphicon glyphicon-refresh"></i>
                </button>
                <button class="btn btn-default btn-sm" type="button" name="remove">
                    <i class="glyphicon glyphicon-remove"></i>
                </button>
            </div>
            <header class="lead">
                <span class="imgs"></span>
                <span class="name"></span>
                <small class="country"></small>
            </header>
            <section class="row">
                <div class="temperature col-sm-4"></div>
                <div class="pressure col-sm-4"></div>
                <div class="wind col-sm-4"></div>
            </section>
            <section class="row">
                <div class="humidity col-sm-4"></div>
                <div class="sunrise col-sm-4"></div>
                <div class="sunset col-sm-4"></div>
            </section>
            <section class="row">
                <div class="clouds col-sm-4"></div>
                <div class="rain col-sm-4"></div>
                <div class="snow col-sm-4"></div>
            </section>
            <footer>
                <span class="text-muted">updated at <span class="dt"></span></span>
            </footer>
        </div>
    `),

    attribute('location-id'),

    property('data').listen((el, old, data) => {
        el.locationId = data.id;

        el.querySelector('header .name').textContent = data.name;
        el.querySelector('header .country').textContent = data.sys.country;
        el.querySelector('header .imgs').innerHTML = data.weather.map(weather => `<i class="wi wi-owm-${weather.id}" title="${weather.description}"></i>`).join(' ');

        el.querySelector('footer .dt').textContent = getTime(new Date(data.dt * 1000));

        toArray(el.querySelectorAll('.well > section > *')).forEach(child => child.innerHTML = '');

        let header = document.createElement('weather-location-header');
        header.data = data;
        el.querySelector('header').appendChild(header);

        let temperature = document.createElement('weather-location-temperature');
        temperature.temp = data.main.temp;
        temperature.temp_min = data.main.temp_max > data.main.temp_min ? data.main.temp_min : undefined;
        temperature.temp_max = data.main.temp_min < data.main.temp_max ? data.main.temp_max : undefined;
        el.querySelector('.temperature').appendChild(temperature);

        let pressure = document.createElement('weather-location-pressure');
        pressure.pressure = data.main.pressure;
        pressure.sea_level = data.main.sea_level;
        pressure.grnd_level = data.main.grnd_level;
        el.querySelector('.pressure').appendChild(pressure);

        let humidity = document.createElement('weather-location-humidity');
        humidity.humidity = data.main.humidity;
        el.querySelector('.humidity').appendChild(humidity);

        if (data.wind) {
            let wind = document.createElement('weather-location-wind');
            wind.speed = data.wind.speed;
            wind.direction = data.wind.deg;
            wind.gust = data.wind.gust;
            el.querySelector('.wind').appendChild(wind);
        }

        let sunrise = document.createElement('weather-location-sunrise');
        sunrise.sunrise = getTime(new Date(data.sys.sunrise * 1000));
        el.querySelector('.sunrise').appendChild(sunrise);

        let sunset = document.createElement('weather-location-sunset');
        sunset.sunset = getTime(new Date(data.sys.sunset * 1000));
        el.querySelector('.sunset').appendChild(sunset);

        if (data.rain && Object.keys(data.rain).length > 0) {
            let rain = document.createElement('weather-location-rain');
            Object.keys(data.rain).map((key) => {
                let value = document.createElement('weather-location-value');
                value.description = `last ${key}`;
                value.value = `${data.rain[key]} mm`;
                return value;
            }).forEach(child => rain.lightDOM.appendChild(child));
            el.querySelector('.rain').appendChild(rain);
        }

        if (data.snow && Object.keys(data.snow).length > 0) {
            let rain = document.createElement('weather-location-snow');
            Object.keys(data.snow).map((key) => {
                let value = document.createElement('weather-location-value');
                value.description = `last ${key}`;
                value.value = `${data.snow[key]} mm`;
                return value;
            }).forEach(child => rain.lightDOM.appendChild(child));
            el.querySelector('.snow').appendChild(rain);
        }

        if (data.clouds && Object.keys(data.clouds).length > 0) {
            let rain = document.createElement('weather-location-clouds');
            Object.keys(data.clouds).map((key) => {
                let value = document.createElement('weather-location-value');
                value.description = key;
                value.value = `${data.clouds[key]}%`;
                return value;
            }).forEach(child => rain.lightDOM.appendChild(child));
            el.querySelector('.clouds').appendChild(rain);
        }

        dispatchCustomEvent(el, 'location-refreshed');
    }),

    method('attachedCallback').invoke(el => {
        dispatchCustomEvent(el, 'location-attached');
    }),

    method('refresh').invoke(el => {
        el.querySelector('weather-api').getById(el.locationId).then(data => {
            el.data = data;
        }, xhr => {
            if (xhr) {
                if (typeof console !== 'undefined') {
                    console.error(el.tagName, el.locationId, 'refresh', xhr);
                }
            }
        });
    }),

    on('click').delegate('button[name="refresh"]').skip().invoke(el => {
        el.refresh();
    }),

    on('click').delegate('button[name="remove"]').skip().invoke(el => {
        if (confirm('Do you really want to remove this location?')) {
            dispatchCustomEvent(el, 'remove-location', {detail: el.locationId});
        }
    })
).register('weather-location');
