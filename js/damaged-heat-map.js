'use strict';

require([
    "esri/map",
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/renderers/HeatmapRenderer",
    "esri/dijit/Search",
    "dojo/domReady!"

], function (Map, InfoTemplate, FeatureLayer, HeatmapRenderer, Search) {
    // setting the basemap
    let map = new Map("damaged-heat-map-container", {
        basemap: "dark-gray-vector",
        center: [-95.25, 29.6122],
        zoom: 7
    });

    // setting the search widget
    let search = new Search({
        map: map
    }, "heatmap-search");

    // setting the InfowTemplate for damage information
    let template = new InfoTemplate();
    template.setTitle ("Damage Info");
    template.setContent("<b>Inundation Depth (ft):<b> ${IN_DEPTH:NumberFormat(places:1)}<br> <b>Damage Level:<b> ${DMG_LEVEL} <br> <b>County:<b> ${COUNTY}<br><br><b>Note:<br>MAJ = Major Damage<br>DES = Destroyed");

    // linking to the damaged buildings feature layer url
    let featureUrl = ("https://services8.arcgis.com/6o5BPp2zyzqM2NMp/arcgis/rest/services/FEMA_Damage/FeatureServer/0");

    // creating new feature layer for the heatmap and setting the fields to be used
    let heatLayer = new FeatureLayer(featureUrl,
        {
            infoTemplate:template,
            outFields: ["IN_DEPTH","DMG_LEVEL","COUNTY"]
        }
    );

    // defining heatmap visualization options
    let blurCtrl = document.getElementById("blurControl");
    let maxCtrl = document.getElementById("maxControl");
    let minCtrl = document.getElementById("minControl");


    // setting the heatmap analysis and properties for display
    let heatmapRenderer = new HeatmapRenderer({
        colors: ["rgba(200, 100, 150, 0)","rgba(75, 150, 200, 0.75)","rgba(200, 75, 100, 0.75)"],
        blurRadius: blurCtrl.value,
        maxPixelIntensity: maxCtrl.value,
        minPixelIntensity: minCtrl.value
    });

    // assigning the heatmap analysis for the feature layer
    heatLayer.setRenderer(heatmapRenderer);
    // finalizing the search widget
    search.startup();
    // adding the feature layer to the map
    map.addLayer(heatLayer);

    // adding interactive slider functions for the users
    let sliders = document.querySelectorAll(".blurInfo p~input[type=range]");

    let addLiveValue = function (ctrl){
        let val = ctrl.previousElementSibling.querySelector("span");
        ctrl.addEventListener("input", function (evt){
            val.innerHTML = evt.target.value;
        });
    };

    for (let i = 0; i < sliders.length; i++) {
        addLiveValue(sliders.item(i));
    }

    blurCtrl.addEventListener("change", function (evt){
        let r = +evt.target.value;
        if (r !== heatmapRenderer.blurRadius) {
            heatmapRenderer.blurRadius = r;
            heatLayer.redraw();
        }
    });

    maxCtrl.addEventListener("change", function (evt){
        let r = +evt.target.value;
        if (r !== heatmapRenderer.maxPixelIntensity) {
            heatmapRenderer.maxPixelIntensity = r;
            heatLayer.redraw();
        }
    });

    minCtrl.addEventListener("change", function (evt){
        let r = +evt.target.value;
        if (r !== heatmapRenderer.minPixelIntensity) {
            heatmapRenderer.minPixelIntensity = r;
            heatLayer.redraw();
        }
    });

    // setting the size of the InfoWindow
    map.infoWindow.resize(300, 500);

    window.addEventListener('destroy-arc-gis-widgets', () => {
        map.destroy();
        search.destroy();
    });
});
