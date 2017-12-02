'use strict';

require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/renderers/HeatmapRenderer",
    "esri/dijit/Search",
    "dojo/domReady!"

], function (Map,FeatureLayer, HeatmapRenderer, Search)
{
// setting the map
    let map = new Map("damaged-heat-map-container", {
        basemap: "dark-gray-vector",
        center: [-96.44109, 29.6122],
        zoom: 7
    });

// setting the search widget
    let search = new Search({
        map: map
    }, "heatmap-search");
// linking to the damaged buildings feature layer url
    let featureUrl = ("https://services8.arcgis.com/6o5BPp2zyzqM2NMp/arcgis/rest/services/FEMA_Damage/FeatureServer/0");

// creating new feature layer for the heatmap
    let heatLayer = new FeatureLayer(featureUrl);

// setting the heatmap analysis and properties
    let heatmapRenderer = new HeatmapRenderer({
        //colors: ["rgba(0, 0, 255, 0)","rgb(0, 0, 255)","rgb(255, 0, 255)", "rgb(255, 0, 0)"],
        colors: ["rgba(255, 150, 50, 0)","rgba(255, 200, 150, 0.5)","rgba(200, 75, 150, 0.5)"],
        blurRadius: 12,
        maxPixelIntensity: 250,
        minPixelIntensity: 10
    });
// assigning the heatmap analysis for the feature layer
    heatLayer.setRenderer(heatmapRenderer);
// finalizing the search widget
    search.startup();
// adding the feature layer to the map
    map.addLayer(heatLayer);

    window.addEventListener('destroy-arc-gis-widgets', () => {
       map.destroy();
       search.destroy();
    });
});