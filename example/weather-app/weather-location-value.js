import {
    element,
    attribute,
    delegate,
    template
} from 'ceb';

export const WeatherLocationValue = element().builders(
    template(`
        <strong></strong>
        <i style="display: none;"></i>
        <span></span>
    `),

    delegate(attribute('value')).to('strong').property('textContent'),

    delegate(attribute('description')).to('span').property('textContent'),

    attribute('icon').listen((el, oldVal, newVal) => {
        if (newVal) {
            el.querySelector('i').style.display = '';
            el.querySelector('i').setAttribute('class', `wi wi-${newVal}`);
        } else {
            el.querySelector('i').style.display = 'none';
            el.querySelector('i').removeAttribute('class');
        }
    })
).register('weather-location-value');
