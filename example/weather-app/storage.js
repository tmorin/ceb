export function getUnits() {
    return localStorage.getItem('units') || 'standard';
}

export function setUnits(value) {
    localStorage.setItem('units', value);
}

export function getTempUnit() {
    switch (getUnits()) {
        case 'metric':
            return '°C';
        case 'imperial':
            return '°F';
        default:
            return '°K';
    }
}

export function getSpeedUnit() {
    switch (getUnits()) {
        case 'metric':
            return 'meter/s';
        case 'imperial':
            return 'miles/h';
        default:
            return 'meter/s';
    }
}

export function getLocationIds() {
    return JSON.parse(localStorage.getItem('locationIds') || '[]');
}


export function setLocationIds(locationIds) {
    localStorage.setItem('locationIds', JSON.stringify(locationIds || []));
}
