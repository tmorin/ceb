{% include "/doc/_urls.md" %}
# Weather Location

The goal of this example is to create a full single page application managing a list of locations.
Each location is displayed by a card showing its current weather.
The weather's data is fetched from [openweathermap].
Locations and settings are stored using the localStorage API. 

`weather-app` uses only the CSS part of [bootstrap] and [weather-icons].

The live example is alive [there][live-weather-app].

## UI elements

* `weather-app`: acts as a controller
  * `todo-locations`: to handle the locations management
    * `todo-units-switcher`: to change the units (metric, imperial, etc.)
    * `todo-toolbar`: useful buttons
    * `todo-map`: to display cities on a map
      * `todo-map-location`: to get info about a city
    * `todo-place-finder`: to find locations
    * `todo-location`: the _card_ of a location
      * `todo-location-clouds`: info about the clouds
      * `todo-location-humidity`: info about the humidity
      * `todo-location-pressure`: info about the pressure
      * `todo-location-rain`: info about the rain
      * `todo-location-snow`: info about the snow
      * `todo-location-sunrise`: info about the sunrise
      * `todo-location-sunset`: info about the sunset
      * `todo-location-temperature`: info about the temperature
      * `todo-location-value`: info about the value
      * `todo-location-wind`: info about the wind

## Logic elements

* `weather-api`: an element providing an API to make XHR request, this component is created by each elements requiring it
