import {
    element,
    template
} from 'ceb';

export const WeatherLocationClouds = element().builders(
    template(`
        <div class="thumbnail text-center">
            <div class="lead text-center">
                <i class="wi wi-cloud"></i>
                Cloudiness
            </div>
            <hr>
            <content></content>
        </div>
    `)
).register('weather-location-clouds');
