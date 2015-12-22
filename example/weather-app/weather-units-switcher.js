import {
    element,
    template,
    method,
    on,
    dispatchCustomEvent
} from 'ceb';

import {getUnits, setUnits} from './storage.js';

export const WeatherUnitsSwitcher = element().builders(
    template(`
        <form novalidate class="form-inline" name="unitsForm" title="select your favourite units family" onsubmit="return false;">
            <select class="form-control" name="units">
                <option value="standard">standard</option>
                <option value="metric">metric</option>
                <option value="imperial">imperial</option>
            </select>
        </form>
    `),

    method('createdCallback').invoke(el => {
        el.querySelector('select[name="units"]').value = getUnits();
    }),

    on('change').delegate('select').invoke((el, evt) => {
        setUnits(evt.target.value);
        dispatchCustomEvent(el, 'refresh-all-locations');
    })
).register('weather-units-switcher');
