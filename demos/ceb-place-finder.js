/*jshint -W106*/
(function (g) {

    var ol = g.ol;
    var Rx = g.Rx;
    var $ = g.$;

    g.cebFeatureFrp.defaultLibrary = 'Rx';

    function setupMap(el) {
        if (!el.map) {
            var osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM()
            });
            el.map = new ol.Map({
                target: cebFeatureTemplate(el).map,
                layers: [osmLayer],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 1
                })
            });
        }
    }

    function destroyMap(el) {
        el.map.destroy();
    }

    var spyQuery = cebFeatureFrp.disposable(function (el) {
        return Rx.Observable.fromEvent(cebFeatureTemplate(el).query, 'keyup').map(function (evt) {
            return evt.target.value;
        }).distinctUntilChanged();
    }).handlers(function (el, observer) {
        observer.subscribe(function (query) {
            el.query = query;
        });
    });

    var spyPlaces = cebFeatureFrp.disposable(function (el) {
        return Rx.Observable.fromEvent(cebFeatureTemplate(el).places, 'change').map(function (evt) {
            return evt.target.value;
        }).distinctUntilChanged();
    }).handlers(function (el, observer) {
        observer.subscribe(function (value) {
            el.value = value;
        });
    });

    var searchPlaces = cebFeatureFrp.disposable(function (el) {
        return el.queryObserver.throttle(300).map(function (query) {
            return query;
        }).flatMapLatest(function (query) {
            el.map.setView(new ol.View({
                center: [0, 0],
                zoom: 1
            }));
            if (el.markersLayer) {
                el.map.removeLayer(el.markersLayer);
            }
            cebFeatureTemplate(el).places.innerHTML = '';
            return $.ajax({
                url: ' http://nominatim.openstreetmap.org/search.php',
                dataType: 'json',
                data: {
                    q: query,
                    format: 'json',
                    limit: 20
                }
            }).promise();
        });
    }).handlers(function (el, observer) {
        observer.subscribe(function (places) {
            el.places = places;
        });
    });

    var displayPlacesInList = cebFeatureFrp.disposable(function (el) {
        return el.placesObserver;
    }).handlers(function (el, observer) {
        observer.subscribe(function (places) {
            places.map(function (item) {
                var option = document.createElement('option');
                option.textContent = item.display_name;
                option.value = item.lon + ',' + item.lat;
                return option;
            }).forEach(cebFeatureTemplate(el).places.appendChild, cebFeatureTemplate(el).places);
        });
    });

    var displayPlacesInMap = cebFeatureFrp.disposable(function (el) {
        return el.placesObserver;
    }).handlers(function (el, observer) {
        observer.subscribe(function (places) {
            var featuresList = places.map(function (place) {
                var lat = parseFloat(place.lat);
                var lon = parseFloat(place.lon);
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')
                    },
                    properties: {
                        name: place.display_name,
                        icon: place.icon
                    }
                };
            });
            var vectorSource = new ol.source.GeoJSON({
                object: {
                    type: 'FeatureCollection',
                    features: featuresList
                }
            });
            el.markersLayer = new ol.layer.Vector({
                source: vectorSource,
                style: function (feature, resolution) {
                    var iconStyle;
                    if (feature.getProperties().icon) {
                        iconStyle = new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [10, 10],
                                anchorXUnits: 'pixels',
                                anchorYUnits: 'pixels',
                                opacity: 0.5,
                                src: feature.getProperties().icon
                            })
                        });
                    } else {
                        iconStyle = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 5,
                                fill: new ol.style.Fill({
                                    color: 'rgba(0, 0, 0, 0.5)'
                                })
                            })
                        });
                    }
                    return [iconStyle];
                }
            });
            el.map.addLayer(el.markersLayer);
        });
    });

    var displayValueInMap = cebFeatureFrp.disposable(function (el) {
        return el.valueObserver.map(function (value) {
            return value.split(',');
        });
    }).handlers(function (el, observer) {
        observer.subscribe(function (coord) {
            el.map.setView(new ol.View({
                center: [0, 0],
                zoom: 1
            }));
            if (el.valueLayer) {
                el.map.removeLayer(el.valueLayer);
            }
            if (coord.length > 1) {
                var lon = parseFloat(coord[0]);
                var lat = parseFloat(coord[1]);
                var feature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')
                    }
                };
                var vectorSource = new ol.source.GeoJSON({
                    object: {
                        type: 'FeatureCollection',
                        features: [feature]
                    }
                });
                el.valueLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: function (feature, resolution) {
                        var
                            iconStyle = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 5,
                                    fill: new ol.style.Fill({
                                        color: 'rgba(255, 0, 0, 1)'
                                    })
                                })
                            });
                        return [iconStyle];
                    }
                });
                el.map.addLayer(el.valueLayer);
            }
        });
    });

    var cebSelectCountryTpl = '';
    cebSelectCountryTpl += '<input type="hidden" ceb-ref="value">';
    cebSelectCountryTpl += '<input type="text" ceb-ref="query" placeholder="type a place">';
    cebSelectCountryTpl += '<select ceb-ref="places" size="21"></select>';
    cebSelectCountryTpl += '<section ceb-ref="map"></section>';

    ceb()
        .name('place-finder')
        .feature(cebFeatureTemplate, {
            template: cebSelectCountryTpl
        })
        .feature(cebFeatureFrp, {
            disposables: [
            spyQuery,
            spyPlaces,
            searchPlaces,
            displayPlacesInList,
            displayPlacesInMap,
            displayValueInMap
        ]
        })
        .methods({
            createdCallback: setupMap,
            insertedCallback: setupMap,
            detachedCallback: destroyMap
        })
        .properties({
            query: {
                attribute: true,
                observable: true,
                delegate: {
                    target: 'input[type="text"]',
                    property: 'value'
                }
            },
            places: {
                observable: true
            },
            name: {
                attribute: true,
                delegate: {
                    target: 'input[type="hidden"]'
                }
            },
            value: {
                attribute: true,
                observable: true,
                delegate: {
                    target: 'input[type="hidden"]'
                }
            }
        })
        .register();
}(this));
