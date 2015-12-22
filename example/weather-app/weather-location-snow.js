import {
    element,
    template
} from 'ceb';

export const WeatherLocationSnow = element().builders(
    template(`
        <div class="thumbnail text-center">
            <div class="lead text-center">
                <i class="wi wi-snow"></i>
                Snow
            </div>
            <hr>
            <content></content>
        </div>
    `)
).register('weather-location-snow');
