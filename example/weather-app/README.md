{% include "/doc/_urls.md" %}
# Weather Location

The goal of this example is to create a full single page application managing a list of locations.
Each location is displayed by a card showing its current weather.
The weather's data is fetched from [openweathermap].
Locations and settings are stored using the localStorage API. 

`weather-app` uses only the CSS part of [bootstrap] and [weather-icons].

The live example is alive [there](live-weather-app).

## UI elements

* `weather-app`: acts as a controller
  * `weather-units-switcher`: to change the units (metric, imperial, etc.)
  * `weather-toolbar`: useful buttons
  * `weather-map`: to display cities on a map
    * `weather-map-location`: to get info about a city
  * `weather-place-finder`: to find locations
  * `weather-locations`: to handle the locations management
    * `weather-location`: the _card_ of a location
      * `weather-location-clouds`: info about the clouds
      * `weather-location-humidity`: info about the humidity
      * `weather-location-pressure`: info about the pressure
      * `weather-location-rain`: info about the rain
      * `weather-location-snow`: info about the snow
      * `weather-location-sunrise`: info about the sunrise
      * `weather-location-sunset`: info about the sunset
      * `weather-location-temperature`: info about the temperature
      * `weather-location-value`: info about the value
      * `weather-location-wind`: info about the wind

## JS modules

 * `owm`: to handle the [openweathermap] REST API
 * `storage`: to handle the LocalStorage data (the units)
