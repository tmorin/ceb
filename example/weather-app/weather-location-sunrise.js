import {
    element,
    attribute,
    delegate,
    template
} from 'ceb';

export const WeatherLocationSunrise = element().builders(
    template(`
        <div class="thumbnail text-center">
            <weather-location-value class="lead sunrise" icon="sunrise" description="sunrise"></weather-location-value>
        </div>
    `),

    delegate(attribute('sunrise')).to('.sunrise').attribute('value')
).register('weather-location-sunrise');
