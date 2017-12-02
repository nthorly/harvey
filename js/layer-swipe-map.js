'use strict';

require([
    "esri/map",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/dijit/LayerSwipe",
    "esri/dijit/BasemapGallery",

], function(
    Map, ArcGISTiledMapServiceLayer, LayerSwipe, BasemapGallery
){

    let map = new Map("layer-swipe-container",{
        basemap: "hybrid",
        center: [-95.760, 29.713],
        zoom: 15,
        maxZoom: 18,

    });

    // Harvey NOAA flood image from my arcgis account
    let urlString = "https://tiles.arcgis.com/tiles/6o5BPp2zyzqM2NMp/arcgis/rest/services/Harvey_Image/MapServer";
    let tiledLayer = new ArcGISTiledMapServiceLayer(urlString);
    map.addLayers([tiledLayer]);

    // creating new LayerSwipe Widget
    let layerSwipe = new LayerSwipe({
        type: "vertical",
        left:950,
        map: map,
        layers: [tiledLayer]
    }, "layer-swipe-widget");
    layerSwipe.startup();

    window.addEventListener('destroy-arc-gis-widgets', () => {
        map.destroy();
        layerSwipe.destroy();
    });
});

