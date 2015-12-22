import {
    element,
    template
} from 'ceb';

export const WeatherLocationRain = element().builders(
    template(`
        <div class="thumbnail text-center">
            <div class="lead text-center">
                <i class="wi wi-rain"></i>
                Rain
            </div>
            <hr>
            <content></content>
        </div>
    `)
).register('weather-location-rain');
