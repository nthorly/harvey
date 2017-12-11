'use strict';

require([
    "esri/map",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/dijit/LayerSwipe"
], function(Map, ArcGISTiledMapServiceLayer, LayerSwipe) {
    let map = new Map("layer-swipe-container",{
        basemap: "hybrid",
        center: [-95.760, 29.713],
        zoom: 15,
        maxZoom: 18,

    });

    // Harvey USACE flood image from my arcgis account
    let urlString = "https://ags-swg.esriemcs.com/arcgis/rest/services/HarveyImagery/Harvey50cm_sid/MapServer/";
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

