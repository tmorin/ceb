import {
    element,
    attribute,
    delegate,
    template
} from 'ceb';

export const WeatherLocationSunset = element().builders(
    template(`
        <div class="thumbnail text-center">
            <weather-location-value class="lead sunset" icon="sunset" description="sunset"></weather-location-value>
        </div>
    `),

    delegate(attribute('sunset')).to('.sunset').attribute('value')

).register('weather-location-sunset');
